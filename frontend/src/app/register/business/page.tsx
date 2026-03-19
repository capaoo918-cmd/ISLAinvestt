'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BusinessRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    try {
      const res = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rol: 'creador' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en registro');
      
      localStorage.setItem('auth_token', data.token_acceso);
      localStorage.setItem('user_role', 'creador');
      router.push('/dashboard');
    } catch(err: any) {
      setErrorMsg(err.message);
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden">
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-secondary-fixed/5 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="w-full max-w-3xl z-10 bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden relative animate-slide-up">
        
        {/* Progress Header Corporate */}
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-8 py-5 flex items-center justify-between">
          <Link href="/register" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Salir
          </Link>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-outline-variant/50'}`}></span>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-outline-variant/50'}`}></div>
            <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-outline-variant/50'}`}></span>
          </div>
          <span className="text-xs font-bold text-secondary-fixed bg-secondary-fixed/10 px-3 py-1 rounded-full uppercase tracking-widest border border-secondary-fixed/50">Cuenta Empresa / B2B</span>
        </div>

        <div className="p-8 md:p-12">
          {/* STEP 1: Entidad Jurídica */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="mb-8 border-l-4 border-l-secondary-fixed pl-4">
                <h2 className="text-3xl font-extrabold font-headline text-primary mb-2">Entidad Fiduciaria / Promotor</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Registra los datos legales de la compañía desarrolladora o inmobiliaria. Solo empresas registradas formalmente pueden listar propiedades en IslaInvest.
                </p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                {errorMsg && <div className="p-3 bg-error-container/50 border border-error/50 text-error text-xs rounded font-medium text-center mb-4">{errorMsg}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Razón Social Corp.</label>
                    <input type="text" placeholder="Ej. Costa Azul Developments SRL" required 
                           className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md h-[48px]" />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">RNC / Tax ID (NIF)</label>
                    <input type="text" placeholder="X-XXXXXXX-X" required 
                           className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md h-[48px]" />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Licencia Inmobiliaria (Si Aplica)</label>
                    <input type="text" placeholder="N/A o Num. Licencia" 
                           className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md h-[48px]" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Correo Corporativo de Ventas / CRM</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ventas@costaazul.com" required 
                         className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md h-[48px]" />
                </div>

                <div className="pt-6 border-t border-outline-variant/20">
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-primary/90 transition-all flex justify-center items-center gap-2 group">
                    SIGUIENTE: REPRESENTANTE Y KYC <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Representante Legal */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="mb-8 border-l-4 border-l-primary pl-4">
                <h2 className="text-3xl font-extrabold font-headline text-primary mb-2 flex items-center justify-between">
                  Representante AML <span className="material-symbols-outlined text-tertiary">how_to_reg</span>
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Persona responsable (Compliance/Oficial Anti-lavado) o Director comercial autorizado a recibir Leads calificados y firmar.
                </p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Nombre Completo del Oficial</label>
                    <input type="text" placeholder="Ej. Roberto Martínez" required 
                           className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary border-b-[3px] focus:border-b-primary shadow-sm h-[48px]" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Número Móvil / WhatsApp de Cierre</label>
                    <input type="tel" placeholder="+1 (809) 000-0000" required 
                           className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary border-b-[3px] focus:border-b-primary shadow-sm h-[48px]" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-2">Contraseña de Administrador CRM</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
                         className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md h-[48px]" />
                </div>

                {/* Subir Registro Mercantil */}
                <div className="mt-8 border-2 border-dashed border-outline-variant/50 rounded-xl p-8 bg-surface-container-low text-center hover:bg-surface-container-lowest hover:border-primary transition-colors cursor-pointer group flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2 group-hover:-translate-y-1 transition-transform">post_add</span>
                  <span className="font-bold text-primary text-sm">Cargar Registro Mercantil / Constitutivo</span>
                  <span className="text-[10px] text-on-surface-variant">Archivos Soporte, Max 15MB PDF. Auditado manualmente.</span>
                </div>

                <div className="pt-6 border-t border-outline-variant/20 flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="bg-surface-container-low text-primary py-4 px-6 rounded font-bold uppercase tracking-widest text-xs border border-outline-variant/30 hover:bg-surface-container-highest transition-all">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  </button>
                  <button onClick={handleRegister} disabled={isLoading} className="w-full bg-primary text-white py-4 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-primary/90 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? 'ENVIANDO...' : 'SOLICITAR APROBACIÓN'} <span className="material-symbols-outlined text-[18px]">domain_verification</span>
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
