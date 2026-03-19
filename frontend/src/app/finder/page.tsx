'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function InvestmentFinder() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    city: '',
    budget: 500000,
    rooms: 2,
    amenities: [] as string[]
  });
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const amenitiesList = ["Piscina", "Gimnasio", "Seguridad 24/7", "Patio", "Estacionamiento", "Cerca de Playa"];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Búsqueda inteligente asistida por Alfred
      const res = await fetch(`${API_URL}/tx/proyectos`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      const proyectos = data.proyectos || [];

      const filtered = proyectos.filter((p: any) => {
        return Number(p.meta_financiera) <= preferences.budget * 1.5;
      }).slice(0, 3);

      setResults(filtered);
      setTimeout(() => {
        setIsSearching(false);
        setStep(3);
      }, 1000);
    } catch (error) {
      console.error('Error in AI Finder:', error);
      setIsSearching(false);
      alert('Alfred encontró un error técnico al analizar el mercado. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <Header />
      
      <main className="max-w-4xl mx-auto pt-32 px-6">
        <div className="bg-white rounded-[40px] shadow-2xl p-12 border border-outline-variant/10 relative overflow-hidden">
          {/* AI Decorative Background */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          
          {step < 3 ? (
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-primary uppercase tracking-tighter leading-none">Investment Finder</h1>
                  <p className="text-xs font-bold text-tertiary uppercase tracking-widest mt-1">Asesoría Inteligente 2026</p>
                </div>
              </div>

              {step === 0 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold mb-6 text-primary">¿En qué ciudad o zona buscas tu próxima inversión?</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {['Punta Cana', 'Samaná', 'Cabarete', 'La Romana'].map(city => (
                      <button 
                        key={city}
                        onClick={() => { setPreferences({...preferences, city}); setStep(1); }}
                        className="p-6 rounded-2xl border border-outline-variant/20 hover:border-primary hover:bg-primary/5 transition-all text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold mb-6 text-primary">¿Cuál es tu rango de presupuesto estimado (USD)?</h2>
                  <input 
                    type="range" 
                    min="100000" 
                    max="2000000" 
                    step="50000"
                    value={preferences.budget}
                    onChange={(e) => setPreferences({...preferences, budget: Number(e.target.value)})}
                    className="w-full h-2 bg-surface-container-high rounded-full appearance-none accent-primary mb-4"
                  />
                  <div className="text-4xl font-black text-primary text-center mb-8">${preferences.budget.toLocaleString()} USD</div>
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
                  >
                    Siguiente Paso
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold mb-6 text-primary">¿Qué amenidades son imprescindibles para ti?</h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {amenitiesList.map(am => (
                      <button 
                        key={am}
                        onClick={() => {
                          const newAm = preferences.amenities.includes(am) 
                            ? preferences.amenities.filter(a => a !== am)
                            : [...preferences.amenities, am];
                          setPreferences({...preferences, amenities: newAm});
                        }}
                        className={`p-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                          preferences.amenities.includes(am) ? 'bg-primary text-white border-primary' : 'bg-white text-on-surface-variant border-outline-variant/20'
                        }`}
                      >
                        {am}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full bg-tertiary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-tertiary/90 transition-all flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ALFRED ESTÁ ANALIZANDO EL MERCADO...
                      </>
                    ) : 'ENCONTRAR MI PROPIEDAD IDEAL'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in relative z-10">
              <div className="text-center mb-12">
                <span className="material-symbols-outlined text-6xl text-tertiary mb-4 animate-bounce">verified_user</span>
                <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">¡Resultados Encontrados!</h2>
                <p className="text-on-surface-variant mt-2">Alfred ha seleccionado estas opciones basadas en tu perfil de inversión.</p>
              </div>

              <div className="space-y-6">
                {results.map((p: any) => (
                  <Link href={`/property/${p.id_proyecto}`} key={p.id_proyecto} className="flex gap-6 p-6 rounded-3xl border border-outline-variant/10 hover:shadow-xl transition-all hover:bg-surface-container-low group">
                    <img 
                      src={p.fotos && p.fotos[0] ? (p.fotos[0].startsWith('http') || p.fotos[0].startsWith('/') ? p.fotos[0] : `${API_URL.replace('/api', '')}${p.fotos[0]}`) : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"} 
                      className="w-40 h-40 object-cover rounded-2xl group-hover:scale-105 transition-transform" 
                      alt={p.titulo} 
                    />
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-black text-primary leading-tight mb-2 uppercase tracking-tighter">{p.titulo}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bed</span> {p.habitaciones} Hab</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">straighten</span> {p.metraje} m²</span>
                      </div>
                      <div className="mt-4 text-2xl font-black text-tertiary">${Number(p.meta_financiera).toLocaleString()} USD</div>
                    </div>
                  </Link>
                ))}
              </div>

              <button 
                onClick={() => setStep(0)}
                className="w-full mt-10 text-primary font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-70 transition-opacity"
              >
                <span className="material-symbols-outlined">restart_alt</span> Nueva Búsqueda
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
