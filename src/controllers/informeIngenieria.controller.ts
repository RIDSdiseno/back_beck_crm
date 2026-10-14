import { informeJobs } from '../services/informeJobs.service';
import { ordenarInforme, resumenInforme } from '../helpers/resumenInforme';
import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { adjuntarCodigosBeck } from '../services/configuracionCamposRegistro.service';
import { generateRegistroPdfBuffer } from '../services/registroPdf.service';
import { generarInformeIngenieria, type FichaInforme } from '../services/informeIngenieria.service';
import { seleccionInformeValida } from '../helpers/validarInformeIngenieria';

export async function descargarInformeIngenieria(req: Request, res: Response): Promise<void> {
  const { registroIds, titulo, introduccion, conclusion, cliente = '', destinatario = '', fotoPortada = '', orden = 'piso', tamanoFotos = 'compacta' } = req.body ?? {};
  if (!Array.isArray(registroIds) || registroIds.length < 1 || registroIds.length > 50 ||
    registroIds.some(id => typeof id !== 'string' || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) ||
    new Set(registroIds).size !== registroIds.length ||
    typeof titulo !== 'string' || !titulo.trim() || titulo.length > 150 ||
    typeof introduccion !== 'string' || !introduccion.trim() || introduccion.length > 5000 ||
    typeof conclusion !== 'string' || !conclusion.trim() || conclusion.length > 5000) {
    res.status(400).json({ error: 'Selecciona entre 1 y 50 registros sin duplicados y completa los textos del informe.' }); return;
  }
  if (typeof cliente !== 'string' || cliente.length > 150 || typeof destinatario !== 'string' || destinatario.length > 150 ||
      !['piso', 'fecha', 'sello'].includes(orden) || !['compacta', 'grande'].includes(tamanoFotos) ||
      typeof fotoPortada !== 'string' || fotoPortada.length > 4 * 1024 * 1024 + 30 ||
      (fotoPortada && !/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(fotoPortada))) {
    res.status(400).json({ error: 'Revisa las opciones de presentación. La portada admite una imagen JPG o PNG de hasta 3 MB.' }); return;
  }
  const portadaBuffer = fotoPortada ? Buffer.from(fotoPortada.split(',')[1], 'base64') : undefined;
  if (portadaBuffer && (portadaBuffer.length > 3 * 1024 * 1024 ||
      !(portadaBuffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ||
        portadaBuffer.subarray(0, 3).equals(Buffer.from([255,216,255]))))) {
    res.status(400).json({ error: 'La fotografía de portada no es un JPG o PNG válido.' }); return;
  }
  try {
    const registros = await prisma.registroTerreno.findMany({
      where: { id: { in: registroIds } },
      include: {
        obra: { select: { id: true, nombre: true, codigo: true } },
        usuario: { select: { id: true, nombre: true, email: true, rol: true } },
        fotos_registro: { select: { url: true }, orderBy: { created_at: 'asc' } },
      },
    });
    if (!seleccionInformeValida(registroIds, registros)) {
      res.status(409).json({ error: 'Todos los registros deben seguir validados, estar completos y pertenecer a una misma obra. Actualiza la selección.' }); return;
    }
    const job = informeJobs.crear(req.userId!, titulo.trim(), async avance => {
      avance(3);
      // Verificar nuevamente al salir de la cola; nunca incluir registros desvalidados.
      const actuales = await prisma.registroTerreno.findMany({ where: { id: { in: registroIds } } });
      if (!seleccionInformeValida(registroIds, actuales) || actuales.some(r => r.updatedAt.getTime() !== registros.find(original => original.id === r.id)!.updatedAt.getTime())) {
        throw new Error('La selección cambió mientras esperaba en la cola.');
      }
      const responsable = await prisma.usuario.findUnique({ where: { id: req.userId }, select: { nombre: true } });
      const enriquecidos = await adjuntarCodigosBeck(registros as unknown as Record<string, unknown>[]);
      const fichas: FichaInforme[] = [];
      for (const registro of ordenarInforme(registros, orden)) {
        const id = registro.id;
        const codigo = enriquecidos.find(r => r.id === id)?.codigoBeck ?? null;
        fichas.push({ id, numeroSello: registro.numeroSello,
          pdf: await generateRegistroPdfBuffer({ ...registro, codigoBeck: codigo }, undefined, { strictImages: true, tamanoFotos }) });
        if (fichas.reduce((bytes, ficha) => bytes + ficha.pdf.length, 0) > 40 * 1024 * 1024) throw new Error('Informe demasiado grande.');
        avance(5 + fichas.length / registros.length * 80);
      }
      const fechas = registros.map(r => r.fecha.toISOString().slice(0, 10)).sort();
      const fechaVisible = (value: string) => value.split('-').reverse().join('-');
      const pdf = await generarInformeIngenieria({
        cliente: cliente.trim(), destinatario: destinatario.trim(), fotoPortada: portadaBuffer,
        resumen: resumenInforme(registros),
        titulo: titulo.trim(), introduccion: introduccion.trim(), conclusion: conclusion.trim(),
        obra: registros[0].obra.nombre + ' (' + registros[0].obra.codigo + ')',
        responsable: responsable?.nombre ?? 'Ingeniería',
        periodo: fechaVisible(fechas[0]) + ' al ' + fechaVisible(fechas[fechas.length - 1]), fichas,
      });
      avance(98);
      return pdf;
    });
    res.status(202).setHeader('Cache-Control', 'no-store');
    res.json(job);
  } catch (error) {
    console.error('Error al generar informe de ingeniería:', error);
    const ocupado = error instanceof Error && /Ya tienes|ocupada/.test(error.message);
    res.status(ocupado ? 429 : 500).json({ error: ocupado ? (error as Error).message : 'No se pudo iniciar el informe. Intenta nuevamente.' });
  }
}

export function listarInformesIngenieria(req: Request, res: Response): void {
  res.setHeader('Cache-Control', 'no-store');
  res.json(informeJobs.listar(req.userId!));
}
export function descargarInformeTemporal(req: Request, res: Response): void {
  res.setHeader('Cache-Control', 'no-store');
  const job = informeJobs.obtener(req.userId!, String(req.params.informeId));
  if (!job) { res.status(404).json({ error: 'El informe expiró o no está disponible. Genera uno nuevo.' }); return; }
  if (!job.pdf || job.estado !== 'listo') { res.status(409).json({ error: 'El informe todavía no está disponible.' }); return; }
  res.type('pdf').setHeader('Content-Disposition', 'attachment; filename="informe-ingenieria-beck.pdf"');
  res.send(job.pdf);
}
