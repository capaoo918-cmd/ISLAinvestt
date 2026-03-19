-- ===================================================================
-- Esquema de CRM y Asistente AI de Ventas: Alfred Fernandez
-- ===================================================================

CREATE TABLE IF NOT EXISTS crm_leads (
    id_lead UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_contacto VARCHAR(150),
    email VARCHAR(150),
    telefono_whatsapp VARCHAR(50),
    
    -- Análisis de IA (Intent recognition)
    tipo_lead VARCHAR(50) DEFAULT 'desconocido' CHECK (tipo_lead IN ('comprador_general', 'inversionista_institucional', 'creador_proyecto', 'desconocido')),
    
    -- Los 7 Pasos de la Venta (Seguimiento automatizado)
    etapa_ventas VARCHAR(100) DEFAULT '1_identificacion' CHECK (etapa_ventas IN (
        '1_identificacion', '2_preparacion', '3_acercamiento', 
        '4_presentacion', '5_manejo_objeciones', '6_cierre', '7_seguimiento'
    )),
    
    -- Historial conversacional para alimentar al LLM
    historial_chat JSONB DEFAULT '[]'::jsonb,
    origen_contacto VARCHAR(50) DEFAULT 'web_widget', -- web_widget, whatsapp_api, telegram
    
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_interaccion_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
