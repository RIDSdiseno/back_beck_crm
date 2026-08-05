import { Request, Response } from 'express';
import XLSX from 'xlsx';
import { firematPrisma } from '../../config/firematPrisma';

type FilaExcel = Record<string, unknown>;

const DIACRITICOS_REGEX = new RegExp('[̀-ͯ]', 'g');

const normalizarHeader = (h: string): string =>
  h
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICOS_REGEX, '');

const CANDIDATOS_SKU = ['sku'];
const CANDIDATOS_STOCK_INICIAL = ['stock inicial', 'stockinicial'];

const buscarValor = (fila: FilaExcel, candidatos: string[]): unknown => {
  for (const [key, value] of Object.entries(fila)) {
    if (candidatos.includes(normalizarHeader(key))) return value;
  }
  return undefined;
};

const parseSku = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s || null;
};

const parseStockInicial = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
};

export const importarInventarioExcel = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: "No se recibió ningún archivo. Envíe el Excel en el campo 'file' (multipart/form-data).",
    });
    return;
  }

  let filas: FilaExcel[];
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    filas = sheet ? XLSX.utils.sheet_to_json<FilaExcel>(sheet, { defval: null }) : [];
  } catch {
    res.status(422).json({ success: false, error: 'No se pudo leer el archivo Excel. Verifique el formato.' });
    return;
  }

  if (filas.length === 0) {
    res.status(422).json({ success: false, error: 'El archivo no contiene filas de datos.' });
    return;
  }

  let actualizados = 0;
  let noEncontrados = 0;
  let sinSku = 0;
  let omitidos = 0;
  const advertencias: string[] = [];
  const erroresDb: string[] = [];

  for (const fila of filas) {
    const sku = parseSku(buscarValor(fila, CANDIDATOS_SKU));
    if (!sku) {
      sinSku++;
      continue;
    }

    const stockInicial = parseStockInicial(buscarValor(fila, CANDIDATOS_STOCK_INICIAL));
    if (stockInicial === null) {
      omitidos++;
      advertencias.push(`SKU "${sku}": "Stock inicial" ausente o inválido, fila omitida.`);
      continue;
    }

    try {
      const existing = await firematPrisma.producto.findUnique({ where: { sku } });
      if (!existing) {
        noEncontrados++;
        advertencias.push(`SKU "${sku}": no encontrado en la base de datos.`);
        continue;
      }

      const stockAnterior = existing.stock;
      const stockNuevo = Math.max(0, stockInicial - (existing.salidas ?? 0) + (existing.entradas ?? 0));

      await firematPrisma.$transaction(async (tx) => {
        await tx.producto.update({
          where: { sku },
          data: { stockInicial, stock: stockNuevo },
        });

        if (stockNuevo !== stockAnterior) {
          await tx.movimiento.create({
            data: {
              tipo: 'AJUSTE_IMPORTACION',
              cantidad: Math.abs(stockNuevo - stockAnterior),
              stockAnterior,
              stockNuevo,
              motivo: 'Importación Excel - Stock inicial',
              productoId: existing.id,
            },
          });
        }
      });

      actualizados++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      erroresDb.push(`SKU "${sku}": ${msg}`);
      omitidos++;
    }
  }

  console.log(
    `[INVENTARIO-IMP-EXCEL] Filas: ${filas.length} | Actualizados: ${actualizados} | ` +
    `No encontrados: ${noEncontrados} | Sin SKU: ${sinSku} | Omitidos: ${omitidos}`,
  );

  res.json({
    success: true,
    data: {
      totalFilas: filas.length,
      actualizados,
      noEncontrados,
      sinSku,
      omitidos,
      advertencias,
      errores: erroresDb,
    },
  });
};
