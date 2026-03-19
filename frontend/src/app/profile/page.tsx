'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

    fetch(`${API_URL}/auth/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setUser(data);
      setIsLoading(false);
    })
    .catch(err => {
      console.error('Error fetching user profile:', err);
      setIsLoading(false);
    });
  }, [router]);

  if (isLoading) return <div className="min-h-screen bg-surface flex items-center justify-center">Cargando Bóveda...</div>;

  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-20">
      <Header />
      <header className="bg-primary text-on-primary pt-24 pb-32 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black font-headline mb-2 uppercase tracking-tighter">{t.profile}</h1>
            <p className="opacity-70 text-sm">Gestión de identidad y activos digitales en IslaInvest.</p>
          </div>
          <button onClick={() => router.push('/marketplace')} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-xs font-bold transition-all border border-white/10 uppercase tracking-widest">
            {t.marketplace}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 -mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-2xl p-8 border border-outline-variant/10">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 border-4 border-primary/10">
              <span className="material-symbols-outlined text-5xl text-primary">person</span>
            </div>
            <h2 className="text-2xl font-black text-primary mb-1">{user?.email?.split('@')[0]}</h2>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest bg-surface-container-low px-4 py-1 rounded-full mb-6">
              {user?.rol === 'inversor' ? 'Inversor Acreditado' : 'Promotor B2B'}
            </p>
            
            <div className={`w-full p-4 rounded-2xl flex items-center gap-3 mb-8 ${
              user?.estado_kyc === 'aprobado' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span className="material-symbols-outlined">
                {user?.estado_kyc === 'aprobado' ? 'verified' : 'error'}
              </span>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-tighter">Estado de Identidad</p>
                <p className="text-xs font-black">{user?.estado_kyc === 'aprobado' ? 'VERIFICADO (KYC OK)' : 'PENDIENTE DE VALIDACIÓN'}</p>
              </div>
            </div>

            <div className="w-full space-y-4">
              <button className="w-full bg-surface-container-low text-primary py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface-container-high transition-all">
                Configuración Segura
              </button>
              <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="w-full text-red-500 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">logout</span> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Info Tabs */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-outline-variant/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#735c00] mb-8">Información del Sistema</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-2">Correo Electrónico</label>
                <p className="bg-surface-container-low p-4 rounded-xl text-sm font-bold text-primary">{user?.email}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-2">ID de Bóveda (UUID)</label>
                <p className="bg-surface-container-low p-4 rounded-xl text-[10px] font-mono text-primary truncate">{user?.id_usuario}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-2">Fecha de Registro</label>
                <p className="bg-surface-container-low p-4 rounded-xl text-sm font-bold text-primary">
                  {user?.creado_en ? new Date(user.creado_en).toLocaleDateString() : 'Procesando...'}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-2">Proveedor KYC</label>
                <p className="bg-surface-container-low p-4 rounded-xl text-sm font-bold text-primary">
                  {user?.proveedor_kyc_id || 'No vinculado'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary text-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary-fixed mb-4">Cartera Escrow Total</h3>
                <div className="text-5xl font-black font-headline mb-2">$0.00</div>
                <p className="text-xs opacity-60">Fondos retenidos en contratos activos para tu seguridad.</p>
              </div>
              <span className="material-symbols-outlined text-7xl opacity-20">wallet</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
