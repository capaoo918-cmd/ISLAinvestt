import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const usePasskeys = () => {
  const registerPasskey = async (email: string) => {
    try {
      // 1. Obtener opciones de registro del servidor
      const resOptions = await fetch(`${API_URL}/auth/webauthn/register-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const options = await resOptions.json();

      // 2. Ejecutar el sensor biométrico del dispositivo (FaceID / TouchID)
      const registrationResponse = await startRegistration(options);

      // 3. Verificar la respuesta en el servidor
      const resVerify = await fetch(`${API_URL}/auth/webauthn/verify-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, registrationResponse }),
      });

      const verification = await resVerify.json();
      return verification.verified;
    } catch (error) {
      console.error('Error registering passkey:', error);
      throw error;
    }
  };

  const authenticatePasskey = async (email: string) => {
    try {
      // 1. Obtener opciones de login
      const resOptions = await fetch(`${API_URL}/auth/webauthn/login-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const options = await resOptions.json();

      // 2. Firmar el desafío con el sensor biométrico
      const authResponse = await startAuthentication(options);

      // 3. Verificar la firma en el servidor
      const resVerify = await fetch(`${API_URL}/auth/webauthn/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, authResponse }),
      });

      const verification = await resVerify.json();
      return verification;
    } catch (error) {
      console.error('Error authenticating with passkey:', error);
      throw error;
    }
  };

  return { registerPasskey, authenticatePasskey };
};
