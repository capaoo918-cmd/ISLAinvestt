'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [useFaceID, setUseFaceID] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Autenticación Fallida');
      }

      const data = await res.json();
      localStorage.setItem('auth_token', data.token_acceso);
      localStorage.setItem('user_role', data.usuario.rol);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login Error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setErrorMsg('Error de Conexión (Load Failed): El servidor de IslaInvest no responde. Verifica la URL de API en Vercel.');
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    try {
      // Simulación de WebAuthn / FaceID real
      if (window.PublicKeyCredential) {
        console.log('Iniciando WebAuthn Check...');
        // Simulamos la llamada al sensor del sistema
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // El usuario administrador por defecto para pruebas rápidas
        setEmail('admin@islainvest.com');
        setPassword('admin12345');
        
        // Realizamos el login automático tras el "escaneo"
        const event = { preventDefault: () => {} } as any;
        handleLogin(event);
      } else {
        throw new Error('Biometría no soportada en este navegador');
      }
    } catch (err: any) {
      setErrorMsg('Fallo en Biometría: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-secondary-fixed/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-fade-in relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Superior */}
        <div className="bg-primary px-8 py-6 text-center text-on-primary">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-extrabold font-headline tracking-tight mb-2 flex justify-center items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed">vpn_key</span> IslaInvest
            </h1>
          </Link>
          <p className="text-xs text-white/70 tracking-widest uppercase font-bold">Portal de Inversión Segura</p>
        </div>

        {/* Formularios */}
        <div className="p-8">
          
          {!useFaceID ? (
            <form className="space-y-5 animate-slide-up" onSubmit={handleLogin}>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">Correo Electrónico Verificado</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-outline-variant">mail</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="inversor@bienesraices.do" required 
                         className="w-full bg-surface border border-outline-variant/30 rounded pl-10 pr-3 py-3 text-sm text-primary focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md h-[46px]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block">Clave de Bóveda</label>
                  <Link href="/forgot-password" className="text-[10px] text-tertiary font-bold hover:underline">¿Perdiste tu acceso?</Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-outline-variant">lock</span>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••" required 
                         className="w-full bg-surface border border-outline-variant/30 rounded pl-10 pr-3 py-3 text-sm text-primary focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md h-[46px]" />
                </div>
              </div>

              {errorMsg && <div className="p-3 bg-error-container/50 border border-error/50 text-error text-xs rounded font-medium text-center">{errorMsg}</div>}

              <button type="submit" disabled={isLoading} className="w-full bg-primary text-white py-3.5 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                {isLoading ? 'VERIFICANDO...' : 'DESBLOQUEAR CUENTA'} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 animate-slide-up text-center">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 relative group cursor-pointer transition-all hover:bg-primary/10">
                <div className="absolute inset-0 border-[3px] border-dashed border-tertiary/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <span className="material-symbols-outlined text-tertiary text-[40px] group-hover:scale-110 transition-transform">face</span>
              </div>
              <h3 className="font-bold text-primary font-headline text-lg mb-2">Autenticación Biométrica</h3>
              <p className="text-xs text-on-surface-variant max-w-[200px] mb-6">Coloca tu rostro frente a la cámara web o usa el sensor de huellas (Windows Hello / FaceID).</p>
              <button 
                onClick={handleBiometricAuth}
                disabled={isLoading}
                className="bg-tertiary/10 text-tertiary border border-tertiary/20 px-6 py-2 rounded-full text-xs font-bold w-full uppercase tracking-widest hover:bg-tertiary/20 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Escaneando...' : 'Activar Sensor Biométrico'}
              </button>
            </div>
          )}

          <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-outline-variant/20"></div>
            <span className="px-3 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Conexión Rápida</span>
            <div className="flex-1 border-t border-outline-variant/20"></div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button onClick={() => setUseFaceID(!useFaceID)} type="button" 
                    className="w-full bg-surface-container-low text-primary py-3 rounded border border-outline-variant/30 text-xs font-bold hover:bg-surface-container-highest transition-colors flex justify-center items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-tertiary">{useFaceID ? 'password' : 'face'}</span> 
              {useFaceID ? 'Usar Correo y Contraseña' : 'Iniciar con Face ID / WebAuthn'}
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-on-surface-variant font-medium">
            ¿Nuevo en la plataforma? <Link href="/register" className="text-primary font-bold hover:underline">Audita tu Perfil Aquí</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
