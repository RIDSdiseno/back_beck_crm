import { Request, Response } from 'express';
import { firematPrisma } from '../../config/firematPrisma';
import {
  parsearListaPreciosPdf,
  parsearInventarioPdf,
} from '../../services/importarFirematPdf.service';

const CATEGORIA_DEFAULT = 'Importado';

async function obtenerOCrearCategoriaDefault(): Promise<number> {
  const cat = await firematPrisma.categoria.findFirst({
    where: { nombre: CATEGORIA_DEFAULT },
  });
  if (cat) return cat.id;
  const nueva = await firematPrisma.categoria.create({ data: { nombre: CATEGORIA_DEFAULT } });
  return nueva.id;
}

async function buscarCategoriaId(nombre: string): Promise<number | null> {
  const cat = await firematPrisma.categoria.findFirst({
    where: { nombre: { equals: nombre, mode: 'insensitive' } },
  });
  return cat?.id ?? null;
}

const parseInventoryPdfDate = (value: string | null): Date | null => {
  if (!value) return null;

  const match = value.trim().match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2}|\d{4})$/);
  if (!match) return null;

  const [, dayRaw, monthRaw, yearRaw] = match;
  const day = Number(dayRaw);
  const month = Number(monthRaw);
  const year = yearRaw.length === 2 ? 2000 + Number(yearRaw) : Number(yearRaw);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null;
};

export const importarListaPreciosPdf = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: "No se recibió ningún archivo. Envíe el PDF en el campo 'file' (multipart/form-data).",
    });
    return;
  }

  const dryRun = req.query.dryRun === 'true';

  const { productos, advertencias, noTexto } = await parsearListaPreciosPdf(req.file.buffer);

  if (noTexto) {
    res.status(422).json({
      success: false,
      error:
        'El PDF no contiene texto extraíble. Si el archivo es una imagen escaneada, no es posible procesarlo automáticamente. Use un PDF con texto seleccionable.',
    });
    return;
  }

  if (productos.length === 0) {
    res.status(422).json({
      success: false,
      error: 'No se encontraron productos válidos en el PDF.',
      advertencias,
    });
    return;
  }

  if (dryRun) {
    res.json({
      success: true,
      dryRun: true,
      resumen: {
        totalParseados: productos.length,
        advertencias,
      },
      productos: productos.map(p => ({
        sku:           p.sku,
        descripcion:   p.descripcion,
        disponibilidad: p.disponibilidad,
        formato:       p.formato,
        cantidadCaja:  p.cantidadCaja,
        precioUsd:     p.precioUsd,
        precioClp:     p.precioClp,
        precioSugerido: p.precioSugerido,
        categoria:     p.categoria,
      })),
    });
    return;
  }

  const categoriaDefaultId = await obtenerOCrearCategoriaDefault();

  let creados    = 0;
  let actualizados = 0;
  let omitidos   = 0;
  const erroresDb: string[] = [];

  for (const prod of productos) {
    try {
      const categoriaId =
        prod.categoria != null
          ? (await buscarCategoriaId(prod.categoria)) ?? categoriaDefaultId
          : categoriaDefaultId;

      const existing = await firematPrisma.producto.findUnique({
        where: { sku: prod.sku },
      });

      if (existing) {
        await firematPrisma.producto.update({
          where: { sku: prod.sku },
          data: {
            nombre:         prod.descripcion,
            descripcion:    prod.descripcion,
            disponibilidad: prod.disponibilidad ?? 'A pedido',
            formato:        prod.formato,
            cantidadCaja:   prod.cantidadCaja?.trim() || null,
            precioUsd:      prod.precioUsd ?? 0,
            precio:         prod.precioClp ?? existing.precio,
            precioSugerido: prod.precioSugerido ?? 0,
            categoriaId,
            activo: true,
          },
        });
        actualizados++;
      } else {
        await firematPrisma.producto.create({
          data: {
            sku:            prod.sku,
            nombre:         prod.descripcion,
            descripcion:    prod.descripcion,
            disponibilidad: prod.disponibilidad ?? 'A pedido',
            formato:        prod.formato,
            cantidadCaja:   prod.cantidadCaja?.trim() || null,
            precioUsd:      prod.precioUsd ?? 0,
            precio:         prod.precioClp ?? 0,
            precioSugerido: prod.precioSugerido ?? 0,
            categoriaId,
            stock:  0,
            activo: true,
          },
        });
        creados++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      erroresDb.push(`SKU "${prod.sku}": ${msg}`);
      omitidos++;
    }
  }

  res.json({
    success: true,
    resumen: {
      totalEnPdf:  productos.length,
      creados,
      actualizados,
      omitidos,
      advertencias,
      errores: erroresDb,
    },
  });
};

export const importarInventarioPdf = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: "No se recibió ningún archivo. Envíe el PDF en el campo 'file' (multipart/form-data).",
    });
    return;
  }

  const { items, advertencias, noTexto, candidatas } = await parsearInventarioPdf(req.file.buffer);

  if (noTexto) {
    res.status(422).json({
      success: false,
      error:
        'El PDF no contiene texto extraíble. Si el archivo es una imagen escaneada, no es posible procesarlo automáticamente. Use un PDF con texto seleccionable.',
    });
    return;
  }

  if (items.length === 0) {
    res.status(422).json({
      success: false,
      error: 'No se encontraron ítems de inventario válidos en el PDF.',
      advertencias,
    });
    return;
  }

  let actualizados  = 0;
  let noEncontrados = 0;
  let omitidos      = 0;
  const erroresDb: string[] = [];

  for (const item of items) {
    try {
      const existing = await firematPrisma.producto.findUnique({
        where: { sku: item.sku },
      });

      if (!existing) {
        noEncontrados++;
        advertencias.push(`SKU "${item.sku}": no encontrado en la base de datos.`);
        continue;
      }

      const stockAnterior = existing.stock;
      const stockNuevo    = Math.round(item.total!);
      const stockInicial = item.stockInicial === null ? null : Math.round(item.stockInicial);
      const salidas = item.salidas === null ? null : Math.round(item.salidas);
      const entradas = item.entradas === null ? null : Math.round(item.entradas);

      await firematPrisma.$transaction(async (tx) => {
        await tx.producto.update({
          where: { sku: item.sku },
          data: {
            stock: stockNuevo,
            stockInicial,
            salidas,
            fechaUltimaSalida: parseInventoryPdfDate(item.fechaUltimaSalida),
            entradas,
            fechaUltimaEntrada: parseInventoryPdfDate(item.fechaUltimaEntrada),
          },
        });

        if (stockNuevo !== stockAnterior) {
          await tx.movimiento.create({
            data: {
              tipo:         'AJUSTE_IMPORTACION',
              cantidad:     Math.abs(stockNuevo - stockAnterior),
              stockAnterior,
              stockNuevo,
              motivo:       'Importación PDF inventario',
              productoId:   existing.id,
            },
          });
        }
      });

      actualizados++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      erroresDb.push(`SKU "${item.sku}": ${msg}`);
      omitidos++;
    }
  }

  console.log(
    `[INVENTARIO-IMP] Candidatas: ${candidatas} | Parseadas: ${items.length} | ` +
    `Actualizados: ${actualizados} | No encontrados: ${noEncontrados} | Omitidos: ${omitidos}`,
  );

  res.json({
    success: true,
    resumen: {
      totalEnPdf:    candidatas,
      parseados:     items.length,
      actualizados,
      noEncontrados,
      omitidos,
      advertencias,
      errores:       erroresDb,
    },
  });
};
