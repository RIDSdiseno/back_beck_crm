# Clientes completos de Trager

La migración `20261014000000_clientes_completos.sql` agrega los campos comerciales y la tabla de contactos. Conserva IDs, datos originales y columnas de contacto anteriores. No copia clientes de Firemat.

## Verificación y aplicación

Desde la raíz del backend:

```sh
npx tsx --test src/services/trager/clientes-trager.test.ts
node scripts/migrate-trager-clientes.cjs
node scripts/migrate-trager-clientes.cjs --apply
npx prisma generate --config=prisma.trager.config.ts
```

El script utiliza exclusivamente `TRAGGER_DATABASE_URL`. La aplicación se realiza en una transacción con bloqueo acotado; compara los datos originales antes y después y revierte si detecta diferencias. Se puede repetir sin duplicar contactos. Aplicar antes de desplegar el backend y frontend nuevos.

## Comportamiento

- Nuevo cliente: los mismos 12 campos de Firemat; Nombre obligatorio. Trager conserva su validación de RUT y dígito verificador.
- Plantilla: 11 columnas, sin Estado. La importación crea clientes activos, exige RUT y Nombre y omite duplicados sin actualizar datos existentes.
- Importación: XLSX/CSV, hasta 5.000 filas; resultado con creados, duplicados y errores por fila. Una fila inválida no revierte las filas válidas.
- Contactos: separados de la empresa; solo un principal activo por cliente. El contrato de `contactoNombre`, `contactoTelefono` y `contactoCorreo` se conserva para Funnel y Cotizaciones.
- Permisos: lectura con los permisos existentes; altas, edición, importación y contactos requieren `trager_clientes:editar`.
- El historial de oportunidades de Firemat no se consulta desde Trager ni se enlaza por coincidencias de nombre.

Las pruebas de migración utilizan PostgreSQL en memoria (PGlite), sin insertar clientes de prueba en la base compartida.
