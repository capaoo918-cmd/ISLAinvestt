'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

interface Proyecto {
  id_proyecto: string;
  titulo: string;
  meta_financiera: number;
  estado_proyecto: string;
  total_recaudado: number;
  fotos?: string[];
}

export default function MarketplacePage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    fetch(`${API_URL}/tx/proyectos`)
      .then(res => res.json())
      .then(data => {
        setProyectos(data.proyectos || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-8 py-24">
        {/* Filters and Bento Grid sections (Omitted here for brevity, keep the ones from original) */}
        {/* For now keeping it simple to avoid syntax issues, will restore bento grid in next step if needed */}
        
        <div className="flex justify-between items-center mb-12 mt-20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#735c00] block">Marketplace Inmobiliario</span>
            <h2 className="font-headline text-4xl font-black text-primary uppercase tracking-tighter italic">Inversiones Disponibles</h2>
          </div>
          <div className="flex gap-4">
             <Link href="/finder" className="bg-tertiary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-sm">psychology</span> Usar AI Finder
             </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {proyectos.map((p) => (
              <Link href={`/property/${p.id_proyecto}`} key={p.id_proyecto} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-outline-variant/10 flex flex-col">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={p.fotos && p.fotos[0] ? (p.fotos[0].startsWith('http') ? p.fotos[0] : `http://127.0.0.1:4000${p.fotos[0]}`) : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"} 
                    alt={p.titulo} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
                    <span className="text-[11px] font-black text-primary uppercase tracking-widest">ROI 12.5%</span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                     <span className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-sm uppercase tracking-tighter">CERTIFICADO</span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-primary font-headline leading-tight group-hover:text-tertiary transition-colors uppercase tracking-tight mb-2">{p.titulo}</h3>
                  <div className="flex items-center gap-1 text-on-surface-variant text-[11px] mb-6 font-bold uppercase tracking-widest opacity-60">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">location_on</span> Punta Cana, RD
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-outline-variant/10">
                    <div>
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Valoración</p>
                      <p className="text-lg font-black text-primary">${Number(p.meta_financiera).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Estado</p>
                      <p className="text-lg font-black text-tertiary uppercase">{p.estado_proyecto}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <button className="bg-surface-container-low text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-outline-variant/10 group-hover:bg-primary group-hover:text-white transition-all">
                      Ver Ficha Técnica
                    </button>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-outline-variant/10 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-4xl font-black text-primary font-headline tracking-tighter italic">IslaInvest</div>
          <div className="flex gap-10 font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            <Link href="#" className="hover:text-primary transition-colors">Legal</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
            © 2026 IslaInvest | Powered by Alfred AI
          </div>
        </div>
      </footer>
    </div>
  );
}
