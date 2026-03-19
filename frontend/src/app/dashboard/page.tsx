'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardHub() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userRole = localStorage.getItem('user_role');
    
    if (!token) {
      router.push('/login');
    } else {
      setRole(userRole);
      // Redirección inteligente según el rol
      if (userRole === 'inversor') {
        router.push('/dashboard/investor');
      } else if (userRole === 'creador') {
        router.push('/dashboard/creator');
      } else if (userRole === 'admin') {
        router.push('/dashboard/admin');
      }
    }
  }, [router]);

  if (!role) return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center py-12 px-6 relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl z-0"></div>

      <div className="max-w-xl w-full text-center relative z-10 animate-slide-up">
        
        <div className="w-24 h-24 bg-success-container/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-[3px] border-success">
          <span className="material-symbols-outlined text-[48px] text-success">verified_user</span>
        </div>
        
        <h1 className="text-4xl font-extrabold text-primary font-headline tracking-tight mb-2">¡Autenticación Exitosa!</h1>
        <p className="text-on-surface-variant font-medium mb-8">
          Tu bóveda personal está activa y conectada mediante Tokens Criptográficos.
        </p>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#735c00] mb-4">Módulo Asignado: {role === 'creador' ? 'Hub B2B (Promotor)' : role === 'admin' ? 'Modo Dios (Auditor)' : 'Bóveda de Inversión (Lead)'}</h2>
          <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
            Hemos validado tu rol. Dado que el ecosistema se encuentra en transición al motor Next.js, por favor haz clic en tu consola correspondiente para gestionar la plataforma o cerrar sesión.
          </p>

          <div className="flex flex-col gap-4">
             {/* If role is 'inversor', show regular stuff, if 'creador', show creator things. */}
             {role === 'creador' && (
                <a href="http://127.0.0.1:5500/creator-dashboard.html" className="w-full bg-primary text-white py-4 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-primary/90 transition-all flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">domain</span> EJECUTAR CREADOR DASHBOARD
                </a>
             )}
             
             {role === 'admin' && (
                <a href="http://127.0.0.1:5500/superadmin-dashboard.html" className="w-full bg-error text-white py-4 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-error/90 transition-all flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span> EJECUTAR ROOT (ADMIN)
                </a>
             )}

             {role === 'inversor' && (
                <Link href="/marketplace" className="w-full bg-tertiary text-white py-4 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-tertiary/90 transition-all flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">explore</span> EXPLORAR PROPIEDADES (MARKETPLACE)
                </Link>
             )}
          </div>
        </div>

        <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="text-on-surface-variant text-xs font-bold flex items-center gap-2 justify-center mx-auto hover:text-error transition-colors uppercase tracking-widest">
           <span className="material-symbols-outlined text-[16px]">logout</span> Destruir Sesión Segura
        </button>

      </div>
    </div>
  );
}
