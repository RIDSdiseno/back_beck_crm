import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import registrosRoutes from './routes/registros.routes';
import procesamientoRoutes from './routes/procesamiento.routes';
import notificacionesRoutes from './routes/notificaciones.routes';
import obrasRoutes from './routes/obras.routes';
import itemizadosRoutes from './routes/itemizados.routes';
import statsRoutes from './routes/stats.routes';
import funnelBeckRoutes from './routes/funnelBeck.routes';
import indicadoresRoutes from "./routes/indicadores.routes";

const app = express();

// ===========================================
// MIDDLEWARES GLOBALES
// ===========================================

// CORS - Permitir peticiones desde el frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger simple (en producción usar Winston o similar)
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===========================================
// RUTAS
// ===========================================

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/registros-terreno', registrosRoutes);
app.use('/api/procesamiento', procesamientoRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/obras', obrasRoutes);
app.use('/api/itemizados', itemizadosRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/funnel-beck', funnelBeckRoutes);
app.use("/api/indicadores", indicadoresRoutes);

// Ruta 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ===========================================
// ERROR HANDLER GLOBAL
// ===========================================
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Error interno del servidor',
  });
});

export default app;