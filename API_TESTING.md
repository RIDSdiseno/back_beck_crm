# 🧪 Guía de Pruebas del API BECK

## 📋 Prerequisitos

1. **Railway configurado** con PostgreSQL
2. **Cloudinary configurado** (opcional para registros de terreno)
3. **Archivo .env** configurado correctamente
4. **Base de datos** con esquema ejecutado (`database-schema.sql`)

## 🚀 Iniciar el Servidor

```bash
cd back
npm run dev
```

Deberías ver:
```
✅ Conexión a PostgreSQL establecida
🚀 Servidor BECK corriendo en puerto 5000
```
## 🔐 Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| `admin@beck.com` | `Admin123!` | Administrador |
| `terreno@beck.com` | `Terreno123!` | Terreno |
| `ing@becksoluciones.cl` | `123456` | Ingeniería |
| `view@beck.com` | `View123!` | Visualizador |
| `vendedor@becksoluciones.cl` | `Ven123!` | Vendedor |


---

## 📡 Endpoints Disponibles

### 1️⃣ AUTENTICACIÓN

#### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@beck.com",
  "password": "Admin123!"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "11111111-1111-1111-1111-111111111111",
    "nombre": "Admin Demo",
    "email": "admin@beck.com",
    "rol": "administrador"
  }
}
```

#### Obtener Usuario Actual
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer {tu_token}
```

#### Cambiar Contraseña
```http
PUT http://localhost:5000/api/auth/change-password
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "currentPassword": "Admin123!",
  "newPassword": "NuevaPassword123!"
}
```

#### Login Microsoft Web Flow
```http
GET http://localhost:5000/api/auth/microsoft/login
```

Este endpoint redirige al usuario a Microsoft. Despues del login, Microsoft vuelve a:

```http
GET http://localhost:5000/api/auth/microsoft/callback
```

El backend canjea el `code`, genera el JWT propio y redirige al frontend a:

```text
{FRONTEND_URL}{FRONTEND_AUTH_CALLBACK_PATH}#token={jwt}
```

Si el flujo falla, el backend redirige al mismo callback del frontend con:

```text
#error={mensaje}
```

---

### 2️⃣ OBRAS

#### Listar Todas las Obras
```http
GET http://localhost:5000/api/obras
Authorization: Bearer {tu_token}
```

#### Listar Solo Obras Activas
```http
GET http://localhost:5000/api/obras?activa=true
Authorization: Bearer {tu_token}
```

#### Obtener una Obra Específica
```http
GET http://localhost:5000/api/obras/{obra_id}
Authorization: Bearer {tu_token}
```

#### Crear Obra (Solo Admin)
```http
POST http://localhost:5000/api/obras
Authorization: Bearer {tu_token_admin}
Content-Type: application/json

{
  "codigo": "OBRA-2025-003",
  "nombre": "Torre Costanera",
  "direccion": "Av. Libertador 1234",
  "ciudad": "Santiago",
  "cliente": "Constructora ABC",
  "activa": true,
  "fecha_inicio": "2025-01-15",
  "fecha_termino": "2025-12-31"
}
```

#### Actualizar Obra (Solo Admin)
```http
PUT http://localhost:5000/api/obras/{obra_id}
Authorization: Bearer {tu_token_admin}
Content-Type: application/json

{
  "activa": false
}
```

#### Eliminar Obra (Solo Admin)
```http
DELETE http://localhost:5000/api/obras/{obra_id}
Authorization: Bearer {tu_token_admin}
```

---

### 3️⃣ ITEMIZADOS

#### Listar Todos los Itemizados
```http
GET http://localhost:5000/api/itemizados
Authorization: Bearer {tu_token}
```

#### Listar Solo Itemizados Activos
```http
GET http://localhost:5000/api/itemizados?activo=true
Authorization: Bearer {tu_token}
```

#### Filtrar por Categoría
```http
GET http://localhost:5000/api/itemizados?categoria=Sello%20Cortafuego
Authorization: Bearer {tu_token}
```

#### Crear Itemizado (Solo Admin)
```http
POST http://localhost:5000/api/itemizados
Authorization: Bearer {tu_token_admin}
Content-Type: application/json

{
  "codigo": "SELLO-CF-03",
  "descripcion": "Sello cortafuego reforzado 300mm",
  "unidad_medida": "unidad",
  "precio_unitario": 45000,
  "categoria": "Sello Cortafuego",
  "activo": true
}
```

---

### 4️⃣ REGISTROS DE TERRENO

#### Crear Registro con Fotos (Terreno o Admin)
```http
POST http://localhost:5000/api/registros-terreno
Authorization: Bearer {tu_token_terreno}
Content-Type: multipart/form-data

fotos: [file1.jpg, file2.jpg]
obra_id: "obra-uuid-aqui"
descripcion_material: "Ducto eléctrico principal"
modulo: "Módulo A"
piso: "Piso 5"
eje_numerico: 3
eje_alfabetico: "B"
numero_sello: "SEL-2025-0050"
cantidad_sellos: 10
nombre_sellador: "Juan Pérez"
holgura: 1.2
accesibilidad: 2
observaciones: "Pasada por placa de hormigón"
```

**Notas importantes:**
- Mínimo 1 foto, máximo 5
- Las fotos se suben automáticamente a Cloudinary
- El sistema calcula automáticamente el día de la semana
- Se crean notificaciones para usuarios de Ingeniería

#### Listar Registros
```http
GET http://localhost:5000/api/registros-terreno
Authorization: Bearer {tu_token}
```

#### Filtrar Registros No Procesados
```http
GET http://localhost:5000/api/registros-terreno?procesado=false
Authorization: Bearer {tu_token}
```

#### Filtrar por Obra
```http
GET http://localhost:5000/api/registros-terreno?obra_id={obra_uuid}
Authorization: Bearer {tu_token}
```

#### Listar Pendientes (para Ingeniería)
```http
GET http://localhost:5000/api/registros-terreno/pendientes
Authorization: Bearer {tu_token_ingenieria}
```

#### Obtener Registro Específico
```http
GET http://localhost:5000/api/registros-terreno/{registro_id}
Authorization: Bearer {tu_token}
```

---

### 5️⃣ PROCESAMIENTO INGENIERÍA

#### Procesar un Registro (Ingeniería o Admin)
```http
POST http://localhost:5000/api/procesamiento
Authorization: Bearer {tu_token_ingenieria}
Content-Type: application/json

{
  "registro_terreno_id": "registro-uuid-aqui",
  "codigo": "PROC-2025-001",
  "itemizado_id": "itemizado-uuid-aqui",
  "notas": "Registro procesado correctamente"
}
```

**Cálculo Automático:**
El sistema calcula automáticamente:
```
total_sellos_calculado = cantidad_sellos × holgura × accesibilidad
```

Por ejemplo:
- cantidad_sellos: 10
- holgura: 1.2
- accesibilidad: 2
- **Total: 24 sellos**

**Automatización:**
- El trigger marca automáticamente el registro como `procesado = true`
- Se crea una notificación para el usuario que creó el registro

#### Listar Procesamientos
```http
GET http://localhost:5000/api/procesamiento
Authorization: Bearer {tu_token}
```

#### Filtrar por Registro de Terreno
```http
GET http://localhost:5000/api/procesamiento?registro_terreno_id={registro_uuid}
Authorization: Bearer {tu_token}
```

#### Obtener Procesamiento Específico
```http
GET http://localhost:5000/api/procesamiento/{procesamiento_id}
Authorization: Bearer {tu_token}
```

---

### 6️⃣ NOTIFICACIONES

#### Listar Mis Notificaciones
```http
GET http://localhost:5000/api/notificaciones
Authorization: Bearer {tu_token}
```

#### Listar Solo No Leídas
```http
GET http://localhost:5000/api/notificaciones?leido=false
Authorization: Bearer {tu_token}
```

#### Contar No Leídas
```http
GET http://localhost:5000/api/notificaciones/no-leidas
Authorization: Bearer {tu_token}
```

**Respuesta:**
```json
{
  "count": 3
}
```

#### Marcar una Notificación como Leída
```http
PUT http://localhost:5000/api/notificaciones/{notificacion_id}/leer
Authorization: Bearer {tu_token}
```

#### Marcar Todas como Leídas
```http
PUT http://localhost:5000/api/notificaciones/leer-todas
Authorization: Bearer {tu_token}
```

---

## 🔄 Flujo Completo de Trabajo

### Paso 1: Login (Terreno)
```http
POST /api/auth/login
{
  "email": "terreno@beck.com",
  "password": "Terreno123!"
}
```
➡️ Guarda el `token` recibido

### Paso 2: Listar Obras Activas
```http
GET /api/obras?activa=true
Authorization: Bearer {token}
```
➡️ Obtén el `obra_id`

### Paso 3: Crear Registro con Fotos
```http
POST /api/registros-terreno
Authorization: Bearer {token}
Content-Type: multipart/form-data

[Incluir datos del formulario + fotos]
```
➡️ El sistema:
- Sube fotos a Cloudinary
- Calcula día de semana
- Crea notificaciones para Ingeniería

### Paso 4: Login (Ingeniería)
```http
POST /api/auth/login
{
  "email": "ing@beck.com",
  "password": "Ing123!"
}
```

### Paso 5: Ver Notificaciones
```http
GET /api/notificaciones?leido=false
Authorization: Bearer {token_ingenieria}
```

### Paso 6: Ver Registros Pendientes
```http
GET /api/registros-terreno/pendientes
Authorization: Bearer {token_ingenieria}
```

### Paso 7: Listar Itemizados
```http
GET /api/itemizados?activo=true
Authorization: Bearer {token_ingenieria}
```
➡️ Obtén el `itemizado_id`

### Paso 8: Procesar Registro
```http
POST /api/procesamiento
Authorization: Bearer {token_ingenieria}
{
  "registro_terreno_id": "{registro_id}",
  "codigo": "PROC-2025-001",
  "itemizado_id": "{itemizado_id}",
  "notas": "Procesado"
}
```
➡️ El sistema:
- Calcula `total_sellos_calculado` automáticamente
- Marca el registro como procesado
- Crea notificación para el usuario de Terreno

---

## 🧰 Herramientas Recomendadas

### Postman
1. Descarga: [postman.com](https://www.postman.com/)
2. Importa la colección (crear archivo JSON con los endpoints)
3. Configura variable de entorno `{{base_url}}` = `http://localhost:5000/api`
4. Configura variable `{{token}}` después del login

### Thunder Client (VS Code Extension)
1. Instala la extensión en VS Code
2. Crea una nueva request
3. Agrega el endpoint y el token en Headers

### cURL (Terminal)
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@beck.com", "password": "Admin123!"}'

# Obtener obras (guarda el token del login anterior)
curl -X GET http://localhost:5000/api/obras \
  -H "Authorization: Bearer {tu_token}"
```

---

## 🐛 Troubleshooting

### Error: "Token inválido o expirado"
- Verifica que el token esté en el header `Authorization: Bearer {token}`
- El token expira en 7 días, haz login nuevamente

### Error: "No tienes permisos"
- Verifica que el usuario tenga el rol correcto para el endpoint
- Ejemplo: solo Admin puede crear obras

### Error: "Obra no encontrada"
- Verifica que el `obra_id` exista en la base de datos
- Usa `GET /api/obras` para listar las obras disponibles

### Error: "Debe subir al menos 1 foto"
- Verifica que estés enviando archivos en el campo `fotos`
- Usa `Content-Type: multipart/form-data`

### Error: "Cloudinary configuration error"
- Verifica las credenciales de Cloudinary en `.env`
- Asegúrate de tener cuenta activa en cloudinary.com

---

## 📊 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| `200` | OK - Petición exitosa |
| `201` | Created - Recurso creado exitosamente |
| `400` | Bad Request - Error en los datos enviados |
| `401` | Unauthorized - Token inválido o faltante |
| `403` | Forbidden - Sin permisos para esta acción |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## ✅ Checklist de Verificación

- [ ] Servidor corriendo en puerto 5000
- [ ] Base de datos PostgreSQL conectada
- [ ] Esquema SQL ejecutado correctamente
- [ ] 4 usuarios de prueba creados
- [ ] Login funcionando y retornando token
- [ ] Endpoints de obras funcionando
- [ ] Endpoints de itemizados funcionando
- [ ] Endpoints de registros de terreno funcionando
- [ ] Cloudinary configurado (si vas a probar fotos)
- [ ] Endpoints de procesamiento funcionando
- [ ] Sistema de notificaciones funcionando

---

**¡Listo para probar! 🚀**
