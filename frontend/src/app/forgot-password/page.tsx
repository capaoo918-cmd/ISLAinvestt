'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-tertiary/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-fade-in relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Superior Libre */}
        <div className="bg-surface-container-low px-8 py-6 border-b border-outline-variant/20 flex flex-col justify-center items-center">
          <Link href="/login" className="self-start text-[10px] uppercase font-bold text-on-surface-variant hover:text-primary mb-4 flex items-center gap-1">
             <span className="material-symbols-outlined text-[14px]">arrow_back</span> Regresar
          </Link>
          <div className="w-16 h-16 bg-Error-container/10 rounded-full border-[3px] border-error/50 flex items-center justify-center mb-4 relative drop-shadow">
             <div className="absolute inset-0 bg-error/20 animate-ping rounded-full opacity-50"></div>
             <span className="material-symbols-outlined text-error text-3xl">lock_reset</span>
          </div>
          <h1 className="text-2xl font-extrabold font-headline tracking-tight text-primary">Autenticación Fallida</h1>
          <p className="text-xs text-on-surface-variant text-center mt-2 px-2 max-w-[300px]">Si perdiste la Clave de tu Bóveda, debes seguir un protocolo riguroso de reactivación.</p>
        </div>

        {/* Formularios */}
        <div className="p-8">
          
          {!sent ? (
            <form className="space-y-6 animate-slide-up" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">Correo Electrónico Vinculado</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-outline-variant">mail</span>
                  <input type="email" placeholder="inversor@bienesraices.do" required 
                         className="w-full bg-surface border border-outline-variant/30 rounded pl-10 pr-3 py-3 text-sm text-primary focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-md h-[46px]" />
                </div>
              </div>

              <div className="p-4 bg-error/5 border-l-4 border-l-error rounded text-xs text-on-surface-variant">
                 <span className="font-bold text-error flex items-center gap-1 mb-1"><span className="material-symbols-outlined text-[14px]">warning</span> Suspensión Criptográfica</span>
                 Al solicitar el reseteo, por medidas de seguridad Anti-Fraude tu FaceID (WebAuthn) también será invalidado y deberás configurarlo de nuevo.
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded font-bold uppercase tracking-widest text-[11px] shadow-md hover:bg-primary/90 transition-all flex justify-center items-center gap-2 group">
                INICIAR PROTOCOLO DE RECUPERACIÓN <span className="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform">vpn_key_alert</span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 animate-slide-up text-center">
              <span className="material-symbols-outlined text-success text-[64px] mb-4">mark_email_read</span>
              <h3 className="font-bold text-success font-headline text-2xl mb-2">Protocolo Iniciado</h3>
              <p className="text-xs text-on-surface-variant max-w-[250px] mb-6 leading-relaxed">
                Hemos enviado un correo ultra seguro para que puedas generar una nueva Clave. Este enlace es válido por 10 minutos.
              </p>
              <Link href="/login" className="bg-success-container/20 text-success border border-success/30 px-6 py-3 rounded text-xs font-bold w-full uppercase tracking-widest hover:bg-success-container/40 transition-all shadow-sm">
                VOLVER AL ACCESO <span className="material-symbols-outlined text-[14px] align-middle -mt-0.5 ml-1">login</span>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
