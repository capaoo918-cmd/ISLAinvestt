-- ===================================================================
-- Esquema de Analíticas de Plataforma y Rendimiento de Propiedades
-- ===================================================================

CREATE TABLE IF NOT EXISTS analytics_busquedas (
    id_busqueda UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    termino_busqueda VARCHAR(255) NOT NULL,
    categoria_filtro VARCHAR(100), -- ej. Pre-construcción, Alto Yield
    contador INT DEFAULT 1,
    ultima_busqueda TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_propiedades (
    id_analytics UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
    
    -- Métricas de Engament y Retención
    vistas_totales INT DEFAULT 0,
    tiempo_promedio_segundos INT DEFAULT 0,
    
    -- Métricas de Conversión (Embudos)
    clics_ver_fotos INT DEFAULT 0,
    clics_ver_contrato INT DEFAULT 0,
    clics_iniciar_cierre INT DEFAULT 0,
    
    -- Interacciones
    guardados_favoritos INT DEFAULT 0,
    
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
