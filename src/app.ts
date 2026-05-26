import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import registrosRoutes from './routes/registros.routes';
import procesamientoRoutes from './routes/procesamiento.routes';
import notificacionesRoutes from './routes/notificaciones.routes';
import obrasRoutes from './routes/obras.routes';
import itemizadosRoutes from './routes/itemizados.routes';
import itemizadosMandanteRoutes from './routes/itemizadosMandante.routes';
import statsRoutes from './routes/stats.routes';
import dashboardBeckRoutes from './routes/dashboard-beck.routes';
import funnelBeckRoutes from './routes/funnelBeck.routes';
import indicadoresRoutes from "./routes/indicadores.routes";
import usuariosRoutes from './routes/usuarios.routes';
import cotizacionesRoutes from './routes/cotizaciones.routes';
import movimientosCrmRoutes from './routes/movimientosCrm.routes';
import firematProductosRoutes from './routes/firemat/productos.routes';
import firematInventarioRoutes from './routes/firemat/inventario.routes';
import firematVentasRoutes from './routes/firemat/ventas.routes';
import cotizacionesFirematRoutes from './routes/firemat/cotizaciones-firemat.routes';
import funnelFirematRoutes from './routes/firemat/funnel-firemat.routes';
import firematCategoriasRoutes from './routes/firemat/categorias.routes';
import beckUsuariosParametrosRoutes from './routes/beck/usuarios-parametros.routes';
import firematUsuariosParametrosRoutes from './routes/firemat/usuarios-parametros.routes';
import { authenticate, denyRoles } from './middlewares/auth';
import clientesBeckRoutes from './routes/clientes-beck.routes';
import firematClientesRoutes from './routes/firemat/clientes-firemat.routes';
import oficinaTecnicaPreventaRoutes from './routes/oficinaTecnicaPreventa.routes';
import configuracionCamposRegistroRoutes from './routes/configuracionCamposRegistro.routes';
import registrosCampoRoutes from './routes/registros-campo.routes';

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

// Roles que solo operan en BECK (bloquea terreno/jefeobra de todo, y Firemat de BECK)
const blockBeckRoutes = [
  authenticate,
  denyRoles('terreno', 'jefeobra', 'bodeguero', 'vendedor_firemat', 'visualizador_firemat'),
];

// Rutas BECK — solo roles Beck + administrador
app.use('/api/registros', blockBeckRoutes, registrosRoutes);
app.use('/api/procesamiento', blockBeckRoutes, procesamientoRoutes);
app.use('/api/notificaciones', blockBeckRoutes, notificacionesRoutes);
app.use('/api/obras', blockBeckRoutes, obrasRoutes);
app.use('/api/itemizados', blockBeckRoutes, itemizadosRoutes);
app.use('/api/itemizados-mandante', itemizadosMandanteRoutes);
app.use('/api/stats', blockBeckRoutes, statsRoutes);
app.use('/api/dashboard/beck', blockBeckRoutes, dashboardBeckRoutes);
app.use('/api/funnel-beck', blockBeckRoutes, funnelBeckRoutes);
app.use('/api/oficina-tecnica-preventa', oficinaTecnicaPreventaRoutes);
app.use('/api/usuarios', blockBeckRoutes, usuariosRoutes);
app.use('/api/cotizaciones', blockBeckRoutes, cotizacionesRoutes);
app.use('/api/movimientos-crm', blockBeckRoutes, movimientosCrmRoutes);
app.use('/api/clientes-beck', blockBeckRoutes, clientesBeckRoutes);
// Rutas parametros de usuarios por empresa
app.use('/api/beck/usuarios-parametros', blockBeckRoutes, beckUsuariosParametrosRoutes);
app.use('/api/firemat/usuarios-parametros', authenticate, firematUsuariosParametrosRoutes);

// Rutas Firemat — permisos finos definidos en cada router
app.use('/api/firemat/categorias', authenticate, firematCategoriasRoutes);
app.use('/api/firemat/productos', authenticate, firematProductosRoutes);
app.use('/api/firemat/inventario', authenticate, firematInventarioRoutes);
app.use('/api/firemat/ventas', authenticate, firematVentasRoutes);
app.use('/api/firemat/funnel', authenticate, funnelFirematRoutes);
app.use('/api/firemat/cotizaciones', authenticate, cotizacionesFirematRoutes);
app.use('/api/firemat/clientes', authenticate, firematClientesRoutes);

// Configuración de visibilidad de campos por rol (accesible a todos los roles autenticados)
app.use('/api/configuracion-campos-registro', configuracionCamposRegistroRoutes);

// Registros con sanitización por rol — accesibles para terreno, jefeobra y roles Beck
// NO usa blockBeckRoutes para permitir terreno/jefeobra
app.use('/api/registros-campo', registrosCampoRoutes);

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
