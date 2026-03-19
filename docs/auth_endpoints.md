# Endpoints de Autenticación Segura - IslaInvest

## POST /api/auth/registro
**Propósito:** Crear cuenta con rol definido y dejar KYC pendiente.

**Request (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "PasswordSeguro123!",
  "rol": "inversor" 
}
```

**Lógica SQL a ejecutar:**
```sql
INSERT INTO usuarios (email, password_hash, rol, estado_kyc, dos_factores_activo)
VALUES ('usuario@ejemplo.com', '[HASH_GENERADO_EN_BACKEND]', 'inversor', 'pendiente', FALSE) 
RETURNING id_usuario, email, rol, estado_kyc;
```

---

## POST /api/auth/login
**Propósito:** Autenticar usuario, registrar IP para monitoreo y devolver token JWT.

**Request (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "PasswordSeguro123!",
  "ip_cliente": "190.168.1.50" 
}
```

**Lógica SQL a ejecutar (tras validar password):**
```sql
UPDATE usuarios SET ultima_ip_acceso = '190.168.1.50' WHERE email = 'usuario@ejemplo.com';
```

**Response (JSON):**
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "token_acceso": "[JWT_TOKEN]",
  "requiere_2fa": false, 
  "usuario": {
    "id_usuario": "...",
    "rol": "inversor",
    "estado_kyc": "pendiente"
  }
}
```
