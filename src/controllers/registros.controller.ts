// src/controllers/registros.controller.ts
import { Request, Response } from 'express';
import { query as dbQuery } from '../config/database';
import { uploadImage } from '../config/cloudinary';
import { RegistroTerreno } from '../types';
import { EstadoRegistroTerreno, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import PDFDocument from 'pdfkit';

/**
 * Crear un nuevo registro de terreno con fotos
 * POST /api/registros-terreno
 * Requiere autenticación y rol 'terreno' o 'administrador'
 */
export const crearRegistro = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      obra_id,
      descripcion_material,
      modulo,
      piso,
      eje_numerico,
      eje_alfabetico,
      numero_sello,
      cantidad_sellos,
      nombre_sellador,
      holgura,
      accesibilidad,
      observaciones,
    } = req.body;

    const usuario_id = req.userId; // Del middleware auth

    // Validar campos obligatorios
    if (
      !obra_id ||
      !descripcion_material ||
      !modulo ||
      !piso ||
      !eje_numerico ||
      !eje_alfabetico ||
      !numero_sello ||
      !cantidad_sellos ||
      !nombre_sellador ||
      !holgura ||
      !accesibilidad
    ) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }

    // Validar que existan fotos (mínimo 1, máximo 5)
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'Debe subir al menos 1 foto' });
      return;
    }
    if (files.length > 5) {
      res.status(400).json({ error: 'Máximo 5 fotos por registro' });
      return;
    }

    // Validar que la obra exista
    const obraCheck = await dbQuery('SELECT id FROM obras WHERE id = $1', [obra_id]);
    if (obraCheck.rows.length === 0) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    // Subir fotos a Cloudinary
    const fotosUrls: string[] = [];
    for (const file of files) {
      try {
        const url = await uploadImage(file.buffer, 'beck/registros');
        fotosUrls.push(url);
      } catch (uploadError) {
        console.error('Error al subir foto a Cloudinary:', uploadError);
        res.status(500).json({ error: 'Error al subir las fotos' });
        return;
      }
    }

    // Calcular día de semana
    const fecha = new Date();
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dia_semana = dias[fecha.getDay()];

    // Insertar en BD
    const result = await dbQuery<RegistroTerreno>(
      `INSERT INTO registros_terreno (
        obra_id, usuario_id, fecha, dia_semana, descripcion_material, modulo,
        piso, eje_numerico, eje_alfabetico, numero_sello, cantidad_sellos,
        nombre_sellador, holgura, accesibilidad, observaciones, fotos_urls
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        obra_id,
        usuario_id,
        fecha.toISOString(),
        dia_semana,
        descripcion_material,
        modulo,
        piso,
        eje_numerico,
        eje_alfabetico,
        numero_sello,
        cantidad_sellos,
        nombre_sellador,
        holgura,
        accesibilidad,
        observaciones || null,
        fotosUrls,
      ]
    );

    const registro = result.rows[0];

    // Crear notificaciones para usuarios de Ingeniería
    await dbQuery(
      `INSERT INTO notificaciones (usuario_id, tipo, referencia_id, mensaje)
       SELECT id, 'nuevo_registro', $1, $2
       FROM usuarios WHERE rol = 'ingenieria' AND activo = TRUE`,
      [
        registro.id,
        `Nuevo registro de ${nombre_sellador} en ${descripcion_material} (${modulo})`,
      ]
    );

    res.status(201).json(registro);
  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

/**
 * Listar registros de terreno
 * GET /api/registros
 * Query params opcionales: procesado (boolean), obra_id (uuid)
 */
export const listarRegistros = async (req: Request, res: Response): Promise<void> => {
  try {
    const { procesado, obra_id } = req.query;
    const usuario_id = req.userId;
    const user_rol = req.userRole;

    const where: Prisma.RegistroTerrenoWhereInput = {};

    if (procesado !== undefined) {
      where.estado = procesado === 'true'
        ? { not: EstadoRegistroTerreno.pendiente }
        : EstadoRegistroTerreno.pendiente;
    }

    if (typeof obra_id === 'string') {
      where.obraId = obra_id;
    }

    if (user_rol === 'terreno') {
      where.usuarioId = usuario_id;
    }

    const registros = await prisma.registroTerreno.findMany({
      where,
      include: {
        obra: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
          },
        },
      },
      orderBy: [
        { fecha: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(registros);
  } catch (error) {
    console.error('Error al listar registros:', error);
    res.status(500).json({ error: 'Error al listar registros' });
  }
};

/**
 * Obtener un registro específico por ID
 * GET /api/registros-terreno/:id
 */
export const obtenerRegistro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const usuario_id = req.userId;
    const user_rol = req.userRole;

    let query = `
      SELECT rt.*, o.nombre as obra_nombre, u.nombre as usuario_nombre
      FROM registros_terreno rt
      LEFT JOIN obras o ON rt.obra_id = o.id
      LEFT JOIN usuarios u ON rt.usuario_id = u.id
      WHERE rt.id = $1
    `;

    // Si es terreno, solo puede ver sus propios registros
    if (user_rol === 'terreno') {
      query += ` AND rt.usuario_id = $2`;
      const result = await dbQuery(query, [id, usuario_id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Registro no encontrado' });
        return;
      }
      res.json(result.rows[0]);
    } else {
      const result = await dbQuery(query, [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Registro no encontrado' });
        return;
      }
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error al obtener registro:', error);
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

/**
 * Actualizar estado de un registro
 * PATCH /api/registros/:id/estado
 */
export const actualizarEstadoRegistro = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { estado } = req.body as { estado?: string };

    const estadosValidos: EstadoRegistroTerreno[] = [
      EstadoRegistroTerreno.pendiente,
      EstadoRegistroTerreno.validado,
      EstadoRegistroTerreno.rechazado,
    ];

    if (!estado || !estadosValidos.includes(estado as EstadoRegistroTerreno)) {
      res.status(400).json({ error: 'Estado inválido. Debe ser: pendiente, validado o rechazado' });
      return;
    }

    const existente = await prisma.registroTerreno.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    const registro = await prisma.registroTerreno.update({
      where: { id },
      data: { estado: estado as EstadoRegistroTerreno },
    });

    res.json(registro);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado del registro' });
  }
};

/**
 * Listar registros pendientes de procesamiento (para Ingeniería)
 * GET /api/registros/pendientes
 */
interface ActualizarRegistroTerrenoBody {
  descripcion_material?: unknown;
  modulo?: unknown;
  piso?: unknown;
  eje_numerico?: unknown;
  eje_alfabetico?: unknown;
  numero_sello?: unknown;
  cantidad_sellos?: unknown;
  nombre_sellador?: unknown;
  holgura?: unknown;
  accesibilidad?: unknown;
  observaciones?: unknown;
  estado?: unknown;
}

const estadosEditables: EstadoRegistroTerreno[] = [
  EstadoRegistroTerreno.pendiente,
  EstadoRegistroTerreno.validado,
  EstadoRegistroTerreno.rechazado,
];

/**
 * Actualizar un registro de terreno
 * PUT /api/registros/:id
 */
export const actualizarRegistro = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const body = req.body as ActualizarRegistroTerrenoBody;

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'ID de registro invalido' });
      return;
    }

    const existente = await prisma.registroTerreno.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    if (body.estado !== undefined && !estadosEditables.includes(body.estado as EstadoRegistroTerreno)) {
      res.status(400).json({ error: 'Estado invalido. Debe ser: pendiente, validado o rechazado' });
      return;
    }

    const data: Prisma.RegistroTerrenoUpdateInput = {};

    if (body.descripcion_material !== undefined) {
      data.descripcionMaterial = String(body.descripcion_material);
    }
    if (body.modulo !== undefined) {
      data.modulo = String(body.modulo);
    }
    if (body.piso !== undefined) {
      data.piso = String(body.piso);
    }
    if (body.eje_numerico !== undefined) {
      data.ejeNumerico = Number(body.eje_numerico);
    }
    if (body.eje_alfabetico !== undefined) {
      data.ejeAlfabetico = String(body.eje_alfabetico);
    }
    if (body.numero_sello !== undefined) {
      data.numeroSello = String(body.numero_sello);
    }
    if (body.cantidad_sellos !== undefined) {
      data.cantidadSellos = Number(body.cantidad_sellos);
    }
    if (body.nombre_sellador !== undefined) {
      data.nombreSellador = String(body.nombre_sellador);
    }
    if (body.holgura !== undefined) {
      data.holgura = new Prisma.Decimal(String(body.holgura));
    }
    if (body.accesibilidad !== undefined) {
      data.accesibilidad = Number(body.accesibilidad);
    }
    if (body.observaciones !== undefined) {
      data.observaciones = body.observaciones === null ? null : String(body.observaciones);
    }
    if (body.estado !== undefined) {
      data.estado = body.estado as EstadoRegistroTerreno;
    }

    const registro = await prisma.registroTerreno.update({
      where: { id },
      data,
      include: {
        obra: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
          },
        },
      },
    });

    res.json(registro);
  } catch (error) {
    console.error('Error al actualizar registro:', error);
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

const formatRegistroDate = (fecha: Date): string => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(fecha);
};

const writePdfField = (
  doc: PDFKit.PDFDocument,
  label: string,
  value: string | number | null | undefined
): void => {
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#334155')
    .text(`${label}: `, { continued: true })
    .font('Helvetica')
    .fillColor('#0f172a')
    .text(value === null || value === undefined || value === '' ? '-' : String(value));
};

/**
 * Descargar PDF con detalle de un registro de terreno
 * GET /api/registros/:id/pdf
 */
export const descargarRegistroPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'ID de registro invalido' });
      return;
    }

    const registro = await prisma.registroTerreno.findUnique({
      where: { id },
      include: {
        obra: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
          },
        },
      },
    });

    if (!registro) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    const codigoRegistro = `REG-${registro.id.slice(0, 6)}`;
    const filename = `registro-${codigoRegistro}.pdf`;
    const doc = new PDFDocument({ size: 'A4', margin: 48 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .fillColor('#f97316')
      .text('BECK Soluciones');

    doc
      .moveDown(0.4)
      .fontSize(16)
      .fillColor('#0f172a')
      .text('Registro de sello cortafuego');

    doc
      .moveDown(0.3)
      .font('Helvetica')
      .fontSize(11)
      .fillColor('#475569')
      .text(`Codigo del registro: ${codigoRegistro}`);

    doc.moveDown(1);
    doc
      .strokeColor('#e2e8f0')
      .lineWidth(1)
      .moveTo(48, doc.y)
      .lineTo(547, doc.y)
      .stroke();

    doc.moveDown(1);
    writePdfField(doc, 'Obra', `${registro.obra.nombre} (${registro.obra.codigo})`);
    writePdfField(doc, 'Usuario/Terreno', `${registro.usuario.nombre} - ${registro.usuario.email}`);
    writePdfField(doc, 'Fecha', formatRegistroDate(registro.fecha));
    writePdfField(doc, 'Dia semana', registro.diaSemana);
    writePdfField(doc, 'Material', registro.descripcionMaterial);
    writePdfField(doc, 'Modulo', registro.modulo);
    writePdfField(doc, 'Piso', registro.piso);
    writePdfField(doc, 'Eje numerico', registro.ejeNumerico);
    writePdfField(doc, 'Eje alfabetico', registro.ejeAlfabetico);
    writePdfField(doc, 'N° sello', registro.numeroSello);
    writePdfField(doc, 'Cantidad sellos', registro.cantidadSellos);
    writePdfField(doc, 'Sellador', registro.nombreSellador);
    writePdfField(doc, 'Holgura', registro.holgura.toString());
    writePdfField(doc, 'Accesibilidad', registro.accesibilidad);
    writePdfField(doc, 'Estado', registro.estado);

    doc.moveDown(0.5);
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor('#334155')
      .text('Observaciones');
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#0f172a')
      .text(registro.observaciones || '-', { width: 500 });

    doc.moveDown(0.8);
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor('#334155')
      .text('Fotos URL');

    if (registro.fotosUrls.length > 0) {
      registro.fotosUrls.forEach((url, index) => {
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#2563eb')
          .text(`${index + 1}. ${url}`, { width: 500, link: url, underline: true });
      });
    } else {
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#0f172a')
        .text('-');
    }

    doc.end();
  } catch (error) {
    console.error('Error al descargar PDF de registro:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error al generar PDF del registro' });
    } else {
      res.end();
    }
  }
};

export const listarPendientes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await dbQuery(
      `SELECT rt.*, o.nombre as obra_nombre, u.nombre as usuario_nombre
       FROM registros_terreno rt
       LEFT JOIN obras o ON rt.obra_id = o.id
       LEFT JOIN usuarios u ON rt.usuario_id = u.id
       WHERE rt.procesado = FALSE
       ORDER BY rt.created_at ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar pendientes:', error);
    res.status(500).json({ error: 'Error al listar pendientes' });
  }
};
