# Arquitectura de Seguridad y Anti-Estafas: IslaInvest

## 1. Módulo de Verificación de Identidad (KYC/AML)
- [ ] Integrar API de verificación de identidad (ej. Sumsub, Jumio o Stripe Identity).
- [ ] Configurar flujo de validación para Inversores (ID + Selfie).
- [ ] Configurar flujo de validación exhaustivo para Creadores de Proyectos (ID + Documentos de la empresa).
- [ ] Bloquear automáticamente cuentas que no pasen el filtro AML (Anti-Lavado de Dinero).

## 2. Módulo de Gestión de Fondos (Modelo Escrow)
- [ ] Configurar cuenta de retención (Escrow) de terceros (ej. Stripe Connect o Escrow.com).
- [ ] Establecer lógica de retención: El capital de los inversores va al Escrow, no al creador.
- [ ] Programar validación de hitos: Liberación de fondos sujeta a metas comprobables.
- [ ] Habilitar sistema de reembolsos automáticos si el proyecto se cancela o no cumple los requisitos.

## 3. Seguridad de Acceso y App Web
- [ ] Implementar Autenticación de Dos Factores (2FA) obligatoria para retiros y cambios de credenciales.
- [ ] Configurar alertas de actividad inusual (inicios de sesión desde ubicaciones o dispositivos nuevos).
- [ ] Asegurar cifrado de extremo a extremo para la base de datos (datos personales y financieros).

## 4. Transparencia y Trazabilidad (Dashboard)
- [ ] Diseñar panel de control para el inversor con el estado en tiempo real de su dinero.
- [ ] Integrar API de firmas electrónicas (ej. DocuSign o HelloSign) para generar contratos vinculantes por cada inversión.
- [ ] Crear un registro inmutable (log) de todas las transacciones para auditorías.
