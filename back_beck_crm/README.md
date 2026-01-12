# BECK Backend - Sistema de Gestión de Sellado

Backend API REST para el sistema BECK de gestión de sellado en obras de construcción.

## 📋 Tecnologías

- **Node.js** + **Express** - Servidor web
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos (Railway)
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Cloudinary** - Almacenamiento de fotos
- **Multer** - Upload de archivos
- **Nodemailer** - Envío de emails

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y completa las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos PostgreSQL (Railway)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/[DATABASE]

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_o_app_password
EMAIL_FROM="BECK Sistema <noreply@beck.cl>"

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar base de datos en Railway

1. Ve a [Railway](https://railway.app) y crea un nuevo proyecto PostgreSQL
2. Copia la `DATABASE_URL` que te proporciona Railway
3. Pégala en tu archivo `.env`

### 4. Ejecutar el esquema SQL

Conecta a tu base de datos PostgreSQL y ejecuta el archivo `database-schema.sql`:

```bash
# Opción 1: Desde Railway CLI
railway run psql < database-schema.sql

# Opción 2: Desde PostgreSQL local/cliente
psql -h [HOST] -U [USER] -d [DATABASE] -f database-schema.sql
```

Este script creará:
- ✅ Todas las tablas (usuarios, obras, registros_terreno, etc.)
- ✅ Índices para optimizar consultas
- ✅ Triggers automáticos (actualizar updated_at, marcar como procesado)
- ✅ Usuarios de prueba con roles

### 5. Usuarios de prueba

Una vez ejecutado el esquema SQL, tendrás estos usuarios disponibles:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@beck.com` | `Admin123!` | Administrador |
| `terreno@beck.com` | `Terreno123!` | Terreno |
| `ing@beck.com` | `Ing123!` | Ingeniería |
| `view@beck.com` | `View123!` | Visualizador |

**NOTA:** Los hashes de contraseña en el SQL son de ejemplo. Deberás crear usuarios reales con contraseñas reales usando el endpoint POST `/api/usuarios`.

## 🔧 Desarrollo

### Modo desarrollo (con hot reload)

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5000`

### Compilar TypeScript

```bash
npm run build
```

### Modo producción

```bash
npm start
```

## 📁 Estructura del Proyecto

```
back/
├── src/
│   ├── config/           # Configuraciones (DB, Cloudinary)
│   ├── controllers/      # Controladores de rutas
│   ├── middlewares/      # Middlewares (auth, upload, etc.)
│   ├── models/           # Modelos y queries de BD
│   ├── routes/           # Definición de rutas
│   ├── services/         # Lógica de negocio
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilidades y helpers
│   ├── app.ts            # Configuración de Express
│   └── server.ts         # Punto de entrada
├── database-schema.sql   # Esquema completo de BD
├── .env.example          # Variables de entorno de ejemplo
├── tsconfig.json         # Configuración de TypeScript
└── package.json
```

## 🔐 API Endpoints

### Autenticación

- **POST** `/api/auth/login` - Login de usuario
- **GET** `/api/auth/me` - Obtener usuario autenticado (requiere token)
- **PUT** `/api/auth/change-password` - Cambiar contraseña (requiere token)

### Usuarios (próximamente)

- **GET** `/api/usuarios` - Listar usuarios (admin)
- **POST** `/api/usuarios` - Crear usuario (admin)
- **PUT** `/api/usuarios/:id` - Actualizar usuario (admin)
- **DELETE** `/api/usuarios/:id` - Eliminar usuario (admin)

### Obras (próximamente)

- **GET** `/api/obras` - Listar obras
- **POST** `/api/obras` - Crear obra (admin)
- **PUT** `/api/obras/:id` - Actualizar obra (admin)
- **DELETE** `/api/obras/:id` - Eliminar obra (admin)

### Registros Terreno (próximamente)

- **GET** `/api/registros-terreno` - Listar registros
- **POST** `/api/registros-terreno` - Crear registro con fotos (terreno)
- **GET** `/api/registros-terreno/:id` - Ver detalle de registro

### Procesamiento Ingeniería (próximamente)

- **GET** `/api/procesamiento/pendientes` - Registros pendientes (ingeniería)
- **POST** `/api/procesamiento` - Procesar registro (ingeniería)

## 🧪 Testing

```bash
npm test
```

## 📝 Notas Importantes

### Seguridad

- Todos los endpoints (excepto login) requieren token JWT
- Los tokens expiran en 7 días por defecto
- Las contraseñas se hashean con bcrypt (10 salt rounds)
- Las fotos se suben a Cloudinary con transformaciones automáticas
- Límite de 5MB por foto, máximo 5 fotos por registro

### Roles y Permisos

- **Administrador**: Acceso completo, CRUD de usuarios/obras/itemizados
- **Terreno**: Solo puede crear registros y subir fotos
- **Ingeniería**: Ver registros pendientes y procesarlos
- **Visualizador**: Solo lectura de información procesada

### Fórmula de Cálculo Automático

Cuando Ingeniería procesa un registro:

```
Total Sellos = cantidad_sellos × holgura × accesibilidad
```

Este cálculo se hace automáticamente en el backend.

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

- Verifica que tu `DATABASE_URL` en `.env` sea correcta
- Asegúrate de que Railway esté activo y accesible
- Verifica que tu IP esté permitida en Railway (si aplica)

### Error: "JWT_SECRET not configured"

- Asegúrate de tener `JWT_SECRET` en tu archivo `.env`
- Reinicia el servidor después de agregar variables de entorno

### Error: "Cloudinary configuration error"

- Verifica tus credenciales de Cloudinary en `.env`
- Asegúrate de tener una cuenta activa en Cloudinary

## 📧 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.
