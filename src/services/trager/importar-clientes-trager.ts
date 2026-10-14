import type { RawFilaCliente } from '../../utils/importClientes';
import { buildClienteData, mapearFilaImport, filaImportVacia, procesarRut, type ImportClientesTragerResult } from './clientes-trager.validation';

interface RepositorioImportacion {
  existeRut(rut: string): Promise<boolean>;
  crear(data: ReturnType<typeof buildClienteData> & { nombre: string; rut: string; activo: boolean }): Promise<ImportClientesTragerResult['creados'][number]>;
}
export async function importarFilasClientesTrager(filas: RawFilaCliente[], repo: RepositorioImportacion): Promise<ImportClientesTragerResult> {
  if (filas.length > 5000) throw new Error('La importación admite hasta 5.000 filas por archivo.');
  const result: ImportClientesTragerResult = { totalProcesados: 0, totalCreados: 0, totalDuplicados: 0, totalErrores: 0, creados: [], duplicadosOmitidos: [], errores: [], advertencias: [] };
  const vistos = new Set<string>();
  for (let i = 0; i < filas.length; i++) {
    const mapped = mapearFilaImport(filas[i]);
    if (filaImportVacia(mapped)) continue;
    const fila = i + 2;
    result.totalProcesados++;
    let rut: string | null = null;
    const duplicado = () => result.duplicadosOmitidos.push({ fila, rut: rut!, razonSocial: mapped.razonSocial || mapped.nombre || '', motivo: 'RUT ya existe en Trager o en el archivo' });
    try {
      rut = procesarRut(mapped.rut);
      if (!rut) throw new Error('El RUT es obligatorio.');
      if (!mapped.nombre) throw new Error('El nombre es obligatorio.');
      if (vistos.has(rut) || await repo.existeRut(rut)) { duplicado(); continue; }
      const data = buildClienteData({ ...mapped, activo: true });
      const creado = await repo.crear({ ...data, nombre: data.nombre!, rut, activo: true });
      vistos.add(rut);
      result.creados.push(creado);
    } catch (error) {
      // También evita sobrescrituras si dos importaciones intentan crear el mismo RUT.
      if (rut && (error as { code?: string })?.code === 'P2002') { duplicado(); continue; }
      result.errores.push({ fila, ...(mapped.rut ? { rut: mapped.rut } : {}), error: error instanceof Error ? error.message : 'No se pudo crear esta fila.' });
    }
  }
  if (!result.totalProcesados) throw new Error('No se encontraron datos en las columnas de la plantilla. Revisa los encabezados.');
  result.totalCreados = result.creados.length;
  result.totalDuplicados = result.duplicadosOmitidos.length;
  result.totalErrores = result.errores.length;
  return result;
}
