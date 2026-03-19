'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Proyecto {
  id_proyecto: number;
  titulo: string;
  estado_proyecto: string;
  meta_financiera: number;
  total_recaudado_escrow: number;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ titulo: '', meta: '' });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

    fetch(`${API_URL}/tx/pizarron`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProyectos(data.proyectos || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setIsLoading(false);
      });
  }, [router]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    try {
      const res = await fetch(`${API_URL}/tx/crear_proyecto`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          titulo: newProject.titulo, 
          meta_financiera: Number(newProject.meta) 
        })
      });
      if (res.ok) {
        setShowNewProjectModal(false);
        // Refresh
        window.location.reload();
      }
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-on-primary p-6 flex flex-col gap-8">
        <div className="text-2xl font-bold font-headline tracking-tight border-b border-white/10 pb-4">IslaInvest <span className="text-[10px] bg-secondary-fixed text-primary px-2 py-0.5 rounded ml-1">B2B</span></div>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 bg-white/10 p-3 rounded-lg font-bold text-sm">
            <span className="material-symbols-outlined">analytics</span> Mi Panel B2B
          </Link>
          <Link href="/marketplace" className="flex items-center gap-3 p-3 rounded-lg font-medium text-sm hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">explore</span> Ver Marketplace
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10">
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest hover:text-secondary-fixed transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span> Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-primary tracking-tight">Hub de Desarrollador</h1>
            <p className="text-sm text-on-surface-variant font-medium">Gestiona tus proyectos y liquidez en Escrow.</p>
          </div>
          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span> Nuevo Proyecto
          </button>
        </header>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6">
           {isLoading ? (
              <div className="text-center py-20 opacity-50 italic">Cargando proyectos de la red...</div>
           ) : proyectos.length === 0 ? (
              <div className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-2xl p-20 text-center">
                 <span className="material-symbols-outlined text-6xl text-primary opacity-20 mb-4">domain_disabled</span>
                 <p className="font-bold text-primary mb-2">No tienes proyectos registrados</p>
                 <p className="text-xs text-on-surface-variant mb-6">Empieza a fondear tu visión inmobiliaria hoy mismo.</p>
                 <button onClick={() => setShowNewProjectModal(true)} className="text-primary font-bold hover:underline text-sm uppercase tracking-widest">Registrar Primer Proyecto</button>
              </div>
           ) : (
              proyectos.map(p => (
                 <div key={p.id_proyecto} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-extrabold font-headline text-primary tracking-tight">{p.titulo}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${p.estado_proyecto === 'activo' ? 'bg-success-container text-success border-success/30' : 'bg-surface-container-high text-on-surface-variant opacity-60'}`}>
                             {p.estado_proyecto === 'en_auditoria' ? 'Auditoría' : p.estado_proyecto}
                          </span>
                       </div>
                       <p className="text-xs text-on-surface-variant font-medium mb-4 italic">Fideicomiso: {p.titulo.split(' ')[0]}_Escrow_ID</p>
                       <div className="w-64">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                             <span>Progreso de Fondeo</span>
                             <span>{Math.round((p.total_recaudado_escrow / p.meta_financiera) * 100)}%</span>
                          </div>
                          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-primary transition-all duration-1000" 
                               style={{ width: `${Math.min((p.total_recaudado_escrow / p.meta_financiera) * 100, 100)}%` }}
                             ></div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex gap-8 text-center border-l border-outline-variant/20 pl-8">
                       <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Recaudado (Escrow)</p>
                          <p className="text-2xl font-extrabold text-primary font-headline">${Number(p.total_recaudado_escrow).toLocaleString()}</p>
                       </div>
                       <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Meta Financiera</p>
                          <p className="text-2xl font-extrabold text-primary font-headline opacity-50">${Number(p.meta_financiera).toLocaleString()}</p>
                       </div>
                    </div>

                    <div>
                       <button className="bg-surface-container-high text-primary px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">visibility</span> Gestionar
                       </button>
                    </div>
                 </div>
              ))
           )}
        </div>

        {/* New Project Modal (Simplified) */}
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-6">
             <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                <div className="bg-primary p-6 text-on-primary flex justify-between items-center">
                   <h2 className="font-headline font-bold text-xl">Registrar Proyecto</h2>
                   <button onClick={() => setShowNewProjectModal(false)} className="material-symbols-outlined">close</button>
                </div>
                <form onSubmit={handleCreateProject} className="p-8 space-y-6">
                   <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">Título del Proyecto</label>
                      <input 
                        type="text" 
                        required 
                        value={newProject.titulo}
                        onChange={e => setNewProject({...newProject, titulo: e.target.value})}
                        placeholder="Ej. Torre Blue Bay" 
                        className="w-full bg-surface border border-outline-variant/30 rounded p-3 text-sm focus:outline-none focus:border-primary" />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1">Meta a Recaudar ($ USD)</label>
                      <input 
                        type="number" 
                        required 
                        value={newProject.meta}
                        onChange={e => setNewProject({...newProject, meta: e.target.value})}
                        placeholder="500000" 
                        className="w-full bg-surface border border-outline-variant/30 rounded p-3 text-sm focus:outline-none focus:border-primary" />
                   </div>
                   <button type="submit" className="w-full bg-primary text-white py-4 rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-primary/90 transition-all flex justify-center items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">publish</span> ENVIAR A AUDITORÍA
                   </button>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
