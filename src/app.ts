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
import funnelUnificadoRoutes from './routes/funnelUnificado.routes';
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
import reportesFirematRoutes from './routes/firemat/reportes.routes';
import oficinaTecnicaPreventaRoutes from './routes/oficinaTecnicaPreventa.routes';
import configuracionCamposRegistroRoutes from './routes/configuracionCamposRegistro.routes';
import registrosCampoRoutes from './routes/registros-campo.routes';
import itemizadoOpcionesRoutes from './routes/itemizadoOpciones.routes';
import alertasRoutes from './routes/alertas.routes';
import configuracionValidacionRoutes from './routes/configuracionValidacion.routes';
import clienteRoutes from './routes/cliente.routes';
import vistaClienteConfigRoutes from './routes/vistaClienteConfig.routes';
import meRoutes from './routes/me.routes';
import permisosRolRoutes from './routes/permisos-rol.routes';

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


app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.method === 'GET' && req.path === '/api/auth/me') {
    next();
    return;
  }

  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


app.use('/api/auth', authRoutes);
app.use("/api/indicadores", indicadoresRoutes);

const blockBeckCommercial = [
  authenticate,
  denyRoles('terreno', 'jefeobra', 'bodeguero', 'vendedor_firemat', 'visualizador_firemat'),
];

const blockBeckOperacional = [
  authenticate,
  denyRoles('terreno', 'bodeguero', 'vendedor_firemat', 'visualizador_firemat'),
];

app.use('/api/registros', blockBeckOperacional, registrosRoutes);
app.use('/api/obras', blockBeckOperacional, obrasRoutes);
app.use('/api/notificaciones', blockBeckOperacional, notificacionesRoutes);
app.use('/api/dashboard/beck', blockBeckOperacional, dashboardBeckRoutes);
app.use('/api/usuarios', blockBeckOperacional, usuariosRoutes);
app.use('/api/usuarios-parametros', blockBeckOperacional, beckUsuariosParametrosRoutes);
app.use('/api/beck/usuarios-parametros', blockBeckOperacional, beckUsuariosParametrosRoutes);

app.use('/api/funnel-beck', blockBeckCommercial, funnelBeckRoutes);
app.use('/api/cotizaciones', blockBeckCommercial, cotizacionesRoutes);
app.use('/api/clientes-beck', blockBeckCommercial, clientesBeckRoutes);
app.use('/api/movimientos-crm', blockBeckCommercial, movimientosCrmRoutes);
app.use('/api/stats', blockBeckCommercial, statsRoutes);
app.use('/api/procesamiento', blockBeckCommercial, procesamientoRoutes);
app.use('/api/itemizados', blockBeckCommercial, itemizadosRoutes);
app.use('/api/alertas', authenticate, alertasRoutes);
app.use('/api/funnel-unificado', funnelUnificadoRoutes);
app.use('/api/configuracion-validacion', configuracionValidacionRoutes);

app.use('/api/itemizados-mandante', itemizadosMandanteRoutes);
app.use('/api/oficina-tecnica-preventa', oficinaTecnicaPreventaRoutes);
app.use('/api/firemat/usuarios-parametros', authenticate, firematUsuariosParametrosRoutes);

app.use('/api/firemat/categorias', authenticate, firematCategoriasRoutes);
app.use('/api/firemat/productos', authenticate, firematProductosRoutes);
app.use('/api/firemat/inventario', authenticate, firematInventarioRoutes);
app.use('/api/firemat/ventas', authenticate, firematVentasRoutes);
app.use('/api/firemat/funnel', authenticate, funnelFirematRoutes);
app.use('/api/firemat/cotizaciones', authenticate, cotizacionesFirematRoutes);
app.use('/api/firemat/clientes', authenticate, firematClientesRoutes);
app.use('/api/firemat/reportes', authenticate, reportesFirematRoutes);

app.use('/api/configuracion-campos-registro', configuracionCamposRegistroRoutes);

app.use('/api/itemizado-opciones', itemizadoOpcionesRoutes);

app.use('/api/registros-campo', registrosCampoRoutes);

app.use('/api/me', meRoutes);

app.use('/api/permisos', authenticate, permisosRolRoutes);

app.use('/api/cliente', clienteRoutes);

app.use('/api/vista-cliente', blockBeckOperacional, vistaClienteConfigRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

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
