const pool = require('./db');

async function migrate() {
    console.log('--- Iniciando Migración de Inteligencia de Ventas (v2: UUID) ---');
    try {
        await pool.query(`
            -- 1. Tabla de Vistas de Propiedades
            CREATE TABLE IF NOT EXISTS vistas_propiedades (
                id_vista UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                id_propiedad UUID REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
                id_usuario UUID REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
                dispositivo TEXT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- 2. Tabla de Leads Interesados
            CREATE TABLE IF NOT EXISTS leads_interesados (
                id_lead UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                id_propiedad UUID REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
                id_usuario UUID REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                score_interes INT DEFAULT 0,
                ultima_interaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(id_propiedad, id_usuario)
            );

            -- 3. Tabla de Ventas Gestionadas
            CREATE TABLE IF NOT EXISTS ventas_gestionadas (
                id_venta SERIAL PRIMARY KEY,
                id_propiedad UUID REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
                id_vendedor UUID REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
                id_comprador UUID REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
                monto_total DECIMAL(15,2) NOT NULL,
                comision_plataforma DECIMAL(15,2) DEFAULT 0,
                estado_legal TEXT DEFAULT 'reserva',
                fecha_cierre TIMESTAMP
            );

            -- 4. Métricas de Rendimiento
            CREATE TABLE IF NOT EXISTS metricas_vendedores (
                id_metricas SERIAL PRIMARY KEY,
                id_vendedor UUID REFERENCES usuarios(id_usuario) UNIQUE,
                volumen_ventas DECIMAL(15,2) DEFAULT 0,
                conteo_ventas INT DEFAULT 0,
                conversion_rate DECIMAL(5,2) DEFAULT 0
            );
        `);
        console.log('✅ Tablas de Inteligencia (UUID) creadas con éxito.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
}

migrate();
