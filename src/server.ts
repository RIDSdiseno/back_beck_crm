import 'dotenv/config';
import app from './app';
import { pool } from './config/database';

const PORT = process.env.PORT || 5000;

// Test de conexión a la base de datos antes de iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a PostgreSQL
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL establecida');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor BECK corriendo en puerto ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();