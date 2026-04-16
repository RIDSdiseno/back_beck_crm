# 🚂 Configuración de Railway para BECK Backend

## Paso 1: Crear Base de Datos PostgreSQL en Railway

1. Ve a [Railway.app](https://railway.app)
2. Crea una nueva cuenta o inicia sesión
3. Haz clic en "New Project"
4. Selecciona "Provision PostgreSQL"
5. Railway creará automáticamente una base de datos PostgreSQL

## Paso 2: Obtener la URL de Conexión

1. En tu proyecto Railway, haz clic en el servicio PostgreSQL
2. Ve a la pestaña "Connect"
3. Copia la **PostgreSQL Connection URL** (algo como):
   ```
   postgresql://postgres:PASSWORD@HOST:PORT/railway
   ```

## Paso 3: Configurar Variables de Entorno en tu Backend

Crea un archivo `.env` en la carpeta `back/` con este contenido:

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos PostgreSQL (Railway)
DATABASE_URL=postgresql://postgres:TU_PASSWORD@HOSTNAME.railway.app:PORT/railway

# JWT (CAMBIA ESTE SECRETO EN PRODUCCIÓN)
JWT_SECRET=mi_secreto_super_seguro_beck_2025_cambiar
JWT_EXPIRES_IN=7d

# Cloudinary (obtén estos valores en cloudinary.com)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Email (Gmail - usa App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password_de_gmail
EMAIL_FROM="BECK Sistema <noreply@beck.cl>"

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Upload limits
MAX_FILE_SIZE=5242880
MAX_FILES_PER_UPLOAD=5
```

## Paso 4: Ejecutar el Esquema SQL en Railway

### Opción A: Usando Railway CLI (Recomendado)

1. Instala Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Inicia sesión:
   ```bash
   railway login
   ```

3. Vincula tu proyecto:
   ```bash
   railway link
   ```

4. Ejecuta el esquema:
   ```bash
   railway run psql < database-schema.sql
   ```

### Opción B: Usando Cliente PostgreSQL (psql)

1. Instala PostgreSQL localmente (para tener `psql`)
2. Ejecuta:
   ```bash
   psql "postgresql://postgres:PASSWORD@HOSTNAME.railway.app:PORT/railway" -f database-schema.sql
   ```

### Opción C: Usando TablePlus, DBeaver o pgAdmin

1. Descarga [TablePlus](https://tableplus.com/) (recomendado)
2. Crea nueva conexión PostgreSQL con los datos de Railway
3. Abre el archivo `database-schema.sql`
4. Ejecuta todo el script (Cmd+Enter o Ctrl+Enter)

## Paso 5: Verificar que las Tablas se Crearon

Conéctate a tu base de datos y ejecuta:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver:
- cotizaciones
- inventario
- itemizados
- movimientos_inventario
- notificaciones
- obras
- procesamiento_ingenieria
- registros_terreno
- usuarios

## Paso 6: Verificar Usuarios de Prueba

```sql
SELECT id, nombre, email, rol, activo
FROM usuarios;
```

Deberías ver 4 usuarios:
- admin@beck.com (administrador)
- terreno@beck.com (terreno)
- ing@beck.com (ingenieria)
- view@beck.com (visualizador)

## Paso 7: Iniciar el Backend

```bash
cd back
npm run dev
```

El servidor debería iniciar en `http://localhost:5000`

## Paso 8: Probar el Login

Usa Postman o curl:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@beck.com", "password": "Admin123!"}'
```

Deberías recibir un token JWT y los datos del usuario.

## 🔧 Troubleshooting

### Error: "connection refused"

- Verifica que la URL de Railway sea correcta
- Asegúrate de que el servicio PostgreSQL esté corriendo en Railway
- Verifica tu conexión a internet

### Error: "password authentication failed"

- Copia de nuevo la DATABASE_URL completa desde Railway
- No copies espacios en blanco al inicio/final

### Error: "SSL connection required"

Modifica tu DATABASE_URL agregando `?sslmode=require` al final:
```
postgresql://postgres:PASSWORD@HOST:PORT/railway?sslmode=require
```

## 📊 Monitoreo en Railway

Railway te proporciona:
- ✅ Logs en tiempo real
- ✅ Métricas de uso (CPU, RAM, Red)
- ✅ Backups automáticos
- ✅ Variables de entorno seguras

## 💰 Costos

Railway ofrece:
- $5 de crédito gratis al mes
- Suficiente para desarrollo y testing
- Para producción, considera plan de pago

## 🚀 Próximos Pasos

Una vez que el backend esté corriendo:
1. ✅ Configurar Cloudinary para upload de fotos
2. ✅ Configurar Gmail para envío de emails
3. ✅ Conectar el frontend React con el backend
4. ✅ Implementar los endpoints restantes
