const pool = require('../db');

// Inteligencia Artificial Mock: "Alfred Fernandez"
// En una implementación real (V2), aquí conectaríamos la API de OpenAI/Gemini con un Prompt System detallado.
// Como prototipo, Alfred detectará intenciones mediante palabras clave para clasificar el Lead y llevarlo por los 7 pasos.

exports.chatConAlfred = async (req, res) => {
    try {
        const { mensaje_usuario, lead_id_local, nombre_usuario } = req.body;
        let id_lead_db = lead_id_local;

        // Limpieza básica para análisis de intención
        const msg = mensaje_usuario.toLowerCase();
        
        // 1. SI ES UN LEAD NUEVO (Paso 1: Identificación)
        if (!id_lead_db) {
            const nuevoLead = await pool.query(
                `INSERT INTO crm_leads (nombre_contacto, historial_chat) VALUES ($1, $2) RETURNING id_lead`,
                [nombre_usuario || 'Anónimo', JSON.stringify([{ role: 'user', text: msg }])]
            );
            id_lead_db = nuevoLead.rows[0].id_lead;

            return res.status(200).json({
                lead_id: id_lead_db,
                etapa: "1_identificacion",
                respuesta: "¡Hola! Soy Alfred Fernandez, tu Agente Especializado y Asesor en IslaInvest. Me encargo de guiar a nuestros clientes para encontrar la estructura de inversión ideal. Para poder perfilar qué tipo de activos mostrarte, cuéntame: ¿Estás buscando una propiedad individual para disfrute personal y rentabilidad (Comprador General), o buscas colocar capital institucional en proyectos de gran escala y recibir yields fraccionados (Inversionista)?"
            });
        }

        // Si el lead ya existe, obtenemos su estado actual en el CRM (Los 7 Pasos)
        const leadQuery = await pool.query(`SELECT * FROM crm_leads WHERE id_lead = $1`, [id_lead_db]);
        
        if (leadQuery.rows.length === 0) {
            return res.status(404).json({ error: "Lead no encontrado en el CRM" });
        }

        const leadData = leadQuery.rows[0];
        let tipo_cliente = leadData.tipo_cliente;
        let etapa_ventas = leadData.etapa_ventas;

        // Actualizar Historial del Chat en DB (Memoria de Conversación)
        let historial = leadData.historial_chat;
        historial.push({ role: 'user', text: msg });

        // --- SISTEMA DE CLASIFICACIÓN Y PASOS DE VENTA (AI SIMULADA) ---
        let respuestaAI = "";

        // Si estamos en Paso 1 (Acortando a Preparación/Acercamiento)
        if (etapa_ventas === '1_identificacion') {
            if (msg.includes('inversion') || msg.includes('institucional') || msg.includes('capital') || msg.includes('rentabilidad alta') || msg.includes('fraccionado')) {
                tipo_cliente = 'inversionista_institucional';
                etapa_ventas = '3_acercamiento';
                respuestaAI = "¡Excelente visión! Como inversionista en IslaInvest tienes la ventaja exclusiva de la Ley CONFOTUR, lo que te exonera de varios impuestos operativos (0%). Trabajaremos con la Bóveda Trust-Shield para que tus fondos sólo se muevan bajo hitos estrictos. ¿Te interesaría ver el pool de proyectos hoteleros o prefieres desarrollos residenciales de corta estancia (Airbnb)?";
            } else if (msg.includes('comprador') || msg.includes('propiedad') || msg.includes('disfrute') || msg.includes('casa') || msg.includes('apartamento')) {
                tipo_cliente = 'comprador_general';
                etapa_ventas = '3_acercamiento';
                respuestaAI = "Entendido perfectamente. Como Comprador General buscas un activo tangible prime en el Caribe donde puedas disfrutarlo pero a la vez asegurar rentabilidad del 7-10% anual mínimo cuando no estés. Tenemos ofertas maravillosas en Cap Cana y Punta Cana. (Paso 2 completado). ¿En qué rango de presupuesto te sientes cómodo explorando (Ej. $300k, $500k+)?";
            } else {
                respuestaAI = "Entiendo lo que dices. Para poder brindarte las ofertas precisas de IslaInvest, ¿podrías confirmarme si te perfilaremos como un *Comprador General* (activos terminados para uso personal/renta) o un *Inversionista* (aportes de capital para desarrollo y altos yields)?";
            }
        } 
        
        // Paso 3 (Presentación)
        else if (etapa_ventas === '3_acercamiento') {
            etapa_ventas = '4_presentacion';
            if (tipo_cliente === 'inversionista_institucional') {
                respuestaAI = "¡Anotado! Actualmente tenemos un proyecto estrella llamado 'Costa Palmera Fase 2', el cual requiere una inyección de $1.5M bajo retención Fiduciaria, con un ROI proyectado del 12%. El promotor ya tiene el 40% fondeado y el Trust-Shield está auditando el terreno. ¿Qué te parece esta opción para tu portafolio?";
            } else {
                respuestaAI = "Excelente presupuesto. Te presento nuestra mejor oportunidad de mercado secundario: Una lujosa villa de 3 habitaciones en Azure Marina, por debajo del valor de tasación del mercado. Todo el proceso de venta, cierre y notarización (RON) lo haces aquí de forma digital. ¿Te envía los renders y el smart contract para revisarlo?";
            }
        }

        // Paso 5 (Respuesta ante objeciones)
        else if (etapa_ventas === '4_presentacion') {
            if (msg.includes('no') || msg.includes('caro') || msg.includes('riesgo') || msg.includes('dudas') || msg.includes('seguro')) {
                etapa_ventas = '5_manejo_objeciones';
                respuestaAI = "Comprendo perfectamente su precaución, es el pensamiento correcto en activos inmobiliarios. Con IslaInvest su riesgo de construcción es literalmente 0% porque su dinero **no va al promotor**. Va a una bóveda fiduciaria regulada internacionalmente. Si el bloque de edificios no se levanta según plazo, nuestro sistema se lo reembolsa a su tarjeta o wallet automáticamente en 48h. ¿Le da esto mayor seguridad para avanzar?";
            } else {
                etapa_ventas = '6_cierre';
                respuestaAI = "¡Maravilloso! El siguiente paso es extremadamente simple. Te he habilitado el botón de [START DIGITAL CLOSING] en el panel de la propiedad. Con un par de clics podrás fondear tu parte al Escrow y estarás asegurando tu ticket de inversión. Pasa a nuestro Dashboard para ver la auditoría transparente.";
            }
        }

        // Paso 6 y 7
        else if (etapa_ventas === '5_manejo_objeciones' || etapa_ventas === '6_cierre') {
            etapa_ventas = '7_seguimiento';
            respuestaAI = "Fantástico. Dejaré registro en nuestro sistema y le enviaré un correo automatizado de seguimiento con el resumen de la videollamada y nuestra documentación legal. Y recuerde, cualquier otra duda a lo largo de este mes, yo, Alfred Fernandez, estaré aquí vía WhatsApp o Chat para asistirle. ¡Que tenga un excelente día en IslaInvest!";
        } else {
            respuestaAI = "¡Estoy alerta! Recuerda que te estaré dando seguimiento automatizado para asegurar que tu capital rinda los frutos esperados. Puedes revisar el 'Escrow Audit' superior para ver el manejo actual de tus inversiones.";
        }

        // Insertar respuesta final del bot al historial de la DB
        historial.push({ role: 'alfred', text: respuestaAI });

        // Actualizamos los datos del Lead en la nube CRM (Supabase PG)
        await pool.query(
            `UPDATE crm_leads 
             SET tipo_cliente = $1, etapa_ventas = $2, historial_chat = $3, ultima_interaccion_en = CURRENT_TIMESTAMP
             WHERE id_lead = $4`,
            [tipo_cliente, etapa_ventas, JSON.stringify(historial), id_lead_db]
        );

        return res.status(200).json({
            lead_id: id_lead_db,
            etapa: etapa_ventas,
            tipo_cliente: tipo_cliente,
            respuesta: respuestaAI
        });

    } catch (error) {
        console.error('Error procesando AI Alfred:', error);
        res.status(500).json({ error: 'Error del servidor con la Inteligencia Artificial.' });
    }
};

// Webhook simulado para recibir mensajes desde un proveedor de WhatsApp (Twilio/Meta)
exports.webhookWhatsApp = async (req, res) => {
    try {
        // Formato estándar de un webhook de Meta API
        // req.body.entry[0].changes[0].value.messages[0]
        console.log("Notificación entrante de WhatsApp Business API registrada.");
        res.status(200).send("EVENT_RECEIVED");
    } catch (e) {
        res.status(500).send("SERVER_ERROR");
    }
};
