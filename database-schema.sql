-- BECK Sistema - Esquema de Base de Datos PostgreSQL
-- Ejecutar en Railway o localmente

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLA: usuarios
-- ===========================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('administrador', 'terreno', 'ingenieria', 'visualizador')),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- ===========================================
-- TABLA: obras
-- ===========================================
CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'activa' CHECK (estado IN ('activa', 'pausada', 'finalizada')),
  creado_por_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_obras_codigo ON obras(codigo);
CREATE INDEX idx_obras_estado ON obras(estado);
CREATE INDEX idx_obras_creado_por ON obras(creado_por_id);

-- ===========================================
-- TABLA: itemizados
-- ===========================================
CREATE TABLE itemizados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_unitario DECIMAL(12, 2) DEFAULT 0,
  creado_por_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_itemizados_codigo ON itemizados(codigo);
CREATE INDEX idx_itemizados_creado_por ON itemizados(creado_por_id);

-- ===========================================
-- TABLA: registros_terreno
-- ===========================================
CREATE TABLE registros_terreno (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  fecha DATE NOT NULL,
  dia_semana VARCHAR(20) NOT NULL,
  descripcion_material VARCHAR(500) NOT NULL,
  modulo VARCHAR(100) NOT NULL,
  piso VARCHAR(50) NOT NULL,
  eje_numerico INTEGER NOT NULL,
  eje_alfabetico VARCHAR(10) NOT NULL,
  numero_sello VARCHAR(100) NOT NULL,
  cantidad_sellos INTEGER NOT NULL CHECK (cantidad_sellos > 0),
  nombre_sellador VARCHAR(255) NOT NULL,
  holgura DECIMAL(3, 1) NOT NULL CHECK (holgura IN (1.0, 1.2, 1.4, 1.8)),
  accesibilidad INTEGER NOT NULL CHECK (accesibilidad IN (1, 2, 3)),
  observaciones TEXT,
  fotos_urls TEXT[], -- Array de URLs de Cloudinary
  procesado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registros_terreno_obra ON registros_terreno(obra_id);
CREATE INDEX idx_registros_terreno_usuario ON registros_terreno(usuario_id);
CREATE INDEX idx_registros_terreno_fecha ON registros_terreno(fecha DESC);
CREATE INDEX idx_registros_terreno_procesado ON registros_terreno(procesado);

-- ===========================================
-- TABLA: procesamiento_ingenieria
-- ===========================================
CREATE TABLE procesamiento_ingenieria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registro_terreno_id UUID UNIQUE NOT NULL REFERENCES registros_terreno(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  codigo VARCHAR(100) NOT NULL,
  itemizado_id UUID NOT NULL REFERENCES itemizados(id) ON DELETE RESTRICT,
  total_sellos_calculado DECIMAL(12, 2) NOT NULL,
  notas TEXT,
  procesado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_procesamiento_registro ON procesamiento_ingenieria(registro_terreno_id);
CREATE INDEX idx_procesamiento_usuario ON procesamiento_ingenieria(usuario_id);
CREATE INDEX idx_procesamiento_itemizado ON procesamiento_ingenieria(itemizado_id);

-- ===========================================
-- TABLA: notificaciones
-- ===========================================
CREATE TABLE notificaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('nuevo_registro', 'registro_procesado', 'alerta_inventario', 'sistema')),
  referencia_id UUID,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leido ON notificaciones(leido);
CREATE INDEX idx_notificaciones_created ON notificaciones(created_at DESC);

-- ===========================================
-- TABLA: inventario
-- ===========================================
CREATE TABLE inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_producto VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  stock_actual INTEGER DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo INTEGER DEFAULT 0 CHECK (stock_minimo >= 0),
  ubicacion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventario_codigo ON inventario(codigo_producto);
CREATE INDEX idx_inventario_stock ON inventario(stock_actual);

-- ===========================================
-- TABLA: movimientos_inventario
-- ===========================================
CREATE TABLE movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID NOT NULL REFERENCES inventario(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  codigo_escaneado VARCHAR(255),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_usuario ON movimientos_inventario(usuario_id);
CREATE INDEX idx_movimientos_created ON movimientos_inventario(created_at DESC);

-- ===========================================
-- TABLA: cotizaciones
-- ===========================================
CREATE TABLE cotizaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero VARCHAR(50) UNIQUE NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  obra_id UUID REFERENCES obras(id) ON DELETE SET NULL,
  items JSONB NOT NULL, -- Array de items [{itemizado_id, cantidad, precio_unitario, subtotal}]
  subtotal DECIMAL(12, 2) NOT NULL,
  descuento DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviada', 'aprobada', 'rechazada')),
  creado_por_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cotizaciones_numero ON cotizaciones(numero);
CREATE INDEX idx_cotizaciones_cliente ON cotizaciones(cliente);
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX idx_cotizaciones_creado_por ON cotizaciones(creado_por_id);

-- ===========================================
-- TRIGGER: Auto-actualizar updated_at
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON obras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itemizados_updated_at BEFORE UPDATE ON itemizados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registros_terreno_updated_at BEFORE UPDATE ON registros_terreno
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventario_updated_at BEFORE UPDATE ON inventario
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cotizaciones_updated_at BEFORE UPDATE ON cotizaciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- TRIGGER: Marcar registro como procesado
-- ===========================================
CREATE OR REPLACE FUNCTION marcar_registro_procesado()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE registros_terreno
  SET procesado = TRUE
  WHERE id = NEW.registro_terreno_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_marcar_procesado AFTER INSERT ON procesamiento_ingenieria
  FOR EACH ROW EXECUTE FUNCTION marcar_registro_procesado();

-- ===========================================
-- DATOS DE PRUEBA (SEEDS)
-- ===========================================

-- Usuarios de prueba (passwords: Admin123!, Terreno123!, Ing123!, View123!)
-- Hash bcrypt con salt rounds = 10
INSERT INTO usuarios (id, nombre, email, password_hash, rol, activo) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Admin Demo', 'admin@beck.com', '$2b$10$q62pqVjc78nqZQkRdXe0Luj5w9sptO9C0sfubXM0BNWwVp/8nBDk2', 'administrador', TRUE),
  ('22222222-2222-2222-2222-222222222222', 'Terreno Demo', 'terreno@beck.com', '$2b$10$eFmKGa4qYhyZWvyXdXtHhOCYorLYaq9gNoRKUpbPJN7i2d1R04Dkm', 'terreno', TRUE),
  ('33333333-3333-3333-3333-333333333333', 'Ingeniero Demo', 'ing@beck.com', '$2b$10$75.JtEeXiRw2oHX4ipXm8ODIFhLnPyQzehvWf94iVIr2ABiku06tO', 'ingenieria', TRUE),
  ('44444444-4444-4444-4444-444444444444', 'Visualizador Demo', 'view@beck.com', '$2b$10$sf.lJtdUrJ2OjSKXTyombO5d79t3lXPC7nwdlxCBL1p5lnvNsNtF6', 'visualizador', TRUE);

-- Obras de prueba
INSERT INTO obras (id, nombre, codigo, descripcion, estado, creado_por_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Edificio Central Tower', 'ECT-2025', 'Edificio corporativo de 15 pisos con certificación LEED', 'activa', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Proyecto Residencial Los Álamos', 'PRLA-2025', 'Conjunto residencial con 4 torres', 'activa', '11111111-1111-1111-1111-111111111111');

-- Itemizados de prueba
INSERT INTO itemizados (id, codigo, nombre, descripcion, precio_unitario, creado_por_id) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'SELLO-CF-01', 'Sello cortafuego estándar 100mm', 'Sello cortafuego para ductos hasta 100mm', 15000, '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'SELLO-CF-02', 'Sello cortafuego reforzado 200mm', 'Sello cortafuego para ductos 100-200mm', 28000, '11111111-1111-1111-1111-111111111111'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'JUNTA-ESP-01', 'Junta lineal con espuma intumescente', 'Sistema de junta perimetral expandible', 45000, '11111111-1111-1111-1111-111111111111');

-- Comentario sobre passwords:
-- NOTA: En producción, los usuarios deben cambiar sus contraseñas.
-- Hash real se debe generar con: bcrypt.hash('password', 10)
-- Por ahora estos son hashes de ejemplo que deben reemplazarse al crear usuarios reales.

COMMENT ON TABLE usuarios IS 'Usuarios del sistema con 4 roles: administrador, terreno, ingenieria, visualizador';
COMMENT ON TABLE obras IS 'Obras/proyectos de construcción';
COMMENT ON TABLE itemizados IS 'Catálogo de items para cotizaciones y registros';
COMMENT ON TABLE registros_terreno IS 'Registros de sellado creados por personal de terreno (11 campos + fotos)';
COMMENT ON TABLE procesamiento_ingenieria IS 'Procesamiento complementario realizado por ingeniería (código + itemizado + cálculo)';
COMMENT ON TABLE notificaciones IS 'Sistema de notificaciones en tiempo real para usuarios';
COMMENT ON TABLE inventario IS 'Control de stock de productos/materiales';
COMMENT ON TABLE movimientos_inventario IS 'Historial de ingresos y egresos de inventario';
COMMENT ON TABLE cotizaciones IS 'Cotizaciones generadas para clientes';
