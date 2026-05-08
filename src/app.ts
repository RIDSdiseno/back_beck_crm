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
import usuariosRoutes from './routes/usuarios.routes';
import cotizacionesRoutes from './routes/cotizaciones.routes';
import movimientosCrmRoutes from './routes/movimientosCrm.routes';
import firematProductosRoutes from './routes/firemat/productos.routes';
import firematInventarioRoutes from './routes/firemat/inventario.routes';
import firematVentasRoutes from './routes/firemat/ventas.routes';
import cotizacionesFirematRoutes from './routes/firemat/cotizaciones-firemat.routes';
import { authenticate, denyRoles } from './middlewares/auth';


const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://beck-crm.netlify.app',
].filter((origin): origin is string => Boolean(origin));

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 204,
};

// ===========================================
// MIDDLEWARES GLOBALES
// ===========================================

// CORS - Permitir peticiones desde el frontend
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger simple (en producción usar Winston o similar)
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.method === 'GET' && req.path === '/api/auth/me') {
    next();
    return;
  }

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
app.use("/api/indicadores", indicadoresRoutes);

const blockFieldRoles = [authenticate, denyRoles('terreno', 'jefeobra')];

app.use('/api/registros', blockFieldRoles, registrosRoutes);
app.use('/api/procesamiento', blockFieldRoles, procesamientoRoutes);
app.use('/api/notificaciones', blockFieldRoles, notificacionesRoutes);
app.use('/api/obras', blockFieldRoles, obrasRoutes);
app.use('/api/itemizados', blockFieldRoles, itemizadosRoutes);
app.use('/api/stats', blockFieldRoles, statsRoutes);
app.use('/api/funnel-beck', blockFieldRoles, funnelBeckRoutes);
app.use('/api/usuarios', blockFieldRoles, usuariosRoutes);
app.use('/api/cotizaciones', blockFieldRoles, cotizacionesRoutes);
app.use('/api/movimientos-crm', blockFieldRoles, movimientosCrmRoutes);
app.use('/api/firemat/productos', blockFieldRoles, firematProductosRoutes);
app.use('/api/firemat/inventario', blockFieldRoles, firematInventarioRoutes);
app.use('/api/firemat/ventas', blockFieldRoles, firematVentasRoutes);
app.use('/api/firemat/cotizaciones', cotizacionesFirematRoutes);

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
