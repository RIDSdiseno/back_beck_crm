import { randomUUID } from 'node:crypto';

type Estado = 'en_cola' | 'generando' | 'listo' | 'error';
type Trabajo = (avance: (porcentaje: number) => void) => Promise<Buffer>;
interface Job {
  id: string; owner: string; titulo: string; estado: Estado; progreso: number;
  creado: number; vence: number; error?: string; pdf?: Buffer; ejecutar?: Trabajo;
}

// Almacenamiento temporal por proceso. No escribe archivos ni historial en PostgreSQL.
export class InformeJobs {
  private jobs = new Map<string, Job>();
  private ocupado = false;
  constructor(private now = () => Date.now(), private ttl = 60 * 60 * 1000) {}
  limpiar() {
    for (const [id, job] of this.jobs) {
      if (['listo', 'error'].includes(job.estado) && job.vence <= this.now()) this.jobs.delete(id);
    }
  }
  private publico(job: Job) {
    return { id: job.id, titulo: job.titulo, estado: job.estado, progreso: job.progreso,
      creado: new Date(job.creado).toISOString(),
      vence: ['listo', 'error'].includes(job.estado) ? new Date(job.vence).toISOString() : null,
      error: job.error };
  }
  listar(owner: string) {
    this.limpiar();
    return [...this.jobs.values()].filter(j => j.owner === owner).map(j => this.publico(j));
  }
  obtener(owner: string, id: string) {
    this.limpiar();
    const job = this.jobs.get(id);
    return job?.owner === owner ? job : undefined;
  }
  crear(owner: string, titulo: string, ejecutar: Trabajo) {
    this.limpiar();
    const jobs = [...this.jobs.values()];
    if (jobs.some(j => j.owner === owner && ['en_cola', 'generando'].includes(j.estado))) {
      throw new Error('Ya tienes un informe en preparación. Espera a que termine.');
    }
    if (jobs.length >= 20 || jobs.filter(j => ['en_cola', 'generando'].includes(j.estado)).length >= 5 ||
      jobs.reduce((n, j) => n + (j.pdf?.length ?? 0), 0) >= 100 * 1024 * 1024) {
      throw new Error('La generación de informes está ocupada. Intenta más tarde.');
    }
    const job: Job = { id: randomUUID(), owner, titulo, estado: 'en_cola', progreso: 0,
      creado: this.now(), vence: 0, ejecutar };
    this.jobs.set(job.id, job);
    setImmediate(() => void this.procesar());
    return this.publico(job);
  }
  private async procesar() {
    if (this.ocupado) return;
    const job = [...this.jobs.values()].find(j => j.estado === 'en_cola');
    if (!job) return;
    this.ocupado = true;
    job.estado = 'generando';
    try {
      const pdf = await job.ejecutar!(valor => { job.progreso = Math.max(job.progreso, Math.min(99, Math.round(valor))); });
      this.limpiar();
      const bytes = [...this.jobs.values()].reduce((n, j) => n + (j.pdf?.length ?? 0), 0);
      if (pdf.length > 40 * 1024 * 1024 || bytes + pdf.length > 100 * 1024 * 1024) {
        throw new Error('El informe supera el tamaño disponible. Selecciona menos registros.');
      }
      job.pdf = pdf; job.progreso = 100; job.estado = 'listo';
    } catch (error) {
      console.error('Generación temporal de informe fallida:', error);
      job.estado = 'error';
      job.error = 'No se pudo completar el informe. Revisa las fotografías y el estado de los registros, o selecciona menos registros e intenta nuevamente.';
    } finally {
      job.ejecutar = undefined;
      job.vence = this.now() + this.ttl;
      this.ocupado = false;
      setImmediate(() => void this.procesar());
    }
  }
}

export const informeJobs = new InformeJobs();
setInterval(() => informeJobs.limpiar(), 60_000).unref();
