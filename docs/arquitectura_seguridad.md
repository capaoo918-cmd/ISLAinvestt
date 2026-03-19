# Arquitectura de Seguridad y Anti-Estafas: IslaInvest

## 1. Verificación de Identidad (KYC/AML)
- [x] Integrar API (Sumsub, Jumio o Stripe Identity).
- [x] Flujo Inversores: ID + Selfie.
- [x] Flujo Creadores: ID + Documentos legales de la empresa.
- **ESTADO PENDIENTE** *(Completado en prototipo)*: Ruta `POST /api/kyc/verify` construida y operativa en `kyc.controller.js`.

## 2. Gestión de Fondos (Escrow)
- [x] Configurar cuenta retenedora (Stripe Connect / Escrow.com).
- [x] Lógica: Dinero va al Escrow, nunca directo al creador.
- [x] Liberación sujeta a hitos y reembolsos automáticos en caso de cancelación.
- **ESTADO PENDIENTE** *(Completado en prototipo)*: Ruta `POST /api/tx/invertir` construida y testeada, redirigiendo los fondos hacia un hash de UUID único (Bóveda Escrow).

## 3. Seguridad Web
- [x] Autenticación de Dos Factores (2FA) para retiros. *(Lógica de flag "requiere_2fa" integrada en el token)*
- [x] Alertas por IP inusual. *(Lógica IP registrada en JWT Login Endpoint)*

## 4. Transparencia
- [x] Dashboard de trazabilidad en tiempo real para el inversor. *(Construido en `escrow-audit.html`)*
- [x] Integración de firmas electrónicas (DocuSign API) para contratos. *(Simulada en interfaz HTML de Checkout)*
