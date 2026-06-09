import { Request, Response } from 'express';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';

type EstadoStock = 'SIN_STOCK' | 'BAJO_STOCK' | 'OK';
type ProductoInventario = Prisma.ProductoGetPayload<{ include: { Categoria: true } }>;

const calcEstadoStock = (disponible: number, minStock: number): EstadoStock => {
  if (disponible <= 0) return 'SIN_STOCK';
  if (disponible <= minStock) return 'BAJO_STOCK';
  return 'OK';
};

const parseDate = (val: string): Date | undefined => {
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

const parseInventoryDate = (value: unknown): Date | null | undefined => {
  if (value === null || value === '') return null;
  if (value === undefined) return undefined;
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const localDate = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2}|\d{4})$/);
  if (localDate) {
    const [, dayRaw, monthRaw, yearRaw] = localDate;
    const day = Number(dayRaw);
    const month = Number(monthRaw);
    const year = yearRaw.length === 2 ? 2000 + Number(yearRaw) : Number(yearRaw);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return undefined;
    }
    return date;
  }

  const date = new Date(trimmed);
  return isNaN(date.getTime()) ? undefined : date;
};

const parseOptionalNonNegativeInteger = (
  value: unknown,
): number | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
};

const parseIdParam = (value: string | string[] | undefined): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const toInventarioDTO = (producto: ProductoInventario) => {
  const stockDisponible = producto.stock - producto.stockReservado;
  const estadoStock = calcEstadoStock(stockDisponible, producto.minStock);

  return {
    id: producto.id,
    sku: producto.sku,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoria: producto.Categoria.nombre,
    categoriaId: producto.categoriaId,
    stockInicial: producto.stockInicial,
    salidas: producto.salidas,
    fechaUltimaSalida: producto.fechaUltimaSalida,
    entradas: producto.entradas,
    fechaUltimaEntrada: producto.fechaUltimaEntrada,
    stock: producto.stock,
    stockReservado: producto.stockReservado,
    stockDisponible,
    minStock: producto.minStock,
    estadoStock,
    alertaStockBajo: estadoStock !== 'OK',
    criticidad: producto.criticidad,
    ubicacion: producto.ubicacion,
    activo: producto.activo,
    imagen: producto.imagen,
    precio: producto.precio,
    createdAt: producto.createdAt,
  };
};

export const getInventarioFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, activo, categoriaId, bajoStock, criticidad } = req.query;

    const where: Prisma.ProductoWhereInput = {};

    if (typeof activo === 'string') {
      where.activo = activo === 'true';
    }

    if (typeof categoriaId === 'string' && categoriaId.trim()) {
      const id = parseInt(categoriaId, 10);
      if (!isNaN(id)) where.categoriaId = id;
    }

    if (typeof criticidad === 'string' && criticidad.trim()) {
      where.criticidad = criticidad.trim();
    }

    if (typeof q === 'string' && q.trim()) {
      where.OR = [
        { sku: { contains: q.trim(), mode: 'insensitive' } },
        { nombre: { contains: q.trim(), mode: 'insensitive' } },
        { descripcion: { contains: q.trim(), mode: 'insensitive' } },
      ];
    }

    const productos = await firematPrisma.producto.findMany({
      where,
      include: { Categoria: true },
      orderBy: { nombre: 'asc' },
    });

    let data = productos.map(toInventarioDTO);

    if (bajoStock === 'true') {
      data = data.filter((p) => p.alertaStockBajo);
    }

    data.sort((a, b) => {
      if (a.alertaStockBajo && !b.alertaStockBajo) return -1;
      if (!a.alertaStockBajo && b.alertaStockBajo) return 1;
      return a.nombre.localeCompare(b.nombre);
    });

    const totalProductos = data.length;
    const productosActivos = data.filter((p) => p.activo).length;
    const productosInactivos = totalProductos - productosActivos;
    const productosSinStock = data.filter((p) => p.estadoStock === 'SIN_STOCK').length;
    const productosBajoStock = data.filter((p) => p.estadoStock === 'BAJO_STOCK').length;
    const stockTotal = data.reduce((sum, p) => sum + p.stock, 0);
    const stockReservadoTotal = data.reduce((sum, p) => sum + p.stockReservado, 0);
    const stockDisponibleTotal = data.reduce((sum, p) => sum + p.stockDisponible, 0);

    res.json({
      success: true,
      data,
      resumen: {
        totalProductos,
        productosActivos,
        productosInactivos,
        productosSinStock,
        productosBajoStock,
        stockTotal,
        stockReservadoTotal,
        stockDisponibleTotal,
      },
    });
  } catch (error) {
    console.error('Error al obtener inventario Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener inventario' });
  }
};

export const getMovimientosInventarioFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productoId, tipo, desde, hasta } = req.query;

    const where: Prisma.MovimientoWhereInput = {};

    if (typeof productoId === 'string' && productoId.trim()) {
      const id = parseInt(productoId, 10);
      if (!isNaN(id)) where.productoId = id;
    }

    if (typeof tipo === 'string' && tipo.trim()) {
      where.tipo = tipo.trim();
    }

    const createdAt: Prisma.DateTimeFilter<'Movimiento'> = {};
    if (typeof desde === 'string' && desde.trim()) {
      const d = parseDate(desde);
      if (d) createdAt.gte = d;
    }
    if (typeof hasta === 'string' && hasta.trim()) {
      const d = parseDate(hasta);
      if (d) createdAt.lte = d;
    }
    if (Object.keys(createdAt).length > 0) where.createdAt = createdAt;

    const movimientos = await firematPrisma.movimiento.findMany({
      where,
      include: { Producto: true },
      orderBy: { createdAt: 'desc' },
    });

    const data = movimientos.map((m) => ({
      id: m.id,
      tipo: m.tipo,
      cantidad: m.cantidad,
      stockAnterior: m.stockAnterior,
      stockNuevo: m.stockNuevo,
      motivo: m.motivo,
      documento: m.documento,
      productoId: m.productoId,
      productoNombre: m.Producto.nombre,
      userId: m.userId,
      createdAt: m.createdAt,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al obtener movimientos Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener movimientos' });
  }
};

export const updateInventarioFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const productoId = parseIdParam(req.params.productoId);
    if (!productoId) {
      res.status(400).json({ success: false, error: 'productoId inválido' });
      return;
    }

    const {
      stockNuevo,
      stockInicial,
      salidas,
      fechaUltimaSalida,
      entradas,
      fechaUltimaEntrada,
      ubicacion,
      activo,
      motivo,
    } = req.body;

    const stockNuevoNum = parseOptionalNonNegativeInteger(stockNuevo);
    const stockInicialNum = parseOptionalNonNegativeInteger(stockInicial);
    const salidasNum = parseOptionalNonNegativeInteger(salidas);
    const entradasNum = parseOptionalNonNegativeInteger(entradas);

    const integerFields = [
      ['stockInicial', stockInicial, stockInicialNum],
      ['salidas', salidas, salidasNum],
      ['entradas', entradas, entradasNum],
    ] as const;

    for (const [field, input, parsed] of integerFields) {
      if (input !== undefined && (parsed === undefined || parsed === null)) {
        res.status(400).json({
          success: false,
          error: `${field} debe ser un entero >= 0`,
        });
        return;
      }
    }

    if (stockNuevo === undefined || stockNuevoNum === undefined || stockNuevoNum === null) {
      res.status(400).json({ success: false, error: 'stockNuevo debe ser un entero >= 0' });
      return;
    }

    const fechaUltimaSalidaDate = parseInventoryDate(fechaUltimaSalida);
    const fechaUltimaEntradaDate = parseInventoryDate(fechaUltimaEntrada);
    if (fechaUltimaSalida !== undefined && fechaUltimaSalidaDate === undefined) {
      res.status(400).json({ success: false, error: 'fechaUltimaSalida inválida' });
      return;
    }
    if (fechaUltimaEntrada !== undefined && fechaUltimaEntradaDate === undefined) {
      res.status(400).json({ success: false, error: 'fechaUltimaEntrada inválida' });
      return;
    }
    if (ubicacion !== undefined && typeof ubicacion !== 'string') {
      res.status(400).json({ success: false, error: 'ubicacion debe ser string' });
      return;
    }
    if (activo !== undefined && typeof activo !== 'boolean') {
      res.status(400).json({ success: false, error: 'activo debe ser boolean' });
      return;
    }
    if (motivo !== undefined && typeof motivo !== 'string') {
      res.status(400).json({ success: false, error: 'motivo debe ser string' });
      return;
    }

    const result = await firematPrisma.$transaction(async (tx) => {
      const producto = await tx.producto.findUnique({ where: { id: productoId } });
      if (!producto) return null;

      const productoActualizado = await tx.producto.update({
        where: { id: productoId },
        data: {
          stock: stockNuevoNum,
          ...(stockInicialNum !== undefined && stockInicialNum !== null
            ? { stockInicial: stockInicialNum }
            : {}),
          ...(salidasNum !== undefined && salidasNum !== null ? { salidas: salidasNum } : {}),
          ...(fechaUltimaSalidaDate !== undefined
            ? { fechaUltimaSalida: fechaUltimaSalidaDate }
            : {}),
          ...(entradasNum !== undefined && entradasNum !== null ? { entradas: entradasNum } : {}),
          ...(fechaUltimaEntradaDate !== undefined
            ? { fechaUltimaEntrada: fechaUltimaEntradaDate }
            : {}),
          ...(ubicacion !== undefined ? { ubicacion: ubicacion.trim() || null } : {}),
          ...(activo !== undefined ? { activo } : {}),
        },
        include: { Categoria: true },
      });

      const movimientoCreado = await tx.movimiento.create({
        data: {
          tipo: 'AJUSTE_MANUAL',
          cantidad: Math.abs(stockNuevoNum - producto.stock),
          stockAnterior: producto.stock,
          stockNuevo: stockNuevoNum,
          motivo: motivo?.trim() || 'Ajuste manual de inventario',
          productoId,
        },
      });

      return { productoActualizado, movimientoCreado };
    });

    if (!result) {
      res.status(404).json({ success: false, error: 'Producto no encontrado' });
      return;
    }

    res.json({
      success: true,
      data: toInventarioDTO(result.productoActualizado),
      movimiento: result.movimientoCreado,
    });
  } catch (error) {
    console.error('Error al actualizar inventario Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar inventario' });
  }
};
