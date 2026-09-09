import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
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

const excelText = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /^[=+\-@]/.test(text.trimStart()) ? `'${text}` : text;
};

const formatExcelDate = (value: Date | null | undefined): string => {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value);
};

const buildInventarioWhere = (query: Request['query']): Prisma.ProductoWhereInput => {
  const { q, activo, categoriaId, criticidad } = query;
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

  return where;
};

const getInventarioFiltrado = async (query: Request['query']) => {
  const productos = await firematPrisma.producto.findMany({
    where: buildInventarioWhere(query),
    include: { Categoria: true },
    orderBy: { nombre: 'asc' },
  });

  let data = productos.map(toInventarioDTO);

  if (query.bajoStock === 'true') {
    data = data.filter((producto) => producto.alertaStockBajo);
  }

  data.sort((a, b) => {
    if (a.alertaStockBajo && !b.alertaStockBajo) return -1;
    if (!a.alertaStockBajo && b.alertaStockBajo) return 1;
    return a.nombre.localeCompare(b.nombre);
  });

  return data;
};

const buildInventarioResumen = (data: ReturnType<typeof toInventarioDTO>[]) => {
  const totalProductos = data.length;
  const productosActivos = data.filter((producto) => producto.activo).length;
  return {
    totalProductos,
    productosActivos,
    productosInactivos: totalProductos - productosActivos,
    productosSinStock: data.filter((producto) => producto.estadoStock === 'SIN_STOCK').length,
    productosBajoStock: data.filter((producto) => producto.estadoStock === 'BAJO_STOCK').length,
    stockTotal: data.reduce((sum, producto) => sum + producto.stock, 0),
    stockReservadoTotal: data.reduce((sum, producto) => sum + producto.stockReservado, 0),
    stockDisponibleTotal: data.reduce((sum, producto) => sum + producto.stockDisponible, 0),
  };
};

const styleWorksheet = (worksheet: ExcelJS.Worksheet): void => {
  const header = worksheet.getRow(1);
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111827' } };
  header.alignment = { vertical: 'middle', horizontal: 'center' };
  header.height = 24;
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  if (worksheet.columnCount > 0) {
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.columnCount },
    };
  }
};

export const getInventarioFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getInventarioFiltrado(req.query);
    const resumen = buildInventarioResumen(data);

    res.json({
      success: true,
      data,
      resumen,
    });
  } catch (error) {
    console.error('Error al obtener inventario Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener inventario' });
  }
};

export const exportInventarioFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getInventarioFiltrado(req.query);
    const resumen = buildInventarioResumen(data);
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'CRM Firemat';
    workbook.created = new Date();

    const inventarioSheet = workbook.addWorksheet('Inventario');
    inventarioSheet.columns = [
      { header: 'SKU', key: 'sku', width: 18 },
      { header: 'Producto', key: 'nombre', width: 35 },
      { header: 'Descripción', key: 'descripcion', width: 45 },
      { header: 'Categoría', key: 'categoria', width: 22 },
      { header: 'Stock inicial', key: 'stockInicial', width: 14 },
      { header: 'Entradas', key: 'entradas', width: 12 },
      { header: 'Última entrada', key: 'fechaUltimaEntrada', width: 20 },
      { header: 'Salidas', key: 'salidas', width: 12 },
      { header: 'Última salida', key: 'fechaUltimaSalida', width: 20 },
      { header: 'Stock actual', key: 'stock', width: 14 },
      { header: 'Stock reservado', key: 'stockReservado', width: 16 },
      { header: 'Stock disponible', key: 'stockDisponible', width: 16 },
      { header: 'Stock mínimo', key: 'minStock', width: 14 },
      { header: 'Estado stock', key: 'estadoStock', width: 16 },
      { header: 'Criticidad', key: 'criticidad', width: 14 },
      { header: 'Ubicación', key: 'ubicacion', width: 24 },
      { header: 'Estado', key: 'activo', width: 12 },
      { header: 'Precio CLP', key: 'precio', width: 16 },
      { header: 'Fecha creación', key: 'createdAt', width: 20 },
      { header: 'URL imagen', key: 'imagen', width: 45 },
    ];

    for (const producto of data) {
      inventarioSheet.addRow({
        sku: excelText(producto.sku),
        nombre: excelText(producto.nombre),
        descripcion: excelText(producto.descripcion),
        categoria: excelText(producto.categoria),
        stockInicial: producto.stockInicial ?? 0,
        entradas: producto.entradas ?? 0,
        fechaUltimaEntrada: formatExcelDate(producto.fechaUltimaEntrada),
        salidas: producto.salidas ?? 0,
        fechaUltimaSalida: formatExcelDate(producto.fechaUltimaSalida),
        stock: producto.stock,
        stockReservado: producto.stockReservado,
        stockDisponible: producto.stockDisponible,
        minStock: producto.minStock,
        estadoStock: producto.estadoStock === 'SIN_STOCK'
          ? 'Sin stock'
          : producto.estadoStock === 'BAJO_STOCK'
            ? 'Bajo stock'
            : 'OK',
        criticidad: excelText(producto.criticidad),
        ubicacion: excelText(producto.ubicacion),
        activo: producto.activo ? 'Activo' : 'Inactivo',
        precio: producto.precio,
        createdAt: formatExcelDate(producto.createdAt),
        imagen: excelText(producto.imagen),
      });
    }

    inventarioSheet.getColumn('precio').numFmt = '$#,##0';
    styleWorksheet(inventarioSheet);

    const resumenSheet = workbook.addWorksheet('Resumen');
    resumenSheet.columns = [
      { header: 'Indicador', key: 'indicador', width: 30 },
      { header: 'Valor', key: 'valor', width: 18 },
    ];
    resumenSheet.addRows([
      { indicador: 'Total productos', valor: resumen.totalProductos },
      { indicador: 'Productos activos', valor: resumen.productosActivos },
      { indicador: 'Productos inactivos', valor: resumen.productosInactivos },
      { indicador: 'Productos sin stock', valor: resumen.productosSinStock },
      { indicador: 'Productos bajo stock', valor: resumen.productosBajoStock },
      { indicador: 'Stock total', valor: resumen.stockTotal },
      { indicador: 'Stock reservado', valor: resumen.stockReservadoTotal },
      { indicador: 'Stock disponible', valor: resumen.stockDisponibleTotal },
    ]);
    styleWorksheet(resumenSheet);

    const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="inventario_firemat_${timestamp}.xlsx"`,
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al exportar inventario Firemat:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Error al exportar inventario' });
    }
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
      nombre,
      sku,
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
    if (nombre !== undefined && (typeof nombre !== 'string' || !nombre.trim())) {
      res.status(400).json({ success: false, error: 'nombre no puede estar vacío' });
      return;
    }
    if (sku !== undefined && sku !== null && typeof sku !== 'string') {
      res.status(400).json({ success: false, error: 'sku debe ser string' });
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
          ...(nombre !== undefined ? { nombre: nombre.trim() } : {}),
          ...(sku !== undefined ? { sku: sku === null ? null : sku.trim() || null } : {}),
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      (error.meta?.target as string[] | undefined)?.includes('sku')
    ) {
      res.status(409).json({ success: false, error: 'Ya existe un producto con ese SKU' });
      return;
    }
    console.error('Error al actualizar inventario Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar inventario' });
  }
};
