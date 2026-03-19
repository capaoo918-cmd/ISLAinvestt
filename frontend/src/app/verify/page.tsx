'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyIdentity() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerify = async () => {
    setIsLoading(true);
    // Simulación de carga y procesamiento de KYC
    setTimeout(async () => {
      const token = localStorage.getItem('auth_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

      try {
        const res = await fetch(`${API_URL}/kyc/procesar`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setIsSuccess(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-20 h-20 bg-success-container text-success rounded-full flex items-center justify-center mb-6 shadow-lg">
          <span className="material-symbols-outlined text-4xl">verified</span>
        </div>
        <h1 className="text-3xl font-extrabold font-headline text-primary mb-2">Identidad Verificada</h1>
        <p className="text-on-surface-variant max-w-md mb-8">
          Tu cuenta ha sido validada con éxito. Ya puedes proceder a firmar contratos de inversión y participar en el Marketplace con plena capacidad legal.
        </p>
        <button onClick={() => router.back()} className="bg-primary text-white px-8 py-3 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-primary/90 transition-all">
          Volver a la Propiedad
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold font-headline text-primary mb-3">Centro de Verificación AML</h1>
          <p className="text-on-surface-variant">Como parte de nuestros protocolos de seguridad anti-estafas, requerimos una prueba de identidad válida.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden">
          <div className="p-8 border-b border-outline-variant/10 bg-primary/5">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-secondary-fixed rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined">id_card</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary">Cargando Documento Nacional</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Paso Obligatorio para Inversionistas</p>
                </div>
             </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-outline-variant/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer group bg-surface-container-low">
                <span className="material-symbols-outlined text-3xl text-primary mb-2 group-hover:-translate-y-1 transition-transform">add_a_photo</span>
                <span className="text-xs font-bold text-primary uppercase">Frente del ID</span>
                <span className="text-[10px] text-on-surface-variant mt-1">Sube una foto clara</span>
              </div>
              <div className="border-2 border-dashed border-outline-variant/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer group bg-surface-container-low">
                <span className="material-symbols-outlined text-3xl text-primary mb-2 group-hover:-translate-y-1 transition-transform">add_a_photo</span>
                <span className="text-xs font-bold text-primary uppercase">Reverso del ID</span>
                <span className="text-[10px] text-on-surface-variant mt-1">Válido: Cédula / Pasaporte</span>
              </div>
            </div>

            <div className="bg-tertiary/5 border border-tertiary/10 rounded-xl p-4 flex gap-4">
              <span className="material-symbols-outlined text-tertiary">info</span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Tus datos están protegidos por cifrado de grado militar. IslaInvest no almacena tus fotos, solo verificamos tu validez legal mediante APIs de confianza internacional.
              </p>
            </div>

            <button 
              onClick={handleVerify} 
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  PROCESANDO CON INTELIGENCIA ARTIFICIAL...
                </>
              ) : (
                <>VERIFICAR IDENTIDAD <span className="material-symbols-outlined text-[18px]">gavel</span></>
              )}
            </button>
          </div>
        </div>

        <button onClick={() => router.back()} className="mt-8 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 mx-auto text-xs font-bold uppercase tracking-widest">
           Cancelar y Volver
        </button>
      </div>
    </div>
  );
}
