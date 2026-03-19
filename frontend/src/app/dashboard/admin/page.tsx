'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface User {
  id_usuario: string;
  email: string;
  rol: string;
  estado_kyc: string;
  ultima_ip_acceso: string;
}

interface Project {
  id_proyecto: string;
  titulo: string;
  meta_financiera: string;
  email_promotor: string;
  estado_proyecto: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'kyc' | 'projects' | 'intelligence' | 'revenue'>('kyc');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [propStats, setPropStats] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [sales, setSales] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    
    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }

    loadData();
  }, [router, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      if (activeTab === 'kyc') {
        const res = await fetch(`${API_URL}/super/usuarios`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data.usuarios || []);
      } else if (activeTab === 'projects') {
        const res = await fetch(`${API_URL}/super/proyectos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setProjects(data.proyectos || []);
      } else if (activeTab === 'revenue') {
        const resSales = await fetch(`${API_URL}/intelligence/sales-audit`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataSales = await resSales.json();
        setSales(dataSales.ventas || []);

        const resRev = await fetch(`${API_URL}/intelligence/revenue`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataRev = await resRev.json();
        setRevenue(dataRev);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuditKyc = async (id: string, action: 'aprobar' | 'rechazar') => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API_URL}/super/usuarios/kyc/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ accion: action })
      });
      const data = await res.json();
      alert(data.mensaje || data.error);
      loadData();
    } catch (error) {
      alert('Error en la operación');
    }
  };

  const handleChangeProjectStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API_URL}/super/proyectos/estado/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ nuevo_estado: status })
      });
      const data = await res.json();
      alert(data.mensaje || data.error);
      loadData();
    } catch (error) {
      alert('Error en la operación');
    }
  };

  const handleGetAiInsight = async (type: 'strategy' | 'pitch') => {
    if (!propStats?.propiedad) return;
    setIsAiLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API_URL}/intelligence/ai-coach/insight`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ propertyData: propStats.propiedad, type })
      });
      const data = await res.json();
      setAiInsight(data.insight);
    } catch (error) {
      alert('Error en el motor de IA');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectProperty = async (id: string) => {
    setSelectedPropId(id);
    setIsLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API_URL}/intelligence/property-stats/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPropStats(data);
      setAiInsight('');
    } catch (error) {
      console.error('Error loading prop stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMoney = (m: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(m || '0'));

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Space Dust Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-20 animate-drift"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 20}s`,
              animationDelay: `${Math.random() * -20}s`,
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          25% { opacity: 0.3; }
          50% { transform: translate(100px, -100px) scale(1.5); opacity: 0.1; }
          75% { opacity: 0.3; }
          100% { transform: translate(200px, -200px) scale(1); opacity: 0; }
        }
        .animate-drift {
          animation: drift linear infinite;
        }
      `}</style>

      <Header />
      
      {/* Admin Top Banner */}
      <header className="h-16 bg-black/40 border-b border-white/10 flex justify-between items-center px-8 shrink-0 relative z-30 mt-16 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary-fixed text-[28px] animate-pulse">admin_panel_settings</span>
          <h1 className="text-xl font-black uppercase tracking-tighter">System Control <span className="text-secondary-fixed">God Mode</span></h1>
          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-widest ml-2">Live</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/marketplace')} className="text-xs text-white/60 hover:text-white transition-all flex items-center gap-2 font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">logout</span> Volver al Portal
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-black/20 border-r border-white/10 flex flex-col hidden md:flex shrink-0 p-6">
          <nav className="space-y-2">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-6">Privilegios Maestros</p>
            <button 
              onClick={() => setActiveTab('kyc')}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'kyc' ? 'bg-secondary-fixed text-primary' : 'hover:bg-white/5 text-white/60'}`}
            >
              <span className="material-symbols-outlined">how_to_reg</span> Control KYC
            </button>
            <button 
              onClick={() => setActiveTab('intelligence')}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'intelligence' ? 'bg-secondary-fixed text-primary' : 'hover:bg-white/5 text-white/60'}`}
            >
              <span className="material-symbols-outlined">insights</span> Inteligencia IA
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'projects' ? 'bg-secondary-fixed text-primary' : 'hover:bg-white/5 text-white/60'}`}
            >
              <span className="material-symbols-outlined">domain</span> Proyectos
            </button>
            <button 
              onClick={() => setActiveTab('revenue')}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'revenue' ? 'bg-secondary-fixed text-primary' : 'hover:bg-white/5 text-white/60'}`}
            >
              <span className="material-symbols-outlined">payments</span> Revenue & Ventas
            </button>
          </nav>

          <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Servidor Supabase</span>
            </div>
            <p className="text-[10px] font-bold text-secondary-fixed">Conectado (AWS-EAST-1)</p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-12 bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#1e1b4b] relative">
          
          {isLoading && (
            <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-50 flex justify-center items-center">
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-5xl text-secondary-fixed animate-spin">sync</span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-secondary-fixed">Sincronizando Archivos Maestros...</span>
              </div>
            </div>
          )}

          {activeTab === 'kyc' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Gestión Anti-Lavado de Dinero (AML)</h2>
                <p className="text-sm text-white/40">Auditoría centralizada de inversores y creadores en IslaInvest.</p>
              </div>

              <div className="bg-black/30 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/10">
                    <tr>
                      <th className="p-6">Usuario / Correo</th>
                      <th className="p-6">Rol de Bóveda</th>
                      <th className="p-6">Dirección IP</th>
                      <th className="p-6 text-center">Estatus KYC</th>
                      <th className="p-6 text-center">Acción Directa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map(u => (
                      <tr key={u.id_usuario} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6">
                          <div className="font-bold text-sm mb-1">{u.email}</div>
                          <div className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">ID: {u.id_usuario.split('-')[0]}</div>
                        </td>
                        <td className="p-6 text-xs font-black uppercase tracking-widest text-secondary-fixed">{u.rol}</td>
                        <td className="p-6 font-mono text-[10px] text-white/40">{u.ultima_ip_acceso || '0.0.0.0'}</td>
                        <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            u.estado_kyc === 'aprobado' ? 'bg-green-500/20 text-green-400' : 
                            u.estado_kyc === 'rechazado' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {u.estado_kyc}
                          </span>
                        </td>
                        <td className="p-6">
                            <div className="flex justify-center gap-3">
                                <button 
                                  onClick={() => handleAuditKyc(u.id_usuario, 'aprobar')}
                                  className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center border border-green-500/20"
                                >
                                  <span className="material-symbols-outlined">verified_user</span>
                                </button>
                                <button 
                                  onClick={() => handleAuditKyc(u.id_usuario, 'rechazar')}
                                  className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                                >
                                  <span className="material-symbols-outlined">block</span>
                                </button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'intelligence' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-secondary-fixed">Intelligence & Sales Coach</h2>
                  <p className="text-sm text-white/40">Estrategias proactivas motorizadas por OpenAI para el cierre de activos.</p>
                </div>
                
                {/* Universal Search */}
                <div className="w-96 relative">
                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">search</span>
                   <input 
                      type="text" 
                      placeholder="Localizar proyecto o lead..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-secondary-fixed transition-all"
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Selector de Propiedades */}
                <div className="lg:col-span-4 bg-black/30 rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Seleccionar Activo</h3>
                  <div className="space-y-3">
                    {projects.map(p => (
                      <button 
                        key={p.id_proyecto}
                        onClick={() => handleSelectProperty(p.id_proyecto)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedPropId === p.id_proyecto ? 'bg-secondary-fixed/20 border-secondary-fixed' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      >
                         <p className="text-xs font-black uppercase mb-1">{p.titulo}</p>
                         <p className="text-[10px] text-white/40 font-bold">{formatMoney(p.meta_financiera)}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inteligencia y Coach */}
                <div className="lg:col-span-8 space-y-8">
                  {propStats ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Vistas Únicas</p>
                          <p className="text-3xl font-black text-secondary-fixed">{propStats.vistas}</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Leads Activos</p>
                          <p className="text-3xl font-black text-secondary-fixed">{propStats.leads?.length || 0}</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Match Score Promedio</p>
                          <p className="text-3xl font-black text-tertiary">84%</p>
                        </div>
                      </div>

                      {/* AI Coach Panel */}
                      <div className="bg-[#1e1b4b] rounded-3xl border border-secondary-fixed/30 p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                          <span className="material-symbols-outlined text-[120px]">psychology</span>
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-secondary-fixed mb-6 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">smart_toy</span> AI Real Estate Coach
                        </h4>
                        
                        <div className="flex gap-4 mb-8">
                          <button 
                            onClick={() => handleGetAiInsight('strategy')}
                            className="bg-secondary-fixed text-primary px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                          >
                            Generar Táctica Venta
                          </button>
                          <button 
                            onClick={() => handleGetAiInsight('pitch')}
                            className="bg-white/10 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all"
                          >
                            Generar Pitch Email
                          </button>
                        </div>

                        <div className="bg-black/40 rounded-2xl p-6 min-h-[150px] border border-white/5 relative">
                          {isAiLoading ? (
                            <div className="flex items-center gap-3 text-secondary-fixed font-bold animate-pulse text-xs">
                              <span className="material-symbols-outlined animate-spin">autorenew</span> Alfred está analizando el mercado...
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                              {aiInsight || 'Selecciona una táctica para que el Coach analice la propiedad.'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Matchmaking List */}
                      <div className="bg-black/30 rounded-3xl border border-white/10 p-8">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Matchmaking de Usuarios</h4>
                         <div className="space-y-4">
                            {propStats.leads?.map((lead: any) => (
                              <div key={lead.id_usuario} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-secondary-fixed/50 transition-all">
                                <div>
                                  <p className="text-sm font-bold">{lead.email}</p>
                                  <p className="text-[10px] text-white/40 font-bold uppercase">Interés: {lead.score_interes}%</p>
                                </div>
                                <div className="text-right">
                                   <div className="text-tertiary text-xs font-black uppercase">Probabilidad Alta</div>
                                   <button className="text-[10px] font-black uppercase text-secondary-fixed hover:underline mt-1">Enviar Oferta</button>
                                </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col justify-center items-center text-white/20">
                       <span className="material-symbols-outlined text-[80px] mb-4">analytics</span>
                       <p className="font-black uppercase tracking-widest">Selecciona una propiedad para auditar inteligentemente</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'revenue' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-10">
                <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-tertiary">Bóveda de Ingresos (Revenue Analytics)</h2>
                <p className="text-sm text-white/40">Auditoría de comisiones, flujo de caja y estado legal del escrow.</p>
              </div>

              {revenue && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="bg-gradient-to-br from-green-500/20 to-transparent p-10 rounded-[40px] border border-green-500/20 relative overflow-hidden">
                      <p className="text-xs font-black uppercase tracking-widest text-green-400 mb-4">Comisiones Cobradas</p>
                      <p className="text-6xl font-black tracking-tighter">{formatMoney(revenue.cobrado)}</p>
                      <div className="absolute top-0 right-0 p-10 opacity-20">
                         <span className="material-symbols-outlined text-[100px] text-green-400">payments</span>
                      </div>
                   </div>

                   <div className="bg-gradient-to-br from-yellow-500/20 to-transparent p-10 rounded-[40px] border border-yellow-500/20 relative overflow-hidden">
                      <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-4">Proyección en Tránsito (Escrow)</p>
                      <p className="text-6xl font-black tracking-tighter">{formatMoney(revenue.en_transito)}</p>
                      <div className="absolute top-0 right-0 p-10 opacity-20">
                         <span className="material-symbols-outlined text-[100px] text-yellow-500">hourglass_empty</span>
                      </div>
                   </div>
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">analytics</span> Control Room de Ventas (Kanban)
                </h3>
                
                <div className="bg-black/30 rounded-3xl border border-white/10 p-8 backdrop-blur-xl">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/10">
                      <tr>
                        <th className="p-6">Propiedad</th>
                        <th className="p-6">Vendedor</th>
                        <th className="p-6 text-right">Comisión Plataforma</th>
                        <th className="p-6 text-center">Estado de Escrow</th>
                        <th className="p-6 text-center">Cierre Estimado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {sales.map((sale: any) => (
                        <tr key={sale.id_venta} className="hover:bg-white/5 transition-colors group">
                          <td className="p-6 text-sm font-bold">{sale.titulo}</td>
                          <td className="p-6 text-xs text-secondary-fixed font-black uppercase">{sale.id_vendedor?.split('-')[0]}</td>
                          <td className="p-4 text-right">
                             <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-lg font-black text-xs">
                                {formatMoney(sale.comision_plataforma)}
                             </span>
                          </td>
                          <td className="p-6 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                sale.estado_legal === 'completado' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' :
                                sale.estado_legal === 'escrow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                'bg-white/5 text-white/40'
                            }`}>
                               {sale.estado_legal}
                            </span>
                          </td>
                          <td className="p-6 text-center font-mono text-[10px] text-white/40">
                             {sale.fecha_cierre ? new Date(sale.fecha_cierre).toLocaleDateString() : 'Pendiente'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'projects' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Auditoría de Desarrollo (Escrow Legal)</h2>
                <p className="text-sm text-white/40">Control de fideicomisos y validación de fondos comunitarios.</p>
              </div>

              <div className="bg-black/30 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/10">
                    <tr>
                      <th className="p-6">Fideicomiso / Proyecto</th>
                      <th className="p-6 text-right">Meta (USD)</th>
                      <th className="p-6">Promotor Encargado</th>
                      <th className="p-6 text-center">Estado Legal</th>
                      <th className="p-6 text-center">Dictamen Final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {projects.map(p => (
                      <tr key={p.id_proyecto} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6 text-sm font-black uppercase tracking-tight">{p.titulo}</td>
                        <td className="p-6 text-right font-mono font-bold text-secondary-fixed">{formatMoney(p.meta_financiera)}</td>
                        <td className="p-6 text-xs text-white/60">{p.email_promotor}</td>
                        <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            p.estado_proyecto === 'activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {p.estado_proyecto.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <select 
                            onChange={(e) => handleChangeProjectStatus(p.id_proyecto, e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-secondary-fixed transition-all"
                          >
                            <option value="">Cambiar Dictamen...</option>
                            <option value="activo">Aprobar Proyecto</option>
                            <option value="cancelado">Cancelar Proyecto</option>
                            <option value="congelado_por_fraude">! ALERTA FRAUDE</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
