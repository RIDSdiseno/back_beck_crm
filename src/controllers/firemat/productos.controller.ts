import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import { Prisma } from '../../generated/firemat-client';
import { firematPrisma } from '../../config/firematPrisma';
import { uploadImageDetailed, deleteImage } from '../../config/cloudinary';

type ProdWithCat = Prisma.ProductoGetPayload<{ include: { Categoria: true } }>;

const parseIdParam = (value: string | string[] | undefined): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const CRITICIDADES = ['baja', 'media', 'alta'];

const CLOUDINARY_FOLDER = 'Firemat/productos';

const extractPublicId = (url: string): string | null => {
  try {
    const uploadIdx = url.indexOf('/upload/');
    if (uploadIdx === -1) return null;
    const withoutExt = url.slice(uploadIdx + '/upload/'.length).replace(/\.[a-zA-Z0-9]+$/, '');
    const folderIdx = withoutExt.indexOf('Firemat/productos');
    return folderIdx !== -1 ? withoutExt.slice(folderIdx) : null;
  } catch {
    return null;
  }
};

const normCriticidad = (v: string): string => {
  const l = v.toLowerCase();
  return l.charAt(0).toUpperCase() + l.slice(1);
};

const NULL_PRICE_RE = /^(-{1,3}|—|n\/?a)$/i;

function normalizePriceField(value: unknown): number {
  if (value === null || value === undefined) return 0;
  const s = String(value).trim();
  if (!s || NULL_PRICE_RE.test(s)) return 0;
  return parseFloat(s);
}

const parseBool = (v: unknown): boolean | null => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    const l = v.toLowerCase().trim();
    if (l === 'true' || l === 'activo') return true;
    if (l === 'false' || l === 'inactivo') return false;
  }
  return null;
};

const toDTO = (p: ProdWithCat) => ({
  id: p.id,
  nombre: p.nombre,
  sku: p.sku,
  descripcion: p.descripcion,
  categoria: p.Categoria.nombre,
  categoriaId: p.categoriaId,
  precio: p.precio,
  precioClp: p.precio,
  precioUsd: p.precioUsd,
  precioSugerido: p.precioSugerido,
  precioInstalador: p.precioInstalador,
  disponibilidad: p.disponibilidad,
  formato: p.formato,
  cantidadCaja: p.cantidadCaja,
  stockActual: p.stock,
  stockReservado: p.stockReservado,
  stockDisponible: p.stock - p.stockReservado,
  stockMinimo: p.minStock,
  stockInicial: p.stockInicial,
  ubicacion: p.ubicacion,
  criticidad: p.criticidad,
  activo: p.activo,
  imagen: p.imagen,
  alertaStockBajo: p.stock <= p.minStock,
  createdAt: p.createdAt,
});

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

const buildProductosWhere = (query: Request['query']): Prisma.ProductoWhereInput => {
  const { q, activo, categoriaId } = query;
  const where: Prisma.ProductoWhereInput = {};

  if (typeof activo === 'string') where.activo = activo === 'true';
  if (typeof categoriaId === 'string' && categoriaId.trim()) {
    const id = parseInt(categoriaId, 10);
    if (!isNaN(id)) where.categoriaId = id;
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

export const getProductosFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const productos = await firematPrisma.producto.findMany({
      where: buildProductosWhere(req.query),
      include: { Categoria: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, total: productos.length, data: productos.map(toDTO) });
  } catch (error) {
    console.error('Error al obtener productos Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener productos' });
  }
};

export const exportProductosFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const productos = await firematPrisma.producto.findMany({
      where: buildProductosWhere(req.query),
      include: {
        Categoria: true,
        ProductoCodigoBarra: { orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'CRM Firemat';
    workbook.created = new Date();

    const productosSheet = workbook.addWorksheet('Productos');
    productosSheet.columns = [
      { header: 'SKU / Product Code', key: 'sku', width: 22 },
      { header: 'Producto', key: 'nombre', width: 35 },
      { header: 'Descripción', key: 'descripcion', width: 45 },
      { header: 'Categoría', key: 'categoria', width: 22 },
      { header: 'Disponibilidad', key: 'disponibilidad', width: 18 },
      { header: 'Formato', key: 'formato', width: 18 },
      { header: 'Cantidad por caja', key: 'cantidadCaja', width: 18 },
      { header: 'Precio USD', key: 'precioUsd', width: 16 },
      { header: 'Precio CLP', key: 'precio', width: 16 },
      { header: 'Precio sugerido', key: 'precioSugerido', width: 18 },
      { header: 'Precio instalador', key: 'precioInstalador', width: 18 },
      { header: 'Stock inicial', key: 'stockInicial', width: 14 },
      { header: 'Stock actual', key: 'stock', width: 14 },
      { header: 'Stock reservado', key: 'stockReservado', width: 16 },
      { header: 'Stock disponible', key: 'stockDisponible', width: 16 },
      { header: 'Stock mínimo', key: 'minStock', width: 14 },
      { header: 'Ubicación', key: 'ubicacion', width: 24 },
      { header: 'Criticidad', key: 'criticidad', width: 14 },
      { header: 'Estado', key: 'activo', width: 12 },
      { header: 'Fecha creación', key: 'createdAt', width: 20 },
      { header: 'URL imagen', key: 'imagen', width: 45 },
    ];

    for (const producto of productos) {
      productosSheet.addRow({
        sku: excelText(producto.sku),
        nombre: excelText(producto.nombre),
        descripcion: excelText(producto.descripcion),
        categoria: excelText(producto.Categoria.nombre),
        disponibilidad: excelText(producto.disponibilidad),
        formato: excelText(producto.formato),
        cantidadCaja: excelText(producto.cantidadCaja),
        precioUsd: producto.precioUsd ?? 0,
        precio: producto.precio,
        precioSugerido: producto.precioSugerido ?? 0,
        precioInstalador: producto.precioInstalador ?? 0,
        stockInicial: producto.stockInicial ?? 0,
        stock: producto.stock,
        stockReservado: producto.stockReservado,
        stockDisponible: producto.stock - producto.stockReservado,
        minStock: producto.minStock,
        ubicacion: excelText(producto.ubicacion),
        criticidad: excelText(producto.criticidad),
        activo: producto.activo ? 'Activo' : 'Inactivo',
        createdAt: formatExcelDate(producto.createdAt),
        imagen: excelText(producto.imagen),
      });
    }

    productosSheet.getColumn('precioUsd').numFmt = 'US$#,##0.00';
    productosSheet.getColumn('precio').numFmt = '$#,##0';
    productosSheet.getColumn('precioSugerido').numFmt = '$#,##0';
    productosSheet.getColumn('precioInstalador').numFmt = '$#,##0';
    styleWorksheet(productosSheet);

    const codigosSheet = workbook.addWorksheet('Códigos de barra');
    codigosSheet.columns = [
      { header: 'SKU / Product Code', key: 'sku', width: 22 },
      { header: 'Producto', key: 'nombre', width: 35 },
      { header: 'Código de barra', key: 'codigo', width: 28 },
      { header: 'Unidades por escaneo', key: 'unidadesPorEscaneo', width: 22 },
      { header: 'Descripción', key: 'descripcion', width: 35 },
      { header: 'Estado', key: 'activo', width: 12 },
      { header: 'Fecha creación', key: 'createdAt', width: 20 },
    ];

    for (const producto of productos) {
      for (const codigo of producto.ProductoCodigoBarra) {
        codigosSheet.addRow({
          sku: excelText(producto.sku),
          nombre: excelText(producto.nombre),
          codigo: excelText(codigo.codigo),
          unidadesPorEscaneo: codigo.unidadesPorEscaneo,
          descripcion: excelText(codigo.descripcion),
          activo: codigo.activo ? 'Activo' : 'Inactivo',
          createdAt: formatExcelDate(codigo.createdAt),
        });
      }
    }
    styleWorksheet(codigosSheet);

    const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="productos_firemat_${timestamp}.xlsx"`,
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al exportar productos Firemat:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Error al exportar productos' });
    }
  }
};

export const getProductoFirematById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const producto = await firematPrisma.producto.findUnique({
      where: { id },
      include: { Categoria: true },
    });

    if (!producto) {
      res.status(404).json({ success: false, error: 'Producto no encontrado' });
      return;
    }

    res.json({ success: true, data: toDTO(producto) });
  } catch (error) {
    console.error('Error al obtener producto Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener producto' });
  }
};

export const createProductoFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nombre,
      sku,
      descripcion,
      categoriaId,
      precio,
      stockInicial,
      stockMinimo,
      ubicacion,
      criticidad,
      activo,
      imagen,
      disponibilidad,
      formato,
      cantidadCaja,
      precioUsd,
      precioSugerido,
      precioInstalador,
    } = req.body;

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      res.status(400).json({ success: false, error: 'nombre es requerido' });
      return;
    }
    if (!sku || typeof sku !== 'string' || !sku.trim()) {
      res.status(400).json({ success: false, error: 'sku es requerido' });
      return;
    }
    if (categoriaId === undefined || categoriaId === null) {
      res.status(400).json({ success: false, error: 'categoriaId es requerido' });
      return;
    }
    const catId = parseInt(String(categoriaId), 10);
    if (isNaN(catId)) {
      res.status(400).json({ success: false, error: 'categoriaId inválido' });
      return;
    }

    const precioNum = normalizePriceField(precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      res.status(400).json({ success: false, error: 'precio debe ser >= 0' });
      return;
    }
    let precioUsdNum: number | undefined;
    if (precioUsd !== undefined) {
      precioUsdNum = normalizePriceField(precioUsd);
      if (!Number.isFinite(precioUsdNum) || precioUsdNum < 0) {
        res.status(400).json({ success: false, error: 'precioUsd debe ser >= 0' });
        return;
      }
    }
    let precioSugeridoNum: number | undefined;
    if (precioSugerido !== undefined) {
      precioSugeridoNum = normalizePriceField(precioSugerido);
      if (!Number.isFinite(precioSugeridoNum) || precioSugeridoNum < 0) {
        res.status(400).json({ success: false, error: 'precioSugerido debe ser >= 0' });
        return;
      }
    }
    let precioInstaladorNum: number | undefined;
    if (precioInstalador !== undefined) {
      precioInstaladorNum = normalizePriceField(precioInstalador);
      if (!Number.isFinite(precioInstaladorNum) || precioInstaladorNum < 0) {
        res.status(400).json({ success: false, error: 'precioInstalador debe ser >= 0' });
        return;
      }
    }
    if (cantidadCaja !== undefined && cantidadCaja !== null && typeof cantidadCaja !== 'string') {
      res.status(400).json({ success: false, error: 'cantidadCaja debe ser string' });
      return;
    }
    if (disponibilidad !== undefined && typeof disponibilidad !== 'string') {
      res.status(400).json({ success: false, error: 'disponibilidad debe ser string' });
      return;
    }
    if (formato !== undefined && typeof formato !== 'string') {
      res.status(400).json({ success: false, error: 'formato debe ser string' });
      return;
    }
    const stockIni = parseInt(String(stockInicial ?? 0), 10);
    if (isNaN(stockIni) || stockIni < 0) {
      res.status(400).json({ success: false, error: 'stockInicial debe ser >= 0' });
      return;
    }
    const stockMin = parseInt(String(stockMinimo ?? 0), 10);
    if (isNaN(stockMin) || stockMin < 0) {
      res.status(400).json({ success: false, error: 'stockMinimo debe ser >= 0' });
      return;
    }

    if (criticidad !== undefined && !CRITICIDADES.includes(String(criticidad).toLowerCase())) {
      res.status(400).json({ success: false, error: 'criticidad debe ser baja, media o alta' });
      return;
    }
    let activoBool: boolean | undefined;
    if (activo !== undefined) {
      const parsed = parseBool(activo);
      if (parsed === null) {
        res.status(400).json({ success: false, error: 'activo debe ser boolean (true/false)' });
        return;
      }
      activoBool = parsed;
    }

    const cat = await firematPrisma.categoria.findUnique({ where: { id: catId } });
    if (!cat) {
      res.status(400).json({ success: false, error: 'categoriaId no existe' });
      return;
    }

    let imagenFinal: string | null = typeof imagen === 'string' ? imagen.trim() || null : null;
    if (req.file) {
      try {
        const uploaded = await uploadImageDetailed(req.file.buffer, CLOUDINARY_FOLDER);
        imagenFinal = uploaded.secure_url;
      } catch {
        res.status(500).json({ success: false, error: 'Error al subir la imagen' });
        return;
      }
    }

    const ahora = new Date();

    const producto = await firematPrisma.$transaction(async (tx) => {
      const prod = await tx.producto.create({
        data: {
          nombre: nombre.trim(),
          sku: sku.trim(),
          descripcion: descripcion?.trim() ?? null,
          categoriaId: catId,
          precio: precioNum,
          precioUsd: precioUsdNum,
          precioSugerido: precioSugeridoNum,
          precioInstalador: precioInstaladorNum,
          disponibilidad: disponibilidad?.trim() || null,
          formato: formato?.trim() || null,
          cantidadCaja: cantidadCaja?.trim() || null,
          stock: stockIni,
          stockInicial: stockIni,
          entradas: stockIni,
          fechaUltimaEntrada: stockIni > 0 ? ahora : null,
          minStock: stockMin,
          ubicacion: ubicacion?.trim() ?? null,
          criticidad: criticidad !== undefined ? normCriticidad(String(criticidad)) : 'Media',
          activo: activoBool ?? true,
          imagen: imagenFinal,
        },
        include: { Categoria: true },
      });

      if (stockIni > 0) {
        await tx.movimiento.create({
          data: {
            tipo: 'ENTRADA_INICIAL',
            cantidad: stockIni,
            stockAnterior: 0,
            stockNuevo: stockIni,
            motivo: 'Creación de producto',
            productoId: prod.id,
          },
        });
      }

      return prod;
    });

    res.status(201).json({ success: true, data: toDTO(producto) });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      res.status(409).json({ success: false, error: 'El sku ya está en uso' });
      return;
    }
    console.error('Error al crear producto Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al crear producto' });
  }
};

export const updateProductoFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const existing = await firematPrisma.producto.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Producto no encontrado' });
      return;
    }

    if ('stock' in req.body || 'stockActual' in req.body || 'stock_actual' in req.body) {
      res.status(400).json({
        success: false,
        error: 'stockActual no se puede modificar directamente. Use /firemat/inventario para registrar movimientos.',
      });
      return;
    }

    const {
      nombre,
      sku,
      descripcion,
      categoriaId,
      precio,
      stockMinimo,
      stockInicial,
      ubicacion,
      criticidad,
      activo,
      imagen,
      disponibilidad,
      formato,
      cantidadCaja,
      precioUsd,
      precioSugerido,
      precioInstalador,
    } = req.body;

    const data: Prisma.ProductoUpdateInput = {};

    if (nombre !== undefined) {
      if (typeof nombre !== 'string' || !nombre.trim()) {
        res.status(400).json({ success: false, error: 'nombre inválido' });
        return;
      }
      data.nombre = nombre.trim();
    }

    if (sku !== undefined) {
      if (typeof sku !== 'string' || !sku.trim()) {
        res.status(400).json({ success: false, error: 'sku inválido' });
        return;
      }
      const dup = await firematPrisma.producto.findFirst({
        where: { sku: sku.trim(), NOT: { id } },
      });
      if (dup) {
        res.status(409).json({ success: false, error: 'El sku ya está en uso' });
        return;
      }
      data.sku = sku.trim();
    }

    if (descripcion !== undefined) data.descripcion = descripcion?.trim() ?? null;

    if (categoriaId !== undefined) {
      const catId = parseInt(String(categoriaId), 10);
      if (isNaN(catId)) {
        res.status(400).json({ success: false, error: 'categoriaId inválido' });
        return;
      }
      const cat = await firematPrisma.categoria.findUnique({ where: { id: catId } });
      if (!cat) {
        res.status(400).json({ success: false, error: 'categoriaId no existe' });
        return;
      }
      data.Categoria = { connect: { id: catId } };
    }

    if (precio !== undefined) {
      const p = normalizePriceField(precio);
      if (!Number.isFinite(p) || p < 0) {
        res.status(400).json({ success: false, error: 'precio debe ser >= 0' });
        return;
      }
      data.precio = p;
    }

    if (precioUsd !== undefined) {
      const p = normalizePriceField(precioUsd);
      if (!Number.isFinite(p) || p < 0) {
        res.status(400).json({ success: false, error: 'precioUsd debe ser >= 0' });
        return;
      }
      data.precioUsd = p;
    }

    if (precioSugerido !== undefined) {
      const p = normalizePriceField(precioSugerido);
      if (!Number.isFinite(p) || p < 0) {
        res.status(400).json({ success: false, error: 'precioSugerido debe ser >= 0' });
        return;
      }
      data.precioSugerido = p;
    }

    if (precioInstalador !== undefined) {
      const p = normalizePriceField(precioInstalador);
      if (!Number.isFinite(p) || p < 0) {
        res.status(400).json({ success: false, error: 'precioInstalador debe ser >= 0' });
        return;
      }
      data.precioInstalador = p;
    }

    if (cantidadCaja !== undefined) {
      if (cantidadCaja !== null && typeof cantidadCaja !== 'string') {
        res.status(400).json({ success: false, error: 'cantidadCaja debe ser string' });
        return;
      }
      data.cantidadCaja = cantidadCaja?.trim() || null;
    }

    if (disponibilidad !== undefined) {
      if (typeof disponibilidad !== 'string') {
        res.status(400).json({ success: false, error: 'disponibilidad debe ser string' });
        return;
      }
      data.disponibilidad = disponibilidad.trim() || null;
    }

    if (formato !== undefined) {
      if (typeof formato !== 'string') {
        res.status(400).json({ success: false, error: 'formato debe ser string' });
        return;
      }
      data.formato = formato.trim() || null;
    }

    if (stockMinimo !== undefined) {
      const sm = parseInt(String(stockMinimo), 10);
      if (isNaN(sm) || sm < 0) {
        res.status(400).json({ success: false, error: 'stockMinimo debe ser >= 0' });
        return;
      }
      data.minStock = sm;
    }

    if (stockInicial !== undefined) {
      const si = parseInt(String(stockInicial), 10);
      if (isNaN(si) || si < 0) {
        res.status(400).json({ success: false, error: 'stockInicial debe ser >= 0' });
        return;
      }
      data.stockInicial = si;
    }

    if (ubicacion !== undefined) data.ubicacion = ubicacion?.trim() ?? null;

    if (req.file) {
      try {
        const oldPublicId = existing.imagen ? extractPublicId(existing.imagen) : null;
        const uploaded = await uploadImageDetailed(req.file.buffer, CLOUDINARY_FOLDER);
        data.imagen = uploaded.secure_url;
        if (oldPublicId) {
          deleteImage(oldPublicId).catch((err) =>
            console.error('Error al eliminar imagen anterior de Cloudinary:', err)
          );
        }
      } catch {
        res.status(500).json({ success: false, error: 'Error al subir la imagen' });
        return;
      }
    } else if (imagen !== undefined) {
      data.imagen = imagen?.trim() ?? null;
    }

    if (criticidad !== undefined) {
      if (!CRITICIDADES.includes(String(criticidad).toLowerCase())) {
        res.status(400).json({ success: false, error: 'criticidad debe ser baja, media o alta' });
        return;
      }
      data.criticidad = normCriticidad(String(criticidad));
    }

    if (activo !== undefined) {
      const parsed = parseBool(activo);
      if (parsed === null) {
        res.status(400).json({ success: false, error: 'activo debe ser boolean (true/false)' });
        return;
      }
      data.activo = parsed;
    }

    const updated = await firematPrisma.producto.update({
      where: { id },
      data,
      include: { Categoria: true },
    });

    res.json({ success: true, data: toDTO(updated) });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      res.status(409).json({ success: false, error: 'El sku ya está en uso' });
      return;
    }
    console.error('Error al actualizar producto Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar producto' });
  }
};

export const asignarCategoriaProductosFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productoIds, categoriaId } = req.body;

    if (productoIds === undefined || productoIds === null) {
      res.status(400).json({ success: false, error: 'productoIds es requerido' });
      return;
    }
    if (!Array.isArray(productoIds)) {
      res.status(400).json({ success: false, error: 'productoIds debe ser un array' });
      return;
    }
    if (productoIds.length === 0) {
      res.status(400).json({ success: false, error: 'productoIds debe contener al menos un ID' });
      return;
    }

    const ids: number[] = [];
    for (const raw of productoIds) {
      const id = Number(raw);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ success: false, error: `ID inválido: ${raw}` });
        return;
      }
      ids.push(id);
    }

    if (categoriaId === undefined || categoriaId === null) {
      res.status(400).json({ success: false, error: 'categoriaId es requerido' });
      return;
    }
    const catId = parseInt(String(categoriaId), 10);
    if (!Number.isInteger(catId) || catId <= 0) {
      res.status(400).json({ success: false, error: 'categoriaId inválido' });
      return;
    }

    const categoria = await firematPrisma.categoria.findUnique({ where: { id: catId } });
    if (!categoria) {
      res.status(404).json({ success: false, error: 'Categoría no encontrada' });
      return;
    }

    const productosExistentes = await firematPrisma.producto.count({
      where: { id: { in: ids } },
    });
    if (productosExistentes === 0) {
      res.status(404).json({ success: false, error: 'Ningún producto encontrado con los IDs proporcionados' });
      return;
    }

    const result = await firematPrisma.producto.updateMany({
      where: { id: { in: ids } },
      data: { categoriaId: catId },
    });

    res.json({
      success: true,
      message: 'Categoría asignada correctamente',
      data: {
        categoriaId: catId,
        productosActualizados: result.count,
      },
    });
  } catch (error) {
    console.error('Error al asignar categoría masiva Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al asignar categoría' });
  }
};

export const patchEstadoProductoFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const existing = await firematPrisma.producto.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Producto no encontrado' });
      return;
    }

    const { activo } = req.body;
    if (typeof activo !== 'boolean') {
      res.status(400).json({ success: false, error: 'activo debe ser boolean' });
      return;
    }

    const updated = await firematPrisma.producto.update({
      where: { id },
      data: { activo },
      include: { Categoria: true },
    });

    res.json({ success: true, data: toDTO(updated) });
  } catch (error) {
    console.error('Error al cambiar estado producto Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al cambiar estado' });
  }
};
