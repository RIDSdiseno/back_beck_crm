-- Seed reglas de validacion para el modulo FIREMAT.
-- La tabla real es configuracion_validacion y la llave unica Prisma es
-- (modulo, regla, etapa). Este seed es idempotente y corrige filas FIREMAT
-- existentes para las mismas keys sin duplicarlas.

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
