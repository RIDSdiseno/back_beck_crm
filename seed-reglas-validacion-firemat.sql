-- Script manual equivalente a la migracion:
-- prisma/migrations/20260626000000_seed_reglas_validacion_firemat/migration.sql
-- Usar solo si no se aplicara Prisma Migrate. Es idempotente.

INSERT INTO "configuracion_validacion" ("modulo", "etapa", "regla", "campo", "etiqueta", "nivel", "activo")
VALUES
  -- PROSPECTO
  ('FIREMAT', 'PROSPECTO', 'CLIENTE_REQUERIDO', 'cliente', 'El cliente es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PROSPECTO', 'RUT_EMPRESA_REQUERIDO', 'rutEmpresa', 'El RUT de la empresa es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PROSPECTO', 'NOMBRE_OPORTUNIDAD_REQUERIDO', 'nombreOportunidad', 'El nombre de la oportunidad es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PROSPECTO', 'CONTACTO_REQUERIDO', 'contacto', 'Registra un contacto del cliente antes de avanzar.', 'ADVERTENCIA', true),
  ('FIREMAT', 'PROSPECTO', 'TELEFONO_CORREO_REQUERIDO', 'telefonoCorreo', 'Registra un telefono o correo de contacto antes de avanzar.', 'ADVERTENCIA', true),
  ('FIREMAT', 'PROSPECTO', 'RESPONSABLE_REQUERIDO', 'responsable', 'Asigna un responsable antes de avanzar.', 'ADVERTENCIA', true),
  ('FIREMAT', 'PROSPECTO', 'UNIDAD_NEGOCIO_REQUERIDA', 'unidadNegocio', 'Selecciona la unidad de negocio antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PROSPECTO', 'PROXIMA_ACCION_REQUERIDA', 'proximaAccion', 'Define la proxima accion antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PROSPECTO', 'FECHA_PROXIMA_ACCION_REQUERIDA', 'fechaProximaAccion', 'Define la fecha de la proxima accion antes de avanzar.', 'BLOQUEANTE', true),

  -- PRIMER_CONTACTO
  ('FIREMAT', 'PRIMER_CONTACTO', 'CLIENTE_REQUERIDO', 'cliente', 'El cliente es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PRIMER_CONTACTO', 'RUT_EMPRESA_REQUERIDO', 'rutEmpresa', 'El RUT de la empresa es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PRIMER_CONTACTO', 'NOMBRE_OPORTUNIDAD_REQUERIDO', 'nombreOportunidad', 'El nombre de la oportunidad es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PRIMER_CONTACTO', 'CONTACTO_REQUERIDO', 'contacto', 'Registra un contacto del cliente antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PRIMER_CONTACTO', 'TELEFONO_CORREO_REQUERIDO', 'telefonoCorreo', 'Registra un telefono o correo de contacto antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PRIMER_CONTACTO', 'RESPONSABLE_REQUERIDO', 'responsable', 'El responsable es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PRIMER_CONTACTO', 'UNIDAD_NEGOCIO_REQUERIDA', 'unidadNegocio', 'Selecciona la unidad de negocio antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PRIMER_CONTACTO', 'PROXIMA_ACCION_REQUERIDA', 'proximaAccion', 'Define la proxima accion antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PRIMER_CONTACTO', 'FECHA_PROXIMA_ACCION_REQUERIDA', 'fechaProximaAccion', 'Define la fecha de la proxima accion antes de avanzar.', 'BLOQUEANTE', true),

  -- DESARROLLO_COTIZACION
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'CLIENTE_REQUERIDO', 'cliente', 'El cliente es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'RUT_EMPRESA_REQUERIDO', 'rutEmpresa', 'El RUT de la empresa es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'NOMBRE_OPORTUNIDAD_REQUERIDO', 'nombreOportunidad', 'El nombre de la oportunidad es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'CONTACTO_REQUERIDO', 'contacto', 'Registra un contacto del cliente antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'TELEFONO_CORREO_REQUERIDO', 'telefonoCorreo', 'Registra un telefono o correo de contacto antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'RESPONSABLE_REQUERIDO', 'responsable', 'El responsable es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'UNIDAD_NEGOCIO_REQUERIDA', 'unidadNegocio', 'Selecciona la unidad de negocio antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'PROXIMA_ACCION_REQUERIDA', 'proximaAccion', 'Define la proxima accion antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'FECHA_PROXIMA_ACCION_REQUERIDA', 'fechaProximaAccion', 'Define la fecha de la proxima accion antes de avanzar.', 'BLOQUEANTE', true),

  -- COTIZACION_ENVIADA
  ('FIREMAT', 'COTIZACION_ENVIADA', 'CLIENTE_REQUERIDO', 'cliente', 'El cliente es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'RUT_EMPRESA_REQUERIDO', 'rutEmpresa', 'El RUT de la empresa es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'NOMBRE_OPORTUNIDAD_REQUERIDO', 'nombreOportunidad', 'El nombre de la oportunidad es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'CONTACTO_REQUERIDO', 'contacto', 'Registra un contacto del cliente antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'TELEFONO_CORREO_REQUERIDO', 'telefonoCorreo', 'Registra un telefono o correo de contacto antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'RESPONSABLE_REQUERIDO', 'responsable', 'El responsable es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'UNIDAD_NEGOCIO_REQUERIDA', 'unidadNegocio', 'Selecciona la unidad de negocio antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'PROXIMA_ACCION_REQUERIDA', 'proximaAccion', 'Define la proxima accion antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'FECHA_PROXIMA_ACCION_REQUERIDA', 'fechaProximaAccion', 'Define la fecha de la proxima accion antes de avanzar.', 'BLOQUEANTE', true),

  -- ORDEN_CONFIRMADA
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'CLIENTE_REQUERIDO', 'cliente', 'El cliente es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'RUT_EMPRESA_REQUERIDO', 'rutEmpresa', 'El RUT de la empresa es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'NOMBRE_OPORTUNIDAD_REQUERIDO', 'nombreOportunidad', 'El nombre de la oportunidad es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'CONTACTO_REQUERIDO', 'contacto', 'Registra un contacto del cliente antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'TELEFONO_CORREO_REQUERIDO', 'telefonoCorreo', 'Registra un telefono o correo de contacto antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'RESPONSABLE_REQUERIDO', 'responsable', 'El responsable es obligatorio para avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'UNIDAD_NEGOCIO_REQUERIDA', 'unidadNegocio', 'Selecciona la unidad de negocio antes de avanzar.', 'BLOQUEANTE', true),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'PROXIMA_ACCION_REQUERIDA', 'proximaAccion', 'Define la proxima accion antes de avanzar.', 'ADVERTENCIA', true),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'FECHA_PROXIMA_ACCION_REQUERIDA', 'fechaProximaAccion', 'Define la fecha de la proxima accion antes de avanzar.', 'ADVERTENCIA', true),

  -- Etapas destino de cierre
  ('FIREMAT', 'GANADA', 'GANADA_DOCUMENTO_RESPALDO', 'documentoRespaldo', 'El documento de respaldo es obligatorio para marcar como Ganada.', 'BLOQUEANTE', true),
  ('FIREMAT', 'GANADA', 'GANADA_FLUJO_POSTERIOR_REQUERIDO', 'flujoPosterior', 'Define el flujo posterior antes de marcar como Ganada.', 'BLOQUEANTE', true),
  ('FIREMAT', 'PERDIDA', 'PERDIDA_MOTIVO_REQUERIDO', 'motivoPerdida', 'Indica el motivo de perdida antes de cerrar la oportunidad.', 'BLOQUEANTE', true),
  ('FIREMAT', 'POSTERGADA', 'POSTERGADA_MOTIVO_REQUERIDO', 'motivoPostergacion', 'Indica el motivo de postergacion.', 'BLOQUEANTE', true),
  ('FIREMAT', 'POSTERGADA', 'POSTERGADA_FECHA_REACTIVACION_REQUERIDA', 'fechaReactivacion', 'Define la fecha de reactivacion antes de marcar como Postergada.', 'BLOQUEANTE', true),
  ('FIREMAT', 'DESCARTADO', 'DESCARTADA_MOTIVO_REQUERIDO', 'motivoDescarte', 'Indica el motivo de descarte antes de cerrar la oportunidad.', 'BLOQUEANTE', true)
ON CONFLICT ("modulo", "regla", "etapa") DO UPDATE SET
  "campo" = EXCLUDED."campo",
  "etiqueta" = EXCLUDED."etiqueta",
  "nivel" = EXCLUDED."nivel",
  "activo" = EXCLUDED."activo";

SELECT modulo, etapa, regla, nivel, activo
FROM "configuracion_validacion"
WHERE modulo = 'FIREMAT'
ORDER BY etapa, regla;

-- Reglas avanzadas por etapa destino.
-- Este bloque replica prisma/migrations/20260626001000_seed_reglas_validacion_firemat_etapas_avanzadas/migration.sql.

INSERT INTO "configuracion_validacion" ("modulo", "etapa", "regla", "campo", "etiqueta", "nivel", "activo", "created_at", "updated_at")
VALUES
  ('FIREMAT', 'PRIMER_CONTACTO', 'URGENCIA_REQUERIDA', 'urgencia', 'Selecciona la urgencia antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'PRIMER_CONTACTO', 'TIPO_USO_REQUERIDO', 'tipoUso', 'Selecciona el tipo de uso antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'PRIMER_CONTACTO', 'SOPORTE_TECNICO_REQUERIDO', 'necesidadSoporteTecnico', 'Indica si requiere soporte tecnico antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'URGENCIA_REQUERIDA', 'urgencia', 'Selecciona la urgencia antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'TIPO_USO_REQUERIDO', 'tipoUso', 'Selecciona el tipo de uso antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'SOPORTE_TECNICO_REQUERIDO', 'necesidadSoporteTecnico', 'Indica si requiere soporte tecnico antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'LINEA_PRODUCTO_REQUERIDA', 'lineaProducto', 'Indica la linea de producto antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'PRODUCTO_REQUERIDO', 'productoId', 'Selecciona un producto antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'CANTIDAD_ESTIMADA_REQUERIDA', 'cantidadEstimada', 'Indica una cantidad estimada mayor a cero antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'DESARROLLO_COTIZACION', 'MONTO_ESTIMADO_REQUERIDO', 'montoEstimado', 'Indica un monto estimado mayor a cero antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'LINEA_PRODUCTO_REQUERIDA', 'lineaProducto', 'Indica la linea de producto antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'PRODUCTO_REQUERIDO', 'productoId', 'Selecciona un producto antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'CANTIDAD_ESTIMADA_REQUERIDA', 'cantidadEstimada', 'Indica una cantidad estimada mayor a cero antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'MONTO_ESTIMADO_REQUERIDO', 'montoEstimado', 'Indica un monto estimado mayor a cero antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'ALTERNATIVA_PRODUCTO_REQUERIDA', 'alternativaProducto', 'Indica la alternativa de producto antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'COMISION_REQUERIDA', 'comision', 'Indica la comision antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'MARGEN_ESTIMADO_REQUERIDO', 'margenEstimado', 'Indica el margen estimado antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'FECHA_COMPROMETIDA_ENVIO_REQUERIDA', 'fechaComprometidaEnvio', 'Indica la fecha comprometida de envio antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'VERSION_COTIZACION_REQUERIDA', 'versionCotizacion', 'Indica la version de cotizacion antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'COMENTARIOS_CLIENTE_REQUERIDO', 'comentariosCliente', 'Registra comentarios del cliente antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'OBJECIONES_REQUERIDAS', 'objeciones', 'Registra las objeciones antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'COTIZACION_ENVIADA', 'COTIZACION_VINCULADA_REQUERIDA', 'cotizacionId', 'Vincula una cotizacion antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'LINEA_PRODUCTO_REQUERIDA', 'lineaProducto', 'Indica la linea de producto antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'PRODUCTO_REQUERIDO', 'productoId', 'Selecciona un producto antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'CANTIDAD_ESTIMADA_REQUERIDA', 'cantidadEstimada', 'Indica una cantidad estimada mayor a cero antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'MONTO_ESTIMADO_REQUERIDO', 'montoEstimado', 'Indica un monto estimado mayor a cero antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'ALTERNATIVA_PRODUCTO_REQUERIDA', 'alternativaProducto', 'Indica la alternativa de producto antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'COMISION_REQUERIDA', 'comision', 'Indica la comision antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'MARGEN_ESTIMADO_REQUERIDO', 'margenEstimado', 'Indica el margen estimado antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'FECHA_COMPROMETIDA_ENVIO_REQUERIDA', 'fechaComprometidaEnvio', 'Indica la fecha comprometida de envio antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'VERSION_COTIZACION_REQUERIDA', 'versionCotizacion', 'Indica la version de cotizacion antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'COMENTARIOS_CLIENTE_REQUERIDO', 'comentariosCliente', 'Registra comentarios del cliente antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'OBJECIONES_REQUERIDAS', 'objeciones', 'Registra las objeciones antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'COTIZACION_VINCULADA_REQUERIDA', 'cotizacionId', 'Vincula una cotizacion antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'ORDEN_COMPRA_REQUERIDA', 'ordenCompra', 'Registra la orden de compra antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'CORREO_ACEPTACION_REQUERIDO', 'correoAceptacion', 'Registra el correo de aceptacion antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'ESTADO_DOCUMENTACION_REQUERIDO', 'estadoDocumentacion', 'Selecciona el estado de documentacion antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'ESTADO_COMERCIAL_ORDEN_REQUERIDO', 'estadoComercialOrden', 'Indica el estado comercial de la orden antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'ESTADO_DOCUMENTACION_VENTA_REQUERIDO', 'estadoDocumentacionVenta', 'Indica el estado de documentacion de venta antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'CONDICIONES_COMERCIALES_REQUERIDAS', 'condicionesComerciales', 'Registra las condiciones comerciales antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'COORDINACION_ADMINISTRATIVA_REQUERIDA', 'coordinacionAdministrativa', 'Registra la coordinacion administrativa antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'COORDINACION_DESPACHO_REQUERIDA', 'coordinacionDespacho', 'Registra la coordinacion de despacho antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'TRASPASO_ADMINISTRACION_REQUERIDO', 'traspasoAdministracion', 'Indica si hubo traspaso a administracion antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'TRASPASO_ERP_REQUERIDO', 'traspasoERP', 'Indica si hubo traspaso a ERP antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'TIPO_BROKER_REQUERIDO', 'tipoBroker', 'Selecciona el tipo broker antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'FECHA_ESTIMADA_DESPACHO_REQUERIDA', 'fechaEstimadaDespacho', 'Indica la fecha estimada de despacho antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'ORDEN_CONFIRMADA', 'FECHA_SEGUIMIENTO_POSTVENTA_REQUERIDA', 'fechaSeguimientoPostventa', 'Indica la fecha de seguimiento postventa antes de avanzar.', 'BLOQUEANTE', true, now(), now()),
  ('FIREMAT', 'GANADA', 'MONTO_ESTIMADO_REQUERIDO', 'montoEstimado', 'Indica un monto final mayor a cero antes de marcar como Ganada.', 'BLOQUEANTE', true, now(), now())
ON CONFLICT ("modulo", "regla", "etapa") DO UPDATE SET
  "campo" = EXCLUDED."campo",
  "etiqueta" = EXCLUDED."etiqueta",
  "nivel" = EXCLUDED."nivel",
  "activo" = EXCLUDED."activo",
  "updated_at" = now();
