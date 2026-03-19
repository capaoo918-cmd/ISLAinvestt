-- ===================================================================
-- Esquema de Base de Datos Anti-Estafas: IslaInvest
-- ===================================================================

CREATE TABLE usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) CHECK (rol IN ('inversor', 'creador', 'admin')),
    
    -- Módulo KYC / AML y Seguridad de Acceso
    estado_kyc VARCHAR(50) DEFAULT 'pendiente' CHECK (estado_kyc IN ('pendiente', 'en_revision', 'aprobado', 'rechazado')),
    proveedor_kyc_id VARCHAR(150), -- ID que devuelve Sumsub, Jumio, etc.
    dos_factores_activo BOOLEAN DEFAULT FALSE,
    ultima_ip_acceso VARCHAR(45),  -- Para detectar inicios de sesión inusuales
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proyectos (
    id_proyecto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_creador UUID REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    titulo VARCHAR(200) NOT NULL,
    meta_financiera DECIMAL(15, 2) NOT NULL,
    
    -- Control de Riesgos y Escrow
    estado_proyecto VARCHAR(50) DEFAULT 'en_auditoria' CHECK (estado_proyecto IN ('en_auditoria', 'activo', 'financiado', 'congelado_por_fraude', 'cancelado')),
    cuenta_escrow_id VARCHAR(150), -- ID de la cuenta neutral (ej. Stripe Connect)
    contrato_marco_id VARCHAR(150), -- ID del documento legal base
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inversiones (
    id_inversion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_inversor UUID REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    id_proyecto UUID REFERENCES proyectos(id_proyecto) ON DELETE RESTRICT,
    monto_invertido DECIMAL(15, 2) NOT NULL,
    
    -- Trazabilidad del Dinero y Contratos
    estado_fondos VARCHAR(50) DEFAULT 'retenido_escrow' CHECK (estado_fondos IN ('retenido_escrow', 'liberado_al_proyecto', 'reembolsado')),
    firma_digital_id VARCHAR(150), -- Enlace al contrato firmado por DocuSign/HelloSign
    fecha_inversion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE log_transacciones (
    id_transaccion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_inversion UUID REFERENCES inversiones(id_inversion),
    tipo_operacion VARCHAR(50) CHECK (tipo_operacion IN ('deposito_inicial', 'liberacion_por_hito', 'reembolso_por_cancelacion')),
    monto DECIMAL(15, 2) NOT NULL,
    
    -- Auditoría (Registro inmutable)
    hash_transaccion VARCHAR(255) UNIQUE, -- Para asegurar que el registro no sea alterado
    detalles_proveedor_pago JSON, -- Guarda la respuesta cruda de la API de pagos para auditorías
    ejecutado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
