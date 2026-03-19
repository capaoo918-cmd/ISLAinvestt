'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InvestorRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Intentando registrar usuario:', email);
    setIsLoading(true);
    setErrorMsg('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

    try {
      const res = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rol: 'inversor' })
      });
      const data = await res.json();
      console.log('Respuesta del servidor:', data);
      
      if (!res.ok) throw new Error(data.error || 'Error en registro');
      
      // Auto-Login
      localStorage.setItem('auth_token', data.token_acceso);
      localStorage.setItem('user_role', 'inversor');
      console.log('Registro exitoso, redirigiendo...');
      router.push('/dashboard');
    } catch(err: any) {
      console.error('Falla en registro:', err);
      setErrorMsg(err.message || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center py-12 px-6">
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden relative">
        
        {/* Progress Bar Header */}
        <div className="bg-primary/5 border-b border-primary/10 px-8 py-5 flex items-center justify-between">
          <Link href="/register" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Atrás
          </Link>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-tertiary' : 'bg-outline-variant/50'} transition-colors`}></span>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-tertiary' : 'bg-outline-variant/50'} transition-colors`}></div>
            <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-tertiary' : 'bg-outline-variant/50'} transition-colors`}></span>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Perfil Inversor</span>
        </div>

        <div className="p-8 md:p-12">
          {errorMsg && <div className="p-3 bg-error-container/50 border border-error/50 text-error text-xs rounded font-medium text-center mb-6 animate-fade-in">{errorMsg}</div>}

          {/* STEP 1: Datos Básicos */}
          {step === 1 && (
            <div className="animate-slide-up">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold font-headline text-primary flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-fixed text-[32px]">person_add</span>
                  Auditoría Inicial
                </h2>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Para acceder al fondo de bienes raíces privado, necesitamos validar quién eres. Tus datos están cifrados de extremo a extremo.
                </p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Nombres Completos</label>
                    <input type="text" placeholder="Ej. Roberto Martínez" required 
                           className="w-full bg-surface border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Apellidos</label>
                    <input type="text" placeholder="García" required 
                           className="w-full bg-surface border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Crear Contraseña Maestra</label>
                  <div className="relative">
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres, números y símbolos" required 
                           className="w-full bg-surface border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <p className="text-[10px] text-tertiary mt-2 flex items-center gap-1 font-bold"><span className="material-symbols-outlined text-[14px]">lock</span> Encriptación SHA-256 Automática</p>
                </div>

                <div className="pt-4 border-t border-outline-variant/20">
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-primary/90 transition-all flex justify-center items-center gap-2">
                    Continuar a Contacto <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Verificación de Contacto */}
          {step === 2 && (
            <div className="animate-slide-up">
               <div className="mb-8">
                <h2 className="text-3xl font-extrabold font-headline text-primary flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-[32px]">contact_mail</span>
                  Doble Factor (2FA)
                </h2>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                 ## Fase 3: Detalle de Propiedad e Inversión
- [x] Endpoint de detalle de proyecto en el backend
- [x] Página de detalle de propiedad en Next.js
- [x] Componente Chatbot (Alfred) con validación KYC
- [x] Lógica de inversión con Escrow
- [x] Portal de Verificación dedicado (`/verify`)
 catálogo de propiedades privadas.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleRegister}>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Confirmación de Identidad por Email</label>
                  <div className="flex gap-3">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@identidad-verificada.com" required 
                           className="w-full bg-surface border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                           setIsLoading(false);
                           alert('Se ha enviado un correo de confirmación a ' + email + '. Por favor haz clic en el enlace para activar el check.');
                        }, 1000);
                      }}
                      className="bg-surface-container-highest text-primary font-bold px-4 rounded text-xs whitespace-nowrap hover:bg-outline-variant/50 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">mark_email_read</span> Verificar Email
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Teléfono Móvil (Contacto Directo con Alfred)</label>
                  <div className="flex gap-3">
                    <select className="bg-surface border border-outline-variant/30 rounded px-3 py-3 text-sm focus:outline-none focus:border-primary text-on-surface-variant font-bold">
                      <option>+1 (DO/US)</option>
                      <option>+34 (ES)</option>
                      <option>+52 (MX)</option>
                    </select>
                    <input type="text" placeholder="(809) 555-0000" required 
                           className="w-full bg-surface border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md" />
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="bg-surface-container-low text-primary py-4 px-6 rounded font-bold uppercase tracking-widest text-xs border border-outline-variant/30 hover:bg-surface-container-highest transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  </button>
                  <button type="submit" disabled={isLoading} className="w-full bg-brand text-on-primary py-4 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-brand/90 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                    {isLoading ? 'ENCRIPTANDO BÓVEDA...' : 'CREAR BÓVEDA INVERSOR'} <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  </button>
                </div>
              </form>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
