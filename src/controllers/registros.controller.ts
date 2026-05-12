// src/controllers/registros.controller.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { query as dbQuery } from '../config/database';
import { uploadImage } from '../config/cloudinary';
import { RegistroTerreno } from '../types';
import { EstadoRegistroTerreno, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import PDFDocument from 'pdfkit';
import { registrarMovimientoCRM } from '../services/movimientoCrm.service';

function parseEjeNumericoTexto(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '0';
  return raw.replace(/\s+/g, '').replace(/[–—]/g, '-');
}

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
      tipo_registro,
    } = req.body;

    // Aceptar snake_case y camelCase
    const metros_lineales: number | null =
      req.body.metros_lineales != null ? Number(req.body.metros_lineales)
      : req.body.metrosLineales != null ? Number(req.body.metrosLineales)
      : null;

    const itemizadoSacyr: string | null =
      req.body.itemizadoSacyr != null ? String(req.body.itemizadoSacyr) || null
      : req.body.itemizado_sacyr != null ? String(req.body.itemizado_sacyr) || null
      : null;

    const usuario_id = req.userId; // Del middleware auth

    const tiposValidos = ['sello_cortafuego', 'junta_lineal_espuma'];
    const tipoRegistroFinal =
      tipo_registro && tiposValidos.includes(tipo_registro as string)
        ? (tipo_registro as string)
        : 'sello_cortafuego';

    // Validar campos obligatorios
    // cantidad_sellos es opcional para junta_lineal_espuma (se usa metros_lineales)
    if (
      !obra_id ||
      !descripcion_material ||
      !modulo ||
      !piso ||
      !eje_numerico ||
      !eje_alfabetico ||
      !numero_sello ||
      (tipoRegistroFinal === 'sello_cortafuego' && !cantidad_sellos) ||
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
    const eje_numerico_norm = parseEjeNumericoTexto(eje_numerico);

    // Para junta_lineal_espuma, cantidad_sellos puede ser 0
    const cantidadSellosNorm =
      tipoRegistroFinal === 'junta_lineal_espuma'
        ? Number(cantidad_sellos ?? 0)
        : Number(cantidad_sellos);

    // Insertar en BD
    const result = await dbQuery<RegistroTerreno>(
      `INSERT INTO registros_terreno (
        obra_id, usuario_id, fecha, dia_semana, descripcion_material, modulo,
        piso, eje_numerico, eje_alfabetico, numero_sello, cantidad_sellos,
        nombre_sellador, holgura, accesibilidad, observaciones, fotos_urls, tipo_registro,
        metros_lineales, itemizado_sacyr
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        obra_id,
        usuario_id,
        fecha.toISOString(),
        dia_semana,
        descripcion_material,
        modulo,
        piso,
        eje_numerico_norm,
        eje_alfabetico,
        numero_sello,
        cantidadSellosNorm,
        nombre_sellador,
        holgura,
        accesibilidad,
        observaciones || null,
        fotosUrls,
        tipoRegistroFinal,
        metros_lineales,
        itemizadoSacyr,
      ]
    );

    const registro = result.rows[0];

    const obra = await prisma.obra.findUnique({
      where: { id: obra_id },
      select: {
        id: true,
        nombre: true,
        codigo: true,
      },
    });

    await registrarMovimientoCRM({
      usuarioId: usuario_id ?? '',
      modulo: 'OBRA',
      tipo: 'REGISTRO_CREADO',
      entidadId: registro.id,
      descripcion: `Se creó registro de sello en la obra ${obra?.nombre ?? obra_id}`,
      datos: {
        registroId: registro.id,
        obraId: obra_id,
        obraNombre: obra?.nombre ?? null,
        usuarioId: usuario_id,
        material: descripcion_material,
        modulo,
        piso,
        cantidadSellos: Number(cantidad_sellos),
        estado:'pendiente',
      },
    });

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
        fotos_registro: {
          select: { url: true },
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: [
        { fecha: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const result = registros.map(({ fotos_registro, ...reg }) => {
      const urls = fotos_registro.map((f) => f.url);
      return {
        ...reg,
        fotosUrls: urls,
        fotoUrl: urls[0] ?? null,
      };
    });

    res.json(result);
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
 * Actualizar estado de un registro y gestionar procesamiento_ingenieria como complemento técnico.
 * PATCH /api/registros/:id/estado
 *
 * Body: { estado, notas?, codigo?, itemizado_id? }
 *
 * NOTA DB: en_revision y rechazado crean procesamiento_ingenieria con campos mínimos.
 * Requiere que las columnas codigo, itemizado_id y total_sellos_calculado
 * sean NULL en la tabla procesamiento_ingenieria (aplicar migración primero).
 */
export const actualizarEstadoRegistro = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { estado, notas, codigo, itemizado_id } = req.body as {
      estado?: string;
      notas?: string;
      codigo?: string;
      itemizado_id?: string;
    };
    const usuario_id = req.userId;

    const estadosValidos: EstadoRegistroTerreno[] = [
      EstadoRegistroTerreno.pendiente,
      EstadoRegistroTerreno.en_revision,
      EstadoRegistroTerreno.validado,
      EstadoRegistroTerreno.rechazado,
    ];

    if (!estado || !estadosValidos.includes(estado as EstadoRegistroTerreno)) {
      res.status(400).json({ error: 'Estado inválido. Debe ser: pendiente, en_revision, validado o rechazado' });
      return;
    }

    const existente = await prisma.registroTerreno.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    // 1. Actualizar estado en registros_terreno (fuente de verdad)
    const registro = await prisma.registroTerreno.update({
      where: { id },
      data: { estado: estado as EstadoRegistroTerreno },
    });

    // 2. Gestionar procesamiento_ingenieria según el nuevo estado
    if (estado === EstadoRegistroTerreno.pendiente) {
      // pendiente: solo existe en registros_terreno, no requiere procesamiento técnico
    } else if (estado === EstadoRegistroTerreno.en_revision) {
      // Crear entrada de procesamiento si no existe; no duplicar si ya existe
      await dbQuery(
        `INSERT INTO procesamiento_ingenieria (registro_terreno_id, usuario_id, procesado_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (registro_terreno_id) DO UPDATE SET
           usuario_id = EXCLUDED.usuario_id`,
        [id, usuario_id]
      );
    } else if (estado === EstadoRegistroTerreno.validado) {
      // Calcular total técnico: cantidad_sellos × holgura × accesibilidad
      const total_sellos_calculado =
        Number(existente.cantidadSellos) *
        Number(existente.holgura) *
        Number(existente.accesibilidad);

      await dbQuery(
        `INSERT INTO procesamiento_ingenieria
           (registro_terreno_id, usuario_id, codigo, itemizado_id, total_sellos_calculado, notas, procesado_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (registro_terreno_id) DO UPDATE SET
           usuario_id             = EXCLUDED.usuario_id,
           codigo                 = COALESCE(EXCLUDED.codigo,        procesamiento_ingenieria.codigo),
           itemizado_id           = COALESCE(EXCLUDED.itemizado_id,  procesamiento_ingenieria.itemizado_id),
           total_sellos_calculado = EXCLUDED.total_sellos_calculado,
           notas                  = COALESCE(EXCLUDED.notas,         procesamiento_ingenieria.notas),
           procesado_at           = EXCLUDED.procesado_at`,
        [id, usuario_id, codigo ?? null, itemizado_id ?? null, total_sellos_calculado, notas ?? null]
      );
    } else if (estado === EstadoRegistroTerreno.rechazado) {
      await dbQuery(
        `INSERT INTO procesamiento_ingenieria (registro_terreno_id, usuario_id, notas, procesado_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (registro_terreno_id) DO UPDATE SET
           usuario_id   = EXCLUDED.usuario_id,
           notas        = COALESCE(EXCLUDED.notas, procesamiento_ingenieria.notas),
           procesado_at = EXCLUDED.procesado_at`,
        [id, usuario_id, notas ?? null]
      );
    }

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
  itemizadoSacyr?: unknown;
  itemizado_sacyr?: unknown;
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
      data.ejeNumerico = parseEjeNumericoTexto(body.eje_numerico);
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
    const sacyrRaw = body.itemizadoSacyr ?? body.itemizado_sacyr;
    if (sacyrRaw !== undefined) {
      data.itemizadoSacyr = sacyrRaw === null ? null : String(sacyrRaw) || null;
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

// ─── PDF constants ─────────────────────────────────────────────────────────────
const PDF_MARGIN = 40;
const PDF_W = 595;
const PDF_CONTENT_W = PDF_W - PDF_MARGIN * 2;

const BECK_YELLOW = '#f5c400';
const BECK_DARK   = '#111827';
const TEXT_DARK   = '#1e293b';
const TEXT_MUTED  = '#64748b';

const ESTADO_COLORS: Record<string, string> = {
  validado:    '#16a34a',
  en_revision: '#2563eb',
  rechazado:   '#dc2626',
  pendiente:   '#d97706',
};

// ─── PDF helpers ────────────────────────────────────────────────────────────────

const formatRegistroDate = (fecha: Date): string =>
  new Intl.DateTimeFormat('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(fecha);

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function pdfHRule(doc: PDFKit.PDFDocument, color = '#e2e8f0'): void {
  doc
    .strokeColor(color)
    .lineWidth(0.5)
    .moveTo(PDF_MARGIN, doc.y)
    .lineTo(PDF_W - PDF_MARGIN, doc.y)
    .stroke();
  doc.y += 6;
}

function pdfSectionHeader(doc: PDFKit.PDFDocument, title: string): void {
  doc.y += 4;
  const y = doc.y;
  doc.rect(PDF_MARGIN, y, PDF_CONTENT_W, 18).fill(BECK_DARK);
  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor('#ffffff')
    .text(title, PDF_MARGIN + 8, y + 5, { width: PDF_CONTENT_W - 16, lineBreak: false });
  doc.y = y + 18 + 7;
}

function pdfFieldRow(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string | number | null | undefined,
): void {
  const y = doc.y;
  const labelW = 140;
  const valW   = PDF_CONTENT_W - labelW;
  const valStr = value == null || value === '' ? '-' : String(value);

  doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT_MUTED)
    .text(label, PDF_MARGIN, y, { width: labelW, lineBreak: false });
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK)
    .text(valStr, PDF_MARGIN + labelW, y, { width: valW });

  if (doc.y < y + 13) doc.y = y + 13;
}

// ─── descargarRegistroPdf ───────────────────────────────────────────────────────

/**
 * GET /api/registros/:id/pdf
 * Genera un PDF técnico con logo Beck, datos del registro y fotos reales.
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
        obra:           { select: { id: true, nombre: true, codigo: true } },
        usuario:        { select: { id: true, nombre: true, email: true, rol: true } },
        fotos_registro: { select: { url: true }, orderBy: { created_at: 'asc' } },
      },
    });

    if (!registro) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    // URLs reales: prioridad fotos_registro, fallback fotosUrls de columna
    const fotoUrls: string[] =
      registro.fotos_registro.length > 0
        ? registro.fotos_registro.map((f) => f.url)
        : registro.fotosUrls;

    // Descargar imágenes en paralelo
    const imageBuffers = await Promise.all(fotoUrls.map(fetchImageBuffer));
    const validImages  = imageBuffers.filter((b): b is Buffer => b !== null);

    // Logo Beck
    const logoPath   = path.join(process.cwd(), 'public', 'logo-beck.png');
    const logoBuffer = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;

    // Campos dinámicos por tipo
    const esTipo = registro.tipoRegistro;
    const codigoRegistro = `REG-${registro.id.slice(0, 6).toUpperCase()}`;
    const tituloTipo =
      esTipo === 'junta_lineal_espuma'
        ? 'Registro de Junta Lineal Espuma'
        : 'Registro de Sello Cortafuego';
    const cantLabel =
      esTipo === 'junta_lineal_espuma' ? 'Longitud ejecutada (m)' : 'Cantidad de sellos';
    // Acceder a metrosLineales vía cast hasta que prisma generate actualice el cliente
    const regRaw = registro as unknown as Record<string, unknown>;
    const cantValor =
      esTipo === 'junta_lineal_espuma'
        ? (regRaw['metrosLineales'] != null ? String(regRaw['metrosLineales']) : '-')
        : String(registro.cantidadSellos);

    // ── Abrir documento ─────────────────────────────────────────────────────────
    const doc = new PDFDocument({ size: 'A4', margin: PDF_MARGIN });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${codigoRegistro}.pdf"`);
    doc.pipe(res);

    // ══════════════════════════════════════════════════════════════
    // ENCABEZADO
    // ══════════════════════════════════════════════════════════════

    // Barra amarilla superior
    doc.rect(0, 0, PDF_W, 5).fill(BECK_YELLOW);
    doc.y = 14;

    const headerY = doc.y;

    // Logo
    if (logoBuffer) {
      doc.image(logoBuffer, PDF_MARGIN, headerY, { height: 38 });
    }
    const textStartX = logoBuffer ? PDF_MARGIN + 52 : PDF_MARGIN;

    doc.font('Helvetica-Bold').fontSize(15).fillColor(BECK_DARK)
      .text('BECK Soluciones', textStartX, headerY, { lineBreak: false });
    doc.font('Helvetica').fontSize(9).fillColor(TEXT_MUTED)
      .text('Informe Técnico de Registro', textStartX, headerY + 20, { lineBreak: false });

    // Fecha de generación (derecha)
    const genDate = new Intl.DateTimeFormat('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date());
    doc.font('Helvetica').fontSize(8).fillColor('#94a3b8')
      .text(`Generado: ${genDate}`, PDF_MARGIN, headerY + 32, {
        width: PDF_CONTENT_W,
        align: 'right',
        lineBreak: false,
      });

    doc.y = headerY + 50;

    // Línea amarilla separadora
    doc.rect(PDF_MARGIN, doc.y, PDF_CONTENT_W, 1.5).fill(BECK_YELLOW);
    doc.y += 10;

    // ══════════════════════════════════════════════════════════════
    // TÍTULO
    // ══════════════════════════════════════════════════════════════

    doc.font('Helvetica-Bold').fontSize(14).fillColor(BECK_DARK)
      .text(tituloTipo);
    doc.y += 3;
    doc.font('Helvetica').fontSize(10).fillColor(TEXT_MUTED)
      .text(`Código: ${codigoRegistro}   ·   Fecha ejecución: ${formatRegistroDate(registro.fecha)}`);
    doc.y += 8;

    // Badge de estado
    const estadoColor = ESTADO_COLORS[registro.estado] ?? '#64748b';
    const badgeY = doc.y;
    doc.rect(PDF_MARGIN, badgeY, 100, 15).fill(estadoColor);
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff')
      .text(
        registro.estado.replace(/_/g, ' ').toUpperCase(),
        PDF_MARGIN + 5, badgeY + 4,
        { width: 90, lineBreak: false },
      );
    doc.y = badgeY + 22;

    pdfHRule(doc);

    // ══════════════════════════════════════════════════════════════
    // INFORMACIÓN GENERAL
    // ══════════════════════════════════════════════════════════════

    pdfSectionHeader(doc, 'INFORMACIÓN GENERAL');
    pdfFieldRow(doc, 'Obra:', `${registro.obra.nombre}${registro.obra.codigo ? ` (${registro.obra.codigo})` : ''}`);
    pdfFieldRow(doc, 'Ejecutado por:', `${registro.usuario.nombre} — ${registro.usuario.email}`);
    pdfFieldRow(doc, 'Día semana:', registro.diaSemana);

    pdfHRule(doc);

    // ══════════════════════════════════════════════════════════════
    // DATOS TÉCNICOS
    // ══════════════════════════════════════════════════════════════

    pdfSectionHeader(doc, 'DATOS TÉCNICOS');
    pdfFieldRow(doc, 'Descripción material:', registro.descripcionMaterial);
    pdfFieldRow(doc, 'Módulo / Recinto:',     registro.modulo);
    pdfFieldRow(doc, 'Piso:',                 registro.piso);
    pdfFieldRow(doc, 'Eje alfabético:',       registro.ejeAlfabetico);
    pdfFieldRow(doc, 'Eje numérico:',         registro.ejeNumerico);
    if (esTipo !== 'junta_lineal_espuma') {
      pdfFieldRow(doc, 'N° de sello:',        registro.numeroSello);
    }
    pdfFieldRow(doc, `${cantLabel}:`,         cantValor);
    pdfFieldRow(doc, 'Sellador:',             registro.nombreSellador);
    pdfFieldRow(doc, 'Holgura:',              registro.holgura.toString());
    pdfFieldRow(doc, 'Accesibilidad:',        registro.accesibilidad);

    pdfHRule(doc);

    // ══════════════════════════════════════════════════════════════
    // OBSERVACIONES
    // ══════════════════════════════════════════════════════════════

    pdfSectionHeader(doc, 'OBSERVACIONES');
    doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK)
      .text(registro.observaciones || 'Sin observaciones.', PDF_MARGIN, doc.y, {
        width: PDF_CONTENT_W,
      });
    doc.y += 6;

    pdfHRule(doc);

    // ══════════════════════════════════════════════════════════════
    // FOTOGRAFÍAS
    // ══════════════════════════════════════════════════════════════

    pdfSectionHeader(doc, 'FOTOGRAFÍAS DE REGISTRO');

    if (validImages.length === 0) {
      doc.font('Helvetica').fontSize(9).fillColor('#94a3b8')
        .text('Sin fotos asociadas.', PDF_MARGIN, doc.y);
    } else {
      const imgW  = Math.floor((PDF_CONTENT_W - 10) / 2); // ~252 px
      const imgH  = 175;
      const gap   = 10;
      let rowY    = doc.y + 4;
      let colIdx  = 0;

      for (const buf of validImages) {
        // Nueva fila: verificar espacio en página
        if (colIdx === 0 && rowY + imgH > 800) {
          doc.addPage();
          rowY = PDF_MARGIN;
        }

        const imgX = PDF_MARGIN + colIdx * (imgW + gap);
        try {
          doc.image(buf, imgX, rowY, { fit: [imgW, imgH] });
        } catch {
          // Imagen no procesable, se omite
        }

        colIdx++;
        if (colIdx >= 2) {
          colIdx = 0;
          rowY  += imgH + 10;
        }
      }

      // Avanzar cursor después de las imágenes
      doc.y = rowY + (colIdx > 0 ? imgH : 0) + 12;
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
       WHERE rt.estado = 'pendiente'
       ORDER BY rt.created_at ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar pendientes:', error);
    res.status(500).json({ error: 'Error al listar pendientes' });
  }
};
