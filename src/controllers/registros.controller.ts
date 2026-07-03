// src/controllers/registros.controller.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { query as dbQuery } from '../config/database';
import { uploadImage } from '../config/cloudinary';
import { RegistroTerreno } from '../types';
import { EstadoConformidadInspeccion, EstadoInspeccion, EstadoRegistroTerreno, EstadoValidacionObra, Prisma, ResultadoParametroInspeccion, RolUsuario } from '@prisma/client';
import { prisma } from '../config/prisma';
import PDFDocument from 'pdfkit';
import { registrarMovimientoCRM } from '../services/movimientoCrm.service';
import { buildCloudinaryFolder } from '../utils/cloudinaryFolder';
import {
  adjuntarCodigosBeck,
  adjuntarItemizadosMandante,
  obtenerItemizadoMandanteActivo,
  sanitizarRegistroPorRol,
  sanitizarRegistrosPorRol,
} from '../services/configuracionCamposRegistro.service';
import { calcularCamposRegistroTerreno, CalcRegistroResult } from '../utils/calculosRegistroTerreno';
import { validarTipoRegistroPermitidoPorObra } from '../helpers/tiposRegistro';
import { calcularRendimientoIndividual } from '../helpers/rendimientoRegistro';

function parseEjeNumericoTexto(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '0';
  return raw.replace(/\s+/g, '').replace(/[–—]/g, '-');
}

function parseDecimalOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;

  const raw = String(value).trim();
  if (!raw) return null;

  const hasDot = raw.includes('.');
  const hasComma = raw.includes(',');
  let normalized = raw;

  if (hasDot && hasComma) {
    normalized = raw.lastIndexOf(',') > raw.lastIndexOf('.')
      ? raw.replace(/\./g, '').replace(',', '.')
      : raw.replace(/,/g, '');
  } else if (hasComma) {
    normalized = raw.replace(',', '.');
  }

  const parsed = Number(normalized.replace(/\s/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseIntegerOrNull(value: unknown): number | null {
  const parsed = parseDecimalOrNull(value);
  return parsed === null ? null : Math.trunc(parsed);
}

function getBodyValue(body: Record<string, unknown>, snake: string, camel: string): unknown {
  if (body[snake] !== undefined) return body[snake];
  return body[camel];
}

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
    const codigoBeck =
      req.body.codigoBeck != null ? String(req.body.codigoBeck) || null
      : req.body.codigo_beck != null ? String(req.body.codigo_beck) || null
      : null;
    const itemizadoMandanteIdRaw = req.body.itemizadoMandanteId ?? req.body.itemizado_mandante_id;
    let itemizadoMandanteId: string | null = null;
    let codigoBeckFinal = codigoBeck;

    if (itemizadoMandanteIdRaw != null && String(itemizadoMandanteIdRaw).trim()) {
      const itemizadoMandante = await obtenerItemizadoMandanteActivo(String(itemizadoMandanteIdRaw).trim());
      if (!itemizadoMandante) {
        res.status(400).json({ error: 'Itemizado Mandante inválido o inactivo' });
        return;
      }
      itemizadoMandanteId = itemizadoMandante.id;
      codigoBeckFinal = itemizadoMandante.codigoBeck;
    }

    // Aceptar snake_case y camelCase
    const metros_lineales: number | null =
      req.body.metros_lineales != null ? Number(req.body.metros_lineales)
      : req.body.metrosLineales != null ? Number(req.body.metrosLineales)
      : null;

    const itemizadoMandanteTextoRaw =
      req.body.itemizado_mandante ??
      req.body.itemizadoMandanteTexto ??
      req.body.itemizadoSacyr ??
      req.body.itemizado_sacyr;
    const itemizadoMandanteTexto: string | null =
      itemizadoMandanteTextoRaw != null ? String(itemizadoMandanteTextoRaw) || null : null;
    const accesibilidadFinal = parseIntegerOrNull(
      getBodyValue(req.body, 'cielo_modular', 'cieloModular') ?? accesibilidad
    );
    const aislacion_raw = getBodyValue(req.body, 'aislacion', 'aislacion');
    const reparacion_tabique_raw = getBodyValue(req.body, 'reparacion_tabique', 'reparacionTabique');

    const usuario_id = req.userId; // Del middleware auth

    // Determinar tipo intentado (backward compat: default 'sello_cortafuego')
    const tipoIntentado =
      typeof tipo_registro === 'string' && tipo_registro.trim()
        ? tipo_registro.trim()
        : 'sello_cortafuego';

    // Validar campos obligatorios
    // cantidad_sellos es obligatorio solo para sello_cortafuego
    if (
      !obra_id ||
      !descripcion_material ||
      !modulo ||
      !piso ||
      !eje_numerico ||
      !eje_alfabetico ||
      !numero_sello ||
      (tipoIntentado === 'sello_cortafuego' && !cantidad_sellos) ||
      !nombre_sellador ||
      !holgura ||
      accesibilidadFinal == null
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
    const obraCheck = await dbQuery<{ id: string; codigo: string | null }>('SELECT id, codigo FROM obras WHERE id = $1', [obra_id]);
    if (obraCheck.rows.length === 0) {
      res.status(404).json({ error: 'Obra no encontrada' });
      return;
    }

    // Validar tipo de registro contra configuración de la obra
    const validacionTipo = await validarTipoRegistroPermitidoPorObra(obra_id, tipoIntentado);
    if (!validacionTipo.permitido) {
      res.status(400).json({ error: validacionTipo.error ?? 'Tipo de registro no permitido para esta obra.' });
      return;
    }
    const tipoRegistroFinal = validacionTipo.tipoNormalizado!;
    const warningTipoRegistro = validacionTipo.warning;

    const fecha = new Date();
    const folder = buildCloudinaryFolder(
      obraCheck.rows[0].codigo || obra_id,
      new Date(fecha),
      piso,
      nombre_sellador,
    );

    // Subir fotos a Cloudinary
    const fotosUrls: string[] = [];
    for (const file of files) {
      try {
        const url = await uploadImage(file.buffer, folder);
        fotosUrls.push(url);
      } catch (uploadError) {
        console.error('Error al subir foto a Cloudinary:', uploadError);
        res.status(500).json({ error: 'Error al subir las fotos' });
        return;
      }
    }

    // Calcular día de semana
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dia_semana = dias[fecha.getDay()];
    const eje_numerico_norm = parseEjeNumericoTexto(eje_numerico);

    // Para tipos distintos de sello_cortafuego, cantidad_sellos es opcional (default 0)
    const cantidadSellosNorm =
      tipoRegistroFinal !== 'sello_cortafuego'
        ? Number(cantidad_sellos ?? 0)
        : Number(cantidad_sellos);

    // Calcular campos derivados (fuente de verdad en backend)
    let calcResult!: CalcRegistroResult;
    try {
      calcResult = calcularCamposRegistroTerreno({
        cantidad_sellos: cantidadSellosNorm,
        holgura: Number(holgura),
        accesibilidad: accesibilidadFinal ?? 1,
        aislacion: aislacion_raw,
        reparacion_tabique: reparacion_tabique_raw,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'CORREGIR HOLGURA') {
        res.status(400).json({ error: 'CORREGIR HOLGURA' });
        return;
      }
      throw err;
    }

    // Insertar en BD
    const insertValues = [
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
      observaciones || null,
      fotosUrls,
      tipoRegistroFinal,
      metros_lineales,
      itemizadoMandanteTexto,
      calcResult.factor_por_holguras,
      accesibilidadFinal,
      calcResult.cantidad_sellos_con_factores,
      calcResult.aislacion_normalizada,
      calcResult.cantidad_sellos_aislacion,
      calcResult.reparacion_tabique_normalizada,
      calcResult.cantidad_final,
    ];

    const result = itemizadoMandanteId
      ? await dbQuery<RegistroTerreno>(
        `INSERT INTO registros_terreno (
          obra_id, usuario_id, fecha, dia_semana, descripcion_material, modulo,
          piso, eje_numerico, eje_alfabetico, numero_sello, cantidad_sellos,
          nombre_sellador, holgura, observaciones, fotos_urls, tipo_registro,
          metros_lineales, itemizado_mandante, factor_por_holguras, accesibilidad,
          cantidad_sellos_con_factores, aislacion, cantidad_sellos_aislacion,
          reparacion_tabique, cantidad_final, itemizado_mandante_id, codigo_beck
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        RETURNING *`,
        [...insertValues, itemizadoMandanteId, codigoBeckFinal],
      )
      : codigoBeckFinal
      ? await dbQuery<RegistroTerreno>(
        `INSERT INTO registros_terreno (
          obra_id, usuario_id, fecha, dia_semana, descripcion_material, modulo,
          piso, eje_numerico, eje_alfabetico, numero_sello, cantidad_sellos,
          nombre_sellador, holgura, observaciones, fotos_urls, tipo_registro,
          metros_lineales, itemizado_mandante, factor_por_holguras, accesibilidad,
          cantidad_sellos_con_factores, aislacion, cantidad_sellos_aislacion,
          reparacion_tabique, cantidad_final, codigo_beck
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        RETURNING *`,
        [...insertValues, codigoBeckFinal],
      )
      : await dbQuery<RegistroTerreno>(
        `INSERT INTO registros_terreno (
          obra_id, usuario_id, fecha, dia_semana, descripcion_material, modulo,
          piso, eje_numerico, eje_alfabetico, numero_sello, cantidad_sellos,
          nombre_sellador, holgura, observaciones, fotos_urls, tipo_registro,
          metros_lineales, itemizado_mandante, factor_por_holguras, accesibilidad,
          cantidad_sellos_con_factores, aislacion, cantidad_sellos_aislacion,
          reparacion_tabique, cantidad_final
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        RETURNING *`,
        insertValues,
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

    const [registroConCodigo] = await adjuntarCodigosBeck([registro as unknown as Record<string, unknown>]);
    const [registroConItemizado] = await adjuntarItemizadosMandante([registroConCodigo]);
    const respuesta: Record<string, unknown> = warningTipoRegistro
      ? { ...(registroConItemizado as Record<string, unknown>), warningTipoRegistro }
      : (registroConItemizado as Record<string, unknown>);
    res.status(201).json(respuesta);
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
        rechazadoPor: {
          select: { id: true, nombre: true, email: true, rol: true },
        },
        registroOrigen: {
          select: { id: true, numeroSello: true, descripcionMaterial: true, estado: true },
        },
        seleccionadoInspeccionPor: {
          select: { id: true, nombre: true },
        },
        controlesInspeccion: {
          select: { id: true, fecha: true, conformidad: true, ensayo: true },
          orderBy: { fecha: 'desc' as const },
          take: 1,
        },
      },
      orderBy: [
        { fecha: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const resultBase = registros.map(({ fotos_registro, ...reg }) => {
      const urls = fotos_registro.map((f) => f.url);
      return {
        ...reg,
        fotosUrls: urls,
        fotoUrl: urls[0] ?? null,
      };
    });

    const resultConCodigo = await adjuntarCodigosBeck(resultBase as Record<string, unknown>[]);
    const resultConItemizado = await adjuntarItemizadosMandante(resultConCodigo);
    const result = user_rol === 'terreno'
      ? await sanitizarRegistrosPorRol(resultConItemizado, 'trabajador')
      : resultConItemizado;

    res.json(result.map((reg) => ({ ...reg, ...calcularRendimientoIndividual(reg) })));
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
      SELECT rt.*, o.nombre as obra_nombre,
             u.nombre as usuario_nombre,
             ui.nombre as seleccionado_inspeccion_por_nombre
      FROM registros_terreno rt
      LEFT JOIN obras o ON rt.obra_id = o.id
      LEFT JOIN usuarios u ON rt.usuario_id = u.id
      LEFT JOIN usuarios ui ON rt.seleccionado_inspeccion_por_id = ui.id
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
      const [registroConCodigo] = await adjuntarCodigosBeck([result.rows[0]]);
      const [registro] = await adjuntarItemizadosMandante([registroConCodigo]);
      const sanitizado = await sanitizarRegistroPorRol(registro, 'trabajador');
      res.json({ ...sanitizado, ...calcularRendimientoIndividual(sanitizado) });
    } else {
      const result = await dbQuery(query, [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Registro no encontrado' });
        return;
      }
      const [registroConCodigo] = await adjuntarCodigosBeck([result.rows[0]]);
      const [registro] = await adjuntarItemizadosMandante([registroConCodigo]);
      res.json({ ...registro, ...calcularRendimientoIndividual(registro) });
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
    const { estado, notas, codigo, itemizado_id, codigoBeck, codigo_beck } = req.body as {
      estado?: string;
      notas?: string;
      codigo?: string;
      itemizado_id?: string;
      codigoBeck?: string | null;
      codigo_beck?: string | null;
    };
    const motivoRechazo: string | undefined =
      typeof req.body.motivoRechazo === 'string' ? req.body.motivoRechazo
      : typeof req.body.motivo_rechazo === 'string' ? req.body.motivo_rechazo
      : undefined;
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

    const codigoBeckRaw = codigoBeck ?? codigo_beck;
    if (codigoBeckRaw !== undefined) {
      await dbQuery(
        'UPDATE registros_terreno SET codigo_beck = $1 WHERE id = $2',
        [codigoBeckRaw === null ? null : String(codigoBeckRaw) || null, id],
      );
    }

    // ── Rechazo: transacción atómica + copia corregible ─────────────────────
    if (estado === EstadoRegistroTerreno.rechazado) {
      if (existente.estado !== EstadoRegistroTerreno.en_revision) {
        res.status(400).json({ error: 'Solo se puede rechazar un registro en estado en_revision' });
        return;
      }
      if (!motivoRechazo || !motivoRechazo.trim()) {
        res.status(400).json({ error: 'motivoRechazo es obligatorio al rechazar un registro' });
        return;
      }

      const { rechazado, copia } = await prisma.$transaction(async (tx) => {
        const rechazado = await tx.registroTerreno.update({
          where: { id },
          data: {
            estado:          EstadoRegistroTerreno.rechazado,
            motivoRechazo:   motivoRechazo.trim(),
            fechaRechazo:    new Date(),
            rechazadoPorId:  usuario_id ?? null,
          },
        });

        const copia = await tx.registroTerreno.create({
          data: {
            obraId:                    existente.obraId,
            usuarioId:                 existente.usuarioId,
            fecha:                     existente.fecha,
            diaSemana:                 existente.diaSemana,
            descripcionMaterial:       existente.descripcionMaterial,
            modulo:                    existente.modulo,
            piso:                      existente.piso,
            ejeNumerico:               existente.ejeNumerico,
            ejeAlfabetico:             existente.ejeAlfabetico,
            numeroSello:               existente.numeroSello,
            cantidadSellos:            existente.cantidadSellos,
            nombreSellador:            existente.nombreSellador,
            holgura:                   existente.holgura,
            observaciones:             existente.observaciones,
            fotosUrls:                 existente.fotosUrls,
            metrosLineales:            existente.metrosLineales,
            tipoRegistro:              existente.tipoRegistro,
            codigoBeck:                existente.codigoBeck,
            itemizadoMandanteId:       existente.itemizadoMandanteId,
            itemizadoBeck:             existente.itemizadoBeck,
            itemizadoMandanteTexto:    existente.itemizadoMandanteTexto,
            fotoUrl:                   existente.fotoUrl,
            recinto:                   existente.recinto,
            factorPorHolguras:         existente.factorPorHolguras,
            accesibilidad:             existente.accesibilidad,
            cantidadSellosConFactores: existente.cantidadSellosConFactores,
            aislacion:                 existente.aislacion,
            cantidadSellosAislacion:   existente.cantidadSellosAislacion,
            reparacionTabique:         existente.reparacionTabique,
            cantidadFinal:             existente.cantidadFinal,
            folio:                     existente.folio,
            estado:                    EstadoRegistroTerreno.pendiente,
            devuelto_a_tecnico:        true,
            esCorreccion:              true,
            registroOrigenId:          id,
          },
        });

        const fotos = await tx.fotos_registro.findMany({ where: { registro_id: id } });
        if (fotos.length > 0) {
          await tx.fotos_registro.createMany({
            data: fotos.map((f) => ({
              registro_id:    copia.id,
              url:            f.url,
              public_id:      f.public_id,
              formato:        f.formato,
              bytes:          f.bytes,
              nombre_archivo: f.nombre_archivo,
              subido_por_id:  f.subido_por_id,
            })),
          });
        }

        return { rechazado, copia };
      });

      await dbQuery(
        `INSERT INTO procesamiento_ingenieria (registro_terreno_id, usuario_id, notas, procesado_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (registro_terreno_id) DO UPDATE SET
           usuario_id   = EXCLUDED.usuario_id,
           notas        = COALESCE(EXCLUDED.notas, procesamiento_ingenieria.notas),
           procesado_at = EXCLUDED.procesado_at`,
        [id, usuario_id, notas ?? null],
      );

      const [withCodigo] = await adjuntarCodigosBeck([rechazado as unknown as Record<string, unknown>]);
      const [withItemizado] = await adjuntarItemizadosMandante([withCodigo]);
      res.json({ ...withItemizado, correccionId: copia.id });
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
      if (existente.estado !== EstadoRegistroTerreno.en_revision) {
        res.status(400).json({ error: 'Solo se puede validar un registro en estado en_revision' });
        return;
      }
      // Calcular total técnico con el factor actual de accesibilidad.
      const total_sellos_calculado =
        Number(existente.cantidadSellos) *
        Number(existente.holgura) *
        Number(existente.accesibilidad ?? 1);

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
    }

    const [registroConCodigo] = await adjuntarCodigosBeck([registro as unknown as Record<string, unknown>]);
    const [registroConItemizado] = await adjuntarItemizadosMandante([registroConCodigo]);
    res.json(registroConItemizado);
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
  factor_por_holguras?: unknown;
  factorPorHolguras?: unknown;
  cielo_modular?: unknown;
  cieloModular?: unknown;
  cantidad_sellos_con_factores?: unknown;
  cantidadSellosConFactores?: unknown;
  aislacion?: unknown;
  cantidad_sellos_aislacion?: unknown;
  cantidadSellosAislacion?: unknown;
  reparacion_tabique?: unknown;
  reparacionTabique?: unknown;
  cantidad_final?: unknown;
  cantidadFinal?: unknown;
  codigoBeck?: unknown;
  codigo_beck?: unknown;
  itemizadoMandanteId?: unknown;
  itemizado_mandante_id?: unknown;
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
    const codigoBeckRaw = body.codigoBeck ?? body.codigo_beck;
    const itemizadoMandanteIdRaw = body.itemizadoMandanteId ?? body.itemizado_mandante_id;
    let itemizadoMandanteIdFinal: string | null | undefined;
    let codigoBeckFinal: string | null | undefined =
      codigoBeckRaw === undefined
        ? undefined
        : codigoBeckRaw === null ? null : String(codigoBeckRaw) || null;

    if (itemizadoMandanteIdRaw !== undefined) {
      if (itemizadoMandanteIdRaw === null || String(itemizadoMandanteIdRaw).trim() === '') {
        itemizadoMandanteIdFinal = null;
      } else {
        const itemizadoMandante = await obtenerItemizadoMandanteActivo(String(itemizadoMandanteIdRaw).trim());
        if (!itemizadoMandante) {
          res.status(400).json({ error: 'Itemizado Mandante inválido o inactivo' });
          return;
        }
        itemizadoMandanteIdFinal = itemizadoMandante.id;
        codigoBeckFinal = itemizadoMandante.codigoBeck;
      }
    }

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
      data.itemizadoMandanteTexto = sacyrRaw === null ? null : String(sacyrRaw) || null;
    }
    const cieloModularRaw = getBodyValue(body as Record<string, unknown>, 'cielo_modular', 'cieloModular');
    if (cieloModularRaw !== undefined) {
      data.accesibilidad = cieloModularRaw === null || cieloModularRaw === ''
        ? null
        : parseIntegerOrNull(cieloModularRaw);
    }

    // Recalcular campos derivados usando valores actualizados + fallback al registro existente
    const holguraFinal = body.holgura !== undefined
      ? Number(String(body.holgura))
      : Number(existente.holgura);
    const cantidadSellosBase = body.cantidad_sellos !== undefined
      ? Number(body.cantidad_sellos)
      : existente.cantidadSellos;
    const accesibilidadBase = data.accesibilidad !== undefined
      ? (data.accesibilidad ?? 1)
      : (existente.accesibilidad ?? 1);
    const aislacionRaw = getBodyValue(body as Record<string, unknown>, 'aislacion', 'aislacion');
    const reparacionRaw = getBodyValue(body as Record<string, unknown>, 'reparacion_tabique', 'reparacionTabique');
    const aislacionBase = aislacionRaw !== undefined ? aislacionRaw : existente.aislacion;
    const reparacionBase = reparacionRaw !== undefined ? reparacionRaw : existente.reparacionTabique;

    let calcResult!: CalcRegistroResult;
    try {
      calcResult = calcularCamposRegistroTerreno({
        cantidad_sellos: cantidadSellosBase,
        holgura: holguraFinal,
        accesibilidad: accesibilidadBase,
        aislacion: aislacionBase,
        reparacion_tabique: reparacionBase,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'CORREGIR HOLGURA') {
        res.status(400).json({ error: 'CORREGIR HOLGURA' });
        return;
      }
      throw err;
    }

    data.factorPorHolguras = calcResult.factor_por_holguras;
    data.cantidadSellosConFactores = calcResult.cantidad_sellos_con_factores;
    data.aislacion = calcResult.aislacion_normalizada;
    data.cantidadSellosAislacion = calcResult.cantidad_sellos_aislacion;
    data.reparacionTabique = calcResult.reparacion_tabique_normalizada;
    data.cantidadFinal = calcResult.cantidad_final;

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

    if (itemizadoMandanteIdFinal !== undefined || codigoBeckFinal !== undefined) {
      await dbQuery(
        `UPDATE registros_terreno
         SET itemizado_mandante_id = CASE WHEN $1::boolean THEN $2::uuid ELSE itemizado_mandante_id END,
             codigo_beck = CASE WHEN $3::boolean THEN $4 ELSE codigo_beck END
         WHERE id = $5`,
        [
          itemizadoMandanteIdFinal !== undefined,
          itemizadoMandanteIdFinal,
          codigoBeckFinal !== undefined,
          codigoBeckFinal,
          id,
        ],
      );
    }

    const [registroConCodigo] = await adjuntarCodigosBeck([registro as unknown as Record<string, unknown>]);
    const [registroConItemizado] = await adjuntarItemizadosMandante([registroConCodigo]);
    res.json(registroConItemizado);
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

    const [registroExcel] = await adjuntarCodigosBeck([registro as unknown as Record<string, unknown>]);
    const codigoBeckPdf = typeof registroExcel.codigoBeck === 'string' && registroExcel.codigoBeck
      ? registroExcel.codigoBeck
      : null;

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
    const codigoRegistro = codigoBeckPdf ?? `REG-${registro.id.slice(0, 6).toUpperCase()}`;
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
    pdfFieldRow(doc, 'Código BECK:', codigoRegistro);
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
    pdfFieldRow(doc, 'Factor por holguras:',  regRaw['factor_por_holguras'] as string | number | null | undefined);
    pdfFieldRow(doc, 'Accesibilidad:',        regRaw['accesibilidad'] as string | number | null | undefined);
    pdfFieldRow(doc, 'Cantidad sellos con factores:', regRaw['cantidad_sellos_con_factores'] as string | number | null | undefined);
    pdfFieldRow(doc, 'Aislacion:',            regRaw['aislacion'] as string | number | null | undefined);
    pdfFieldRow(doc, 'Cantidad sellos aislacion:', regRaw['cantidad_sellos_aislacion'] as string | number | null | undefined);
    pdfFieldRow(doc, 'Reparacion tabique:',   regRaw['reparacion_tabique'] as string | number | null | undefined);
    pdfFieldRow(doc, 'Cantidad final:',       regRaw['cantidad_final'] as string | number | null | undefined);

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

      validImages.forEach((buf, imgIndex) => {
        // Nueva fila: verificar espacio en página
        if (colIdx === 0 && rowY + imgH > 800) {
          doc.addPage();
          rowY = PDF_MARGIN;
        }

        // Si la imagen está sola en su fila, centrarla horizontalmente
        const isAloneInRow = colIdx === 0 && imgIndex === validImages.length - 1;
        const imgX = isAloneInRow
          ? PDF_MARGIN + (PDF_CONTENT_W - imgW) / 2
          : PDF_MARGIN + colIdx * (imgW + gap);

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
      });

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

/**
 * PATCH /api/registros/:id/reenviar-revision
 * Envía una corrección (o registro pendiente) de vuelta a revisión de Ingeniería.
 * Solo registros en estado "pendiente" (incluye correcciones devueltas al técnico).
 */
export const reenviarRevision = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const usuario_id = req.userId;

    const existente = await prisma.registroTerreno.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    if (existente.estado === EstadoRegistroTerreno.validado) {
      res.status(400).json({ error: 'No se puede reenviar a revisión un registro ya validado' });
      return;
    }
    if (existente.estado === EstadoRegistroTerreno.rechazado) {
      res.status(400).json({
        error: 'Un registro rechazado no puede reenviarse directamente. Use la corrección generada automáticamente',
      });
      return;
    }
    if (existente.estado === EstadoRegistroTerreno.en_revision) {
      res.status(400).json({ error: 'El registro ya está en revisión' });
      return;
    }

    const registro = await prisma.registroTerreno.update({
      where: { id },
      data: {
        estado:              EstadoRegistroTerreno.en_revision,
        corregidoAt:         new Date(),
        reenviadoRevisionAt: new Date(),
        devuelto_a_tecnico:  false,
      },
    });

    await dbQuery(
      `INSERT INTO procesamiento_ingenieria (registro_terreno_id, usuario_id, procesado_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (registro_terreno_id) DO UPDATE SET
         usuario_id   = EXCLUDED.usuario_id,
         procesado_at = EXCLUDED.procesado_at`,
      [id, usuario_id],
    );

    const [withCodigo] = await adjuntarCodigosBeck([registro as unknown as Record<string, unknown>]);
    const [withItemizado] = await adjuntarItemizadosMandante([withCodigo]);
    res.json(withItemizado);
  } catch (error) {
    console.error('Error al reenviar a revisión:', error);
    res.status(500).json({ error: 'Error al reenviar registro a revisión' });
  }
};

/**
 * GET /api/registros/pendientes
 * Retorna los registros de terreno YA VALIDADOS por Jefe de Obra/Supervisor
 * (estadoValidacionObra = validado), en todos sus estados de Procesamiento
 * Ingeniería (pendiente/en_revision/validado/rechazado), para que Ingeniería
 * pueda calcular KPIs correctos en el cliente.
 * - Registros con validación de obra pendiente o rechazada NUNCA aparecen aquí.
 * - El frontend filtra la tabla a pendiente/en_revision client-side.
 * - El frontend calcula los contadores de todos los estados desde esta misma respuesta.
 */
export const listarPendientes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await dbQuery(
      `SELECT rt.*, o.nombre as obra_nombre, u.nombre as usuario_nombre, ui.nombre as seleccionado_inspeccion_por_nombre
       FROM registros_terreno rt
       LEFT JOIN obras o ON rt.obra_id = o.id
       LEFT JOIN usuarios u ON rt.usuario_id = u.id
       LEFT JOIN usuarios ui ON rt.seleccionado_inspeccion_por_id = ui.id
       WHERE rt.estado_validacion_obra = 'validado'
       ORDER BY rt.created_at ASC`
    );

    res.json(result.rows.map((row) => ({
      ...row,
      ...calcularRendimientoIndividual(row),
      inspeccionEstado: row.inspeccion_estado,
    })));
  } catch (error) {
    console.error('Error al listar pendientes:', error);
    res.status(500).json({ error: 'Error al listar pendientes' });
  }
};

/**
 * GET /api/registros/resumen
 * Devuelve conteos por estado para el módulo de Procesamiento Ingeniería.
 * Endpoint dedicado para KPIs — no depende del listado filtrado.
 * Solo considera registros validados por Jefe de Obra/Supervisor.
 */
export const getResumenRegistros = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await dbQuery<{ estado: string; cantidad: string }>(
      `SELECT estado, COUNT(*) AS cantidad
       FROM registros_terreno
       WHERE estado_validacion_obra = 'validado'
       GROUP BY estado`
    );

    const conteos: Record<string, number> = {};
    let total = 0;
    for (const row of result.rows) {
      conteos[row.estado] = Number(row.cantidad);
      total += Number(row.cantidad);
    }

    res.json({
      pendientes:  conteos['pendiente']    ?? 0,
      enRevision:  conteos['en_revision']  ?? 0,
      validados:   conteos['validado']     ?? 0,
      rechazados:  conteos['rechazado']    ?? 0,
      total,
    });
  } catch (error) {
    console.error('Error al obtener resumen de registros:', error);
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
};

/**
 * PATCH /api/registros/:id/iniciar-revision
 * Ingeniería inicia la revisión de un registro pendiente.
 * - Valida que el estado actual sea "pendiente"
 * - Actualiza estado → en_revision, devuelto_a_tecnico = false
 * - Crea/actualiza entrada en procesamiento_ingenieria
 */
export const iniciarRevision = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const usuario_id = req.userId;

    const existente = await prisma.registroTerreno.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    if (existente.estado !== EstadoRegistroTerreno.pendiente) {
      res.status(400).json({
        error: `Solo se puede iniciar revisión de un registro en estado pendiente. Estado actual: ${existente.estado}`,
      });
      return;
    }

    if (existente.estadoValidacionObra !== EstadoValidacionObra.validado) {
      res.status(400).json({
        error: 'El registro aún no ha sido validado por Jefe de Obra/Supervisor. No puede ingresar a Procesamiento Ingeniería.',
      });
      return;
    }

    const registro = await prisma.registroTerreno.update({
      where: { id },
      data: {
        estado:             EstadoRegistroTerreno.en_revision,
        devuelto_a_tecnico: false,
      },
    });

    await dbQuery(
      `INSERT INTO procesamiento_ingenieria (registro_terreno_id, usuario_id, procesado_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (registro_terreno_id) DO UPDATE SET
         usuario_id   = EXCLUDED.usuario_id,
         procesado_at = EXCLUDED.procesado_at`,
      [id, usuario_id],
    );

    const [withCodigo] = await adjuntarCodigosBeck([registro as unknown as Record<string, unknown>]);
    const [withItemizado] = await adjuntarItemizadosMandante([withCodigo]);
    res.json(withItemizado);
  } catch (error) {
    console.error('Error al iniciar revisión:', error);
    res.status(500).json({ error: 'Error al iniciar revisión del registro' });
  }
};

/**
 * PATCH /api/registros/:id/validacion-obra
 * Jefe de Obra/Supervisor valida o rechaza un registro creado por Terreno.
 * - Solo roles administrador y jefeobra pueden ejecutar esta acción.
 * - Solo aplica sobre registros con estadoValidacionObra = pendiente.
 * - Es el único paso que habilita el ingreso del registro a Procesamiento Ingeniería.
 * Body: { estadoValidacionObra: 'validado' | 'rechazado', motivo? }
 */
export const actualizarValidacionObra = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const usuario_id = req.userId;
    const rol = req.userRole;

    if (rol !== RolUsuario.administrador && rol !== RolUsuario.jefeobra) {
      res.status(403).json({ error: 'Solo Jefe de Obra/Supervisor puede validar registros de terreno' });
      return;
    }

    const { estadoValidacionObra, motivo } = req.body as {
      estadoValidacionObra?: string;
      motivo?: string;
    };
    const motivoRechazoObra: string | undefined =
      typeof motivo === 'string' ? motivo
      : typeof req.body.motivoRechazoObra === 'string' ? req.body.motivoRechazoObra
      : undefined;

    if (
      estadoValidacionObra !== EstadoValidacionObra.validado &&
      estadoValidacionObra !== EstadoValidacionObra.rechazado
    ) {
      res.status(400).json({ error: 'estadoValidacionObra inválido. Debe ser: validado o rechazado' });
      return;
    }

    const existente = await prisma.registroTerreno.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    if (existente.estadoValidacionObra !== EstadoValidacionObra.pendiente) {
      res.status(400).json({
        error: `Este registro ya fue ${existente.estadoValidacionObra} por obra. No se puede volver a validar.`,
      });
      return;
    }

    if (estadoValidacionObra === EstadoValidacionObra.rechazado && !motivoRechazoObra?.trim()) {
      res.status(400).json({ error: 'motivo es obligatorio al rechazar un registro' });
      return;
    }

    const registro = await prisma.registroTerreno.update({
      where: { id },
      data: {
        estadoValidacionObra: estadoValidacionObra as EstadoValidacionObra,
        validacionObraPorId:  usuario_id ?? null,
        validacionObraAt:     new Date(),
        motivoRechazoObra:
          estadoValidacionObra === EstadoValidacionObra.rechazado ? motivoRechazoObra!.trim() : null,
      },
    });

    const [withCodigo] = await adjuntarCodigosBeck([registro as unknown as Record<string, unknown>]);
    const [withItemizado] = await adjuntarItemizadosMandante([withCodigo]);
    res.json(withItemizado);
  } catch (error) {
    console.error('Error al validar registro por obra:', error);
    res.status(500).json({ error: 'Error al validar el registro' });
  }
};

/**
 * GET /api/registros/rendimiento-acumulado
 * Suma el rendimientoIndividual de cada registro dentro del rango de fechas,
 * agrupado por nombreSellador (equivalente a SUMAR.SI.CONJUNTO de Excel).
 *
 * Query params:
 *   fechaInicio  string  YYYY-MM-DD  obligatorio
 *   fechaFin     string  YYYY-MM-DD  obligatorio
 *   obraId       string  UUID        opcional
 *   nombreSellador string           opcional
 */
export const rendimientoAcumulado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fechaInicio, fechaFin, obraId, nombreSellador } = req.query;

    if (typeof fechaInicio !== 'string' || typeof fechaFin !== 'string') {
      res.status(400).json({ error: 'fechaInicio y fechaFin son obligatorios' });
      return;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setUTCHours(23, 59, 59, 999);

    if (!Number.isFinite(inicio.getTime()) || !Number.isFinite(fin.getTime())) {
      res.status(400).json({ error: 'fechaInicio y fechaFin deben ser fechas válidas (YYYY-MM-DD)' });
      return;
    }

    if (inicio > fin) {
      res.status(400).json({ error: 'fechaInicio debe ser menor o igual a fechaFin' });
      return;
    }

    const where: Prisma.RegistroTerrenoWhereInput = {
      fecha: { gte: inicio, lte: fin },
    };

    if (typeof obraId === 'string' && obraId.trim()) {
      where.obraId = obraId.trim();
    }

    if (typeof nombreSellador === 'string' && nombreSellador.trim()) {
      where.nombreSellador = nombreSellador.trim();
    }

    const registros = await prisma.registroTerreno.findMany({
      where,
      select: {
        tipoRegistro: true,
        nombreSellador: true,
        cantidadFinal: true,
        cantidadSellosConFactores: true,
        cantidadSellos: true,
        metrosLineales: true,
        codigoBeck: true,
      },
    });

    const codigosBeck = Array.from(
      new Set(
        registros
          .map((r) => r.codigoBeck)
          .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
      )
    );

    const itemizados = await prisma.itemizadoOpcion.findMany({
      where: {
        codigoBeck: { in: codigosBeck },
      },
      select: {
        codigoBeck: true,
        rendimientoSellosEsperadoDiario: true,
        rendimientoReparacionEsperadoDiario: true,
      },
    });

    const rendimientoPorCodigo = new Map(
      itemizados
        .filter((i) => i.codigoBeck)
        .map((i) => [i.codigoBeck!, i])
    );

    const agrupado = new Map<string, {
      totalRegistros: number;
      cantidadEjecutadaTotal: number;
      sumaRendimiento: number;
    }>();

    for (const reg of registros) {
     const rendimientoItemizado = reg.codigoBeck
      ? rendimientoPorCodigo.get(reg.codigoBeck)
      : null;

    const registroConRendimiento = {
      ...reg,
      obra: rendimientoItemizado
        ? { 
          rendimientoSellosEsperadoDiario: rendimientoItemizado.rendimientoSellosEsperadoDiario,
          rendimientoReparacionEsperadoDiario: rendimientoItemizado.rendimientoReparacionEsperadoDiario,
            }
        : null,
    };

    const { cantidadEjecutada, rendimientoIndividual } = calcularRendimientoIndividual(
      registroConRendimiento as unknown as Record<string, unknown>,
    );
      if (rendimientoIndividual === null) continue;

      const sellador = reg.nombreSellador ?? 'Sin asignar';
      const acc = agrupado.get(sellador) ?? { totalRegistros: 0, cantidadEjecutadaTotal: 0, sumaRendimiento: 0 };

      acc.totalRegistros++;
      acc.cantidadEjecutadaTotal += cantidadEjecutada ?? 0;
      acc.sumaRendimiento += rendimientoIndividual;

      agrupado.set(sellador, acc);
    }

    const resultado = Array.from(agrupado.entries()).map(([sellador, data]) => ({
      nombreSellador: sellador,
      totalRegistros: data.totalRegistros,
      cantidadEjecutadaTotal: data.cantidadEjecutadaTotal,
      rendimientoAcumulado: Math.round(data.sumaRendimiento * 10000) / 10000,
      rendimientoAcumuladoPct: Math.round(data.sumaRendimiento * 10000) / 100,
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Error al calcular rendimiento acumulado:', error);
    res.status(500).json({ error: 'Error al calcular rendimiento acumulado' });
  }
};

/**
 * PATCH /api/registros/:id/inspeccion
 * Acción exclusiva de la web: enviar un registro a inspección, o quitarlo de la cola
 * mientras aún no haya sido inspeccionado. El control de inspección en sí (registrar
 * resultado, checklist, fotos) lo hace el Supervisor desde la app — ver crearControlInspeccion.
 * Body: { seleccionadoParaInspeccion: boolean }
 */
export const marcarInspeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { seleccionadoParaInspeccion } = req.body as { seleccionadoParaInspeccion: unknown };

    if (typeof seleccionadoParaInspeccion !== 'boolean') {
      res.status(400).json({ error: 'seleccionadoParaInspeccion debe ser boolean' });
      return;
    }

    const existente = await prisma.registroTerreno.findUnique({ where: { id } });
    if (!existente) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    if (seleccionadoParaInspeccion) {
      if (existente.inspeccionEstado !== EstadoInspeccion.no_enviado) {
        res.status(400).json({
          error: existente.inspeccionEstado === EstadoInspeccion.inspeccionado
            ? 'Este registro ya fue inspeccionado.'
            : 'Este registro ya fue enviado a inspección.',
        });
        return;
      }
    } else {
      if (existente.inspeccionEstado === EstadoInspeccion.inspeccionado) {
        res.status(400).json({ error: 'No se puede quitar de inspección un registro ya inspeccionado.' });
        return;
      }
      if (existente.inspeccionEstado === EstadoInspeccion.no_enviado) {
        res.status(400).json({ error: 'Este registro no ha sido enviado a inspección.' });
        return;
      }
    }

    const registro = await prisma.registroTerreno.update({
      where: { id },
      data: seleccionadoParaInspeccion
        ? {
            seleccionadoParaInspeccion: true,
            fechaSeleccionInspeccion: new Date(),
            seleccionadoInspeccionPorId: req.userId,
            inspeccionEstado: EstadoInspeccion.en_inspeccion,
          }
        : {
            seleccionadoParaInspeccion: false,
            fechaSeleccionInspeccion: null,
            seleccionadoInspeccionPorId: null,
            inspeccionEstado: EstadoInspeccion.no_enviado,
          },
      include: {
        seleccionadoInspeccionPor: { select: { id: true, nombre: true } },
      },
    });

    res.json(registro);
  } catch (error) {
    console.error('Error al marcar inspección:', error);
    res.status(500).json({ error: 'Error al marcar inspección' });
  }
};

/**
 * GET /api/registros/:id/control-inspeccion
 * Devuelve el control de inspección del registro, con sus parámetros.
 */
export const getControlInspeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const registro = await prisma.registroTerreno.findUnique({ where: { id } });
    if (!registro) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    const control = await prisma.controlInspeccion.findFirst({
      where: { registroTerrenoId: id },
      include: {
        ingeniero: { select: { id: true, nombre: true, email: true } },
        parametros: { orderBy: { orden: 'asc' } },
      },
    });

    if (!control) {
      res.status(404).json({ error: 'Control de inspección no encontrado' });
      return;
    }

    res.json(control);
  } catch (error) {
    console.error('Error al obtener control de inspección:', error);
    res.status(500).json({ error: 'Error al obtener control de inspección' });
  }
};

/**
 * POST /api/registros/:id/control-inspeccion
 * Registra el resultado del control de inspección de un registro.
 * Endpoint pensado para la app del Supervisor — NO para la web. Solo lo puede ejecutar
 * el Supervisor (rol jefeobra) o un administrador; la web únicamente envía/quita de la
 * cola de inspección (ver marcarInspeccion) y luego puede consultar el resultado en
 * GET /api/registros/:id/inspeccion, sin poder controlar la inspección.
 * Body: { fecha, ensayo, observacion?, conformidad?, fotoInspeccionUrl?, fotoNoConformidadUrl?, parametros? }
 */
export const crearControlInspeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const rol = req.userRole;

    if (rol !== RolUsuario.administrador && rol !== RolUsuario.jefeobra) {
      res.status(403).json({ error: 'Solo el Supervisor puede registrar el control de inspección.' });
      return;
    }

    const {
      fecha,
      ensayo,
      observacion,
      conformidad,
      fotoInspeccionUrl,
      fotoNoConformidadUrl,
      parametros,
    } = req.body as {
      fecha?: string;
      ensayo?: string;
      observacion?: string;
      conformidad?: string;
      fotoInspeccionUrl?: string;
      fotoNoConformidadUrl?: string;
      parametros?: Array<{
        orden?: number;
        parametro: string;
        resultado: string;
        observacion?: string;
      }>;
    };

    if (!fecha) {
      res.status(400).json({ error: 'fecha es obligatoria' });
      return;
    }
    if (!ensayo || !ensayo.trim()) {
      res.status(400).json({ error: 'ensayo es obligatorio' });
      return;
    }

    const registro = await prisma.registroTerreno.findUnique({ where: { id } });
    if (!registro) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    if (registro.inspeccionEstado === EstadoInspeccion.inspeccionado) {
      res.status(400).json({ error: 'Este registro ya fue inspeccionado.' });
      return;
    }
    if (registro.inspeccionEstado === EstadoInspeccion.no_enviado) {
      res.status(400).json({ error: 'Este registro no ha sido enviado a inspección.' });
      return;
    }

    const conformidadesValidas: string[] = Object.values(EstadoConformidadInspeccion);
    if (conformidad !== undefined && conformidad !== null && !conformidadesValidas.includes(conformidad)) {
      res.status(400).json({ error: 'conformidad debe ser: conforme o no_conforme' });
      return;
    }

    const resultadosValidos: string[] = Object.values(ResultadoParametroInspeccion);
    const parametrosArr = Array.isArray(parametros) ? parametros : [];
    for (const p of parametrosArr) {
      if (!p.parametro || !p.resultado || !resultadosValidos.includes(p.resultado)) {
        res.status(400).json({
          error: 'Cada parámetro debe tener parametro y resultado válido (cumple|no_cumple|no_aplica)',
        });
        return;
      }
    }

    const [control] = await prisma.$transaction([
      prisma.controlInspeccion.create({
        data: {
          registroTerrenoId: id,
          ingenieroId: req.userId!,
          fecha: new Date(fecha),
          ensayo: ensayo.trim(),
          observacion: observacion ?? null,
          conformidad: conformidad ? (conformidad as EstadoConformidadInspeccion) : null,
          fotoInspeccionUrl: fotoInspeccionUrl ?? null,
          fotoNoConformidadUrl: fotoNoConformidadUrl ?? null,
          parametros: parametrosArr.length > 0
            ? {
                create: parametrosArr.map((p, idx) => ({
                  orden: typeof p.orden === 'number' ? p.orden : idx + 1,
                  parametro: String(p.parametro).trim(),
                  resultado: p.resultado as ResultadoParametroInspeccion,
                  observacion: p.observacion ?? null,
                })),
              }
            : undefined,
        },
        include: {
          ingeniero: { select: { id: true, nombre: true, email: true } },
          parametros: { orderBy: { orden: 'asc' } },
        },
      }),
      prisma.registroTerreno.update({
        where: { id },
        data: { inspeccionEstado: EstadoInspeccion.inspeccionado },
      }),
    ]);

    res.status(201).json(control);
  } catch (error) {
    console.error('Error al crear control de inspección:', error);
    res.status(500).json({ error: 'Error al crear control de inspección' });
  }
};

/**
 * GET /api/registros/:id/inspeccion
 * Detalle de inspección para la web: estado del flujo, quién y cuándo se envió,
 * y —si ya fue inspeccionado por el Supervisor desde la app— el resultado completo
 * (supervisor, fecha, resultado, observaciones, fotos y checklist). Solo lectura:
 * la web nunca controla la inspección desde aquí.
 */
export const verDetalleInspeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const registro = await prisma.registroTerreno.findUnique({
      where: { id },
      select: {
        id: true,
        inspeccionEstado: true,
        seleccionadoParaInspeccion: true,
        fechaSeleccionInspeccion: true,
        seleccionadoInspeccionPor: { select: { id: true, nombre: true, email: true } },
      },
    });

    if (!registro) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    const control = await prisma.controlInspeccion.findFirst({
      where: { registroTerrenoId: id },
      orderBy: { fecha: 'desc' },
      include: {
        ingeniero: { select: { id: true, nombre: true, email: true } },
        parametros: { orderBy: { orden: 'asc' } },
      },
    });

    res.json({
      inspeccionEstado: registro.inspeccionEstado,
      seleccionadoParaInspeccion: registro.seleccionadoParaInspeccion,
      seleccionadoInspeccionPorId: registro.seleccionadoInspeccionPor?.id ?? null,
      seleccionadoInspeccionPor: registro.seleccionadoInspeccionPor,
      fechaSeleccionInspeccion: registro.fechaSeleccionInspeccion,
      supervisorInspeccionId: control?.ingeniero?.id ?? null,
      supervisorInspeccion: control?.ingeniero ?? null,
      fechaInspeccion: control?.fecha ?? null,
      conformidad: control?.conformidad ?? null,
      observacion: control?.observacion ?? null,
      observaciones: control?.observacion ?? null,
      ensayo: control?.ensayo ?? null,
      fotoInspeccionUrl: control?.fotoInspeccionUrl ?? null,
      fotoNoConformidadUrl: control?.fotoNoConformidadUrl ?? null,
      fotos: control
        ? [control.fotoInspeccionUrl, control.fotoNoConformidadUrl].filter(
            (url): url is string => Boolean(url),
          )
        : [],
      parametros: control?.parametros ?? null,
    });
  } catch (error) {
    console.error('Error al obtener detalle de inspección:', error);
    res.status(500).json({ error: 'Error al obtener detalle de inspección' });
  }
};
