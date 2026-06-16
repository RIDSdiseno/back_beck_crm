import { Request, Response } from 'express';
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
  disponibilidad: p.disponibilidad,
  formato: p.formato,
  cantidadCaja: p.cantidadCaja,
  stockActual: p.stock,
  stockReservado: p.stockReservado,
  stockDisponible: p.stock - p.stockReservado,
  stockMinimo: p.minStock,
  ubicacion: p.ubicacion,
  criticidad: p.criticidad,
  activo: p.activo,
  imagen: p.imagen,
  alertaStockBajo: p.stock <= p.minStock,
  createdAt: p.createdAt,
});

export const getProductosFiremat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, activo, categoriaId } = req.query;
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

    const productos = await firematPrisma.producto.findMany({
      where,
      include: { Categoria: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, total: productos.length, data: productos.map(toDTO) });
  } catch (error) {
    console.error('Error al obtener productos Firemat:', error);
    res.status(500).json({ success: false, error: 'Error al obtener productos' });
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

    const precioNum = parseFloat(String(precio ?? 0));
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      res.status(400).json({ success: false, error: 'precio debe ser >= 0' });
      return;
    }
    let precioUsdNum: number | undefined;
    if (precioUsd !== undefined) {
      precioUsdNum = parseFloat(String(precioUsd));
      if (!Number.isFinite(precioUsdNum) || precioUsdNum < 0) {
        res.status(400).json({ success: false, error: 'precioUsd debe ser >= 0' });
        return;
      }
    }
    let precioSugeridoNum: number | undefined;
    if (precioSugerido !== undefined) {
      precioSugeridoNum = parseFloat(String(precioSugerido));
      if (!Number.isFinite(precioSugeridoNum) || precioSugeridoNum < 0) {
        res.status(400).json({ success: false, error: 'precioSugerido debe ser >= 0' });
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
      ubicacion,
      criticidad,
      activo,
      imagen,
      disponibilidad,
      formato,
      cantidadCaja,
      precioUsd,
      precioSugerido,
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
      const p = parseFloat(String(precio));
      if (!Number.isFinite(p) || p < 0) {
        res.status(400).json({ success: false, error: 'precio debe ser >= 0' });
        return;
      }
      data.precio = p;
    }

    if (precioUsd !== undefined) {
      const p = parseFloat(String(precioUsd));
      if (!Number.isFinite(p) || p < 0) {
        res.status(400).json({ success: false, error: 'precioUsd debe ser >= 0' });
        return;
      }
      data.precioUsd = p;
    }

    if (precioSugerido !== undefined) {
      const p = parseFloat(String(precioSugerido));
      if (!Number.isFinite(p) || p < 0) {
        res.status(400).json({ success: false, error: 'precioSugerido debe ser >= 0' });
        return;
      }
      data.precioSugerido = p;
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
