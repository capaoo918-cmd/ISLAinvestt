'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePasskeys } from '@/hooks/usePasskeys';

interface Inversion {
  id_inversion: number;
  titulo: string;
  monto_invertido: number;
  estado_fondos: string;
  hash_transaccion: string;
  ejecutado_en: string;
}

export default function InvestorDashboard() {
  const router = useRouter();
  const { registerPasskey } = usePasskeys();
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        // Obtener datos del usuario de los meta-datos (email) para el registro de passkey
        const userEmail = localStorage.getItem('user_email') || 'admin@islainvest.com';
        setUser({ email: userEmail });

        fetch(`${API_URL}/tx/pizarron`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            setInversiones(data.inversiones || []);
            setIsLoading(false);
          })
          .catch(err => {
            console.error('Error fetching stats:', err);
            setIsLoading(false);
          });
      }, [router]);

  const handleRegisterFaceID = async () => {
    setIsRegisteringPasskey(true);
    try {
      const success = await registerPasskey(user.email);
      if (success) {
        alert('¡Dispositivo vinculado con éxito! Ahora puedes entrar usando FaceID.');
      }
    } catch (error) {
      alert('Error al vincular el dispositivo. Asegúrate de tener activada la biometría en tu móvil.');
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  const totalInvertido = inversiones.reduce((acc, inv) => acc + Number(inv.monto_invertido), 0);

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      
      {/* Sidebar Placeholder */}
      <aside className="w-full md:w-64 bg-primary text-on-primary p-6 flex flex-col gap-8">
        <div className="text-2xl font-bold font-headline tracking-tight border-b border-white/10 pb-4">IslaInvest</div>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 bg-white/10 p-3 rounded-lg font-bold text-sm">
            <span className="material-symbols-outlined">dashboard</span> Mi Bóveda
          </Link>
          <Link href="/marketplace" className="flex items-center gap-3 p-3 rounded-lg font-medium text-sm hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">explore</span> Marketplace
          </Link>
          <Link href="/portfolio" className="flex items-center gap-3 p-3 rounded-lg font-medium text-sm hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed">
            <span className="material-symbols-outlined">account_balance_wallet</span> Portafolio
          </Link>
          <button 
            onClick={handleRegisterFaceID}
            disabled={isRegisteringPasskey}
            className={`flex items-center gap-3 p-3 rounded-lg font-bold text-sm transition-all ${isRegisteringPasskey ? 'bg-white/5 opacity-50' : 'hover:bg-white/5 text-secondary-fixed'}`}
          >
            <span className="material-symbols-outlined">{isRegisteringPasskey ? 'sync' : 'face'}</span> {isRegisteringPasskey ? 'Sincronizando...' : 'Vincular FaceID'}
          </button>
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10">
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest hover:text-secondary-fixed transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-2 inline-block">Fideicomiso Privado</span>
            <h1 className="text-3xl font-extrabold font-headline text-primary tracking-tight">Bienvenido a tu Bóveda</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
                <span className="material-symbols-outlined text-tertiary">verified_user</span>
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold text-on-surface-variant leading-none">KYC Status</p>
                  <p className="text-xs font-bold text-primary">Aprobado</p>
                </div>
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-primary text-3xl mb-4">account_balance</span>
            <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Total Comprometido</p>
            <h3 className="text-3xl font-extrabold text-primary font-headline">${totalInvertido.toLocaleString()}</h3>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-tertiary text-3xl mb-4">shield</span>
            <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Activos en Escrow</p>
            <h3 className="text-3xl font-extrabold text-primary font-headline">{inversiones.length}</h3>
          </div>
          <div className="bg-primary text-on-primary p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer h-full">
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[120px] opacity-10 group-hover:scale-110 transition-transform">rocket_launch</span>
            <p className="text-[10px] uppercase font-bold tracking-widest text-secondary-fixed mb-1 relative z-10">Retorno Est. Global</p>
            <h3 className="text-3xl font-extrabold font-headline mb-4 relative z-10">~12.4% <span className="text-xs font-medium">APY</span></h3>
            <button className="bg-surface-container-lowest text-primary text-[10px] uppercase font-bold px-4 py-1.5 rounded-full relative z-10 hover:bg-white transition-colors">Optimizar Portafolio</button>
          </div>
        </div>

        {/* Transactions / Performance Section */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
           <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h2 className="font-headline font-bold text-xl text-primary flex items-center gap-2">
                 <span className="material-symbols-outlined text-tertiary">history</span> Mis Inversiones Activas
              </h2>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-surface-container-low">
                       <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Proyecto / Título</th>
                       <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Monto</th>
                       <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Estado Fondos</th>
                       <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Fecha</th>
                       <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right">Hash TX</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-outline-variant/10 text-sm">
                    {isLoading ? (
                       <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant opacity-50 italic">Cargando transacciones de la bóveda...</td></tr>
                    ) : inversiones.length === 0 ? (
                       <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant opacity-50">No tienes inversiones activas aún. Ve al <Link href="/marketplace" className="text-primary font-bold hover:underline">Marketplace</Link> para empezar.</td></tr>
                    ) : (
                       inversiones.map(inv => (
                          <tr key={inv.id_inversion} className="hover:bg-surface-container-low/50 transition-colors">
                             <td className="px-6 py-4 font-bold text-primary">{inv.titulo}</td>
                             <td className="px-6 py-4 font-bold">${Number(inv.monto_invertido).toLocaleString()}</td>
                             <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${inv.estado_fondos === 'retenido_escrow' ? 'bg-success-container text-success border border-success/30' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                   {inv.estado_fondos.replace('_', ' ')}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{new Date(inv.ejecutado_en).toLocaleDateString()}</td>
                             <td className="px-6 py-4 text-right">
                                <code className="text-[10px] bg-surface-container-low px-2 py-1 rounded text-primary font-mono">{inv.hash_transaccion.substring(0, 10)}...</code>
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
}
