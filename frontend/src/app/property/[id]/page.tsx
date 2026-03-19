'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PropertyDetails() {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFotoIndex, setCurrentFotoIndex] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    // Fetch project
    fetch(`${API_URL}/tx/proyectos/${id}`)
      .then(res => res.json())
      .then(data => {
        setProyecto(data.proyecto);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs">Analizando Activo...</p>
        </div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">location_off</span>
        <h1 className="text-2xl font-bold text-primary mb-2">Propiedad no encontrada</h1>
        <p className="text-on-surface-variant mb-6">El activo que buscas no está disponible o ha sido retirado del marketplace.</p>
        <Link href="/marketplace" className="bg-primary text-white px-8 py-3 rounded font-bold uppercase tracking-widest text-sm">Volver al Marketplace</Link>
      </div>
    );
  }

  const fotos = proyecto.fotos && proyecto.fotos.length > 0 ? proyecto.fotos : ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'];
  const BASE_BACKEND_URL = API_URL.replace('/api', '');

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Multimedia Header: Carousel */}
      <div className="h-[60vh] bg-black relative group overflow-hidden">
        <img 
          src={fotos[currentFotoIndex].startsWith('http') || fotos[currentFotoIndex].startsWith('/') ? fotos[currentFotoIndex] : `${BASE_BACKEND_URL}${fotos[currentFotoIndex]}`} 
          className="w-full h-full object-cover opacity-90 transition-all duration-700 scale-105 group-hover:scale-100" 
          alt={proyecto.titulo} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Carousel Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setCurrentFotoIndex((prev) => (prev > 0 ? prev - 1 : fotos.length - 1))}
            className="w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            onClick={() => setCurrentFotoIndex((prev) => (prev < fotos.length - 1 ? prev + 1 : 0))}
            className="w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Thumbnail Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
          {fotos.map((_: any, i: number) => (
            <button 
              key={i} 
              onClick={() => setCurrentFotoIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === currentFotoIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
            ></button>
          ))}
        </div>

        <div className="absolute top-8 left-8 z-10">
          <Link href="/marketplace" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all border border-white/20 text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Volver
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-outline-variant/10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/10">ID: {proyecto.id_proyecto.slice(0,8)}</span>
                    <span className="bg-tertiary-fixed text-tertiary text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-tertiary/20">ESTADO: {proyecto.estado_proyecto}</span>
                  </div>
                  <h1 className="text-5xl font-black font-headline text-primary leading-tight uppercase tracking-tighter">{proyecto.titulo}</h1>
                  <p className="text-on-surface-variant font-medium flex items-center gap-2 mt-4 text-lg">
                    <span className="material-symbols-outlined text-tertiary text-2xl">location_on</span> Punta Cana, República Dominicana
                  </p>
                </div>
              </div>

              {/* Technical Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-outline-variant/20 mb-10">
                <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                  <span className="material-symbols-outlined text-primary mb-2">straighten</span>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">Área Total</span>
                  <span className="text-xl font-black text-primary">{proyecto.metraje} m²</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                  <span className="material-symbols-outlined text-primary mb-2">bed</span>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">Habitaciones</span>
                  <span className="text-xl font-black text-primary">{proyecto.habitaciones}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                  <span className="material-symbols-outlined text-primary mb-2">bathtub</span>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">Baños</span>
                  <span className="text-xl font-black text-primary">{proyecto.banos}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                  <span className="material-symbols-outlined text-primary mb-2">chair</span>
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">Salas</span>
                  <span className="text-xl font-black text-primary">{proyecto.salas}</span>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="font-black text-primary uppercase tracking-tighter text-2xl mb-6">Descripción del Activo</h3>
                  <p className="text-on-surface-variant leading-loose text-lg font-light">
                    {proyecto.titulo} representa la cúspide del diseño caribeño moderno. Esta propiedad ha sido meticulosamente diseñada para maximizar el flujo de aire natural y la iluminación tropical. Con acabados de mármol importado, carpintería en roble brasileño y ventanales de doble panel, ofrece un refugio de paz y lujo sin igual. 
                    {proyecto.patio && " Cuenta con un patio privado paisajista diseñado por expertos botánicos dominicanos."}
                    {proyecto.piscina && " La piscina de borde infinito ofrece vistas panorámicas y sistemas de purificación de sal."}
                  </p>
                </div>

                {/* Amenities Section */}
                <div>
                  <h3 className="font-black text-primary uppercase tracking-tighter text-2xl mb-8">Amenidades de Lujo</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {proyecto.amenidades?.map((amenidad: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all hover:bg-primary/5 group">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-xl">
                            {amenidad === 'Gimnasio' ? 'fitness_center' : 
                             amenidad === 'Seguridad 24/7' ? 'security' : 
                             amenidad === 'Gazebo' ? 'deck' : 
                             amenidad === 'Área Infantil' ? 'child_care' :
                             amenidad === 'Cámaras de Vigilancia' ? 'videocam' :
                             amenidad === 'Parqueo Techado' ? 'garage' :
                             amenidad === 'Ascensor' ? 'elevator' :
                             amenidad === 'Planta Eléctrica Full' ? 'bolt' :
                             amenidad === 'Pozo de Agua' ? 'water' : 'stars'}
                          </span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary">{amenidad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Context */}
          <div className="space-y-8">
            <div className="bg-primary text-on-primary rounded-3xl shadow-2xl p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary-fixed mb-4">Valor Estimado del Activo</h3>
              <div className="text-5xl font-black font-headline mb-4 tracking-tighter">${Number(proyecto.meta_financiera).toLocaleString()} USD</div>
              <p className="text-xs opacity-70 leading-relaxed mb-8">Este valor representa la tasación actual de mercado basada en comparables directos en la zona de Punta Cana y Cap Cana.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold border-b border-white/10 pb-4">
                  <span className="opacity-60 uppercase">Rentabilidad Esperada</span>
                  <span className="text-secondary-fixed text-lg">12.5% ANUAL</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold border-b border-white/10 pb-4">
                  <span className="opacity-60 uppercase">Plusvalía Proyectada</span>
                  <span className="text-secondary-fixed text-lg">8.2%</span>
                </div>
              </div>

              <button className="w-full bg-white text-primary py-5 rounded-2xl font-black text-sm uppercase tracking-widest mt-10 hover:bg-secondary-fixed transition-all shadow-xl active:scale-95">
                Solicitar Dossier Técnico
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-outline-variant/10 shadow-lg">
              <h4 className="font-black text-primary text-xs uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">verified_user</span> Certificaciones IslaInvest
              </h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 bg-surface-container-low rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">description</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-widest">Auditoría ROI 2026</h5>
                    <p className="text-[10px] text-on-surface-variant font-medium">Validación técnica realizada por firmas externas.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                   <div className="w-8 h-8 bg-surface-container-low rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">gavel</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-widest">Estructura Fideicomiso</h5>
                    <p className="text-[10px] text-on-surface-variant font-medium">Activo blindado legalmente bajo ley 189-11.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
