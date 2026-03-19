'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

export default function ROIAuditor() {
  const [price, setPrice] = useState(250000);
  const [downPct, setDownPct] = useState(40);
  const [adr, setAdr] = useState(180);
  const [occPct, setOccPct] = useState(65);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const cashInvested = price * (downPct / 100);
  const grossAnnual = adr * 365 * (occPct / 100);
  
  const propMgmt = grossAnnual * 0.20;
  const hoaUtils = 4800;
  const maint = grossAnnual * 0.05;
  const totalExpenses = propMgmt + hoaUtils + maint;

  const loanAmount = price - cashInvested;
  let annualMortgage = 0;
  if (loanAmount > 0) {
    const r = 0.07 / 12;
    const n = 20 * 12;
    const monthlyPayment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    annualMortgage = monthlyPayment * 12;
  }

  const netAnnual = grossAnnual - totalExpenses - annualMortgage;
  const cocYield = cashInvested > 0 ? (netAnnual / cashInvested) * 100 : 0;

  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <Header />

      <main className="pt-20">
        <section className="bg-primary text-on-primary pt-16 pb-32 px-8 text-center">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4">Real-Time ROI Auditor</h1>
            <p className="text-on-primary/80 max-w-2xl mx-auto text-lg">
              Calcula tu rendimiento neto exacto basado en datos históricos del área, factorizando gestión, HOA e incentivos CONFOTUR.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 -mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          
          {/* Controls */}
          <div className="lg:col-span-5 bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/10">
            <h2 className="text-xl font-bold text-primary mb-8 flex items-center gap-2 uppercase tracking-widest text-xs">
              <span className="material-symbols-outlined text-[20px]">tune</span> Parámetros de Inversión
            </h2>
            
            <div className="space-y-10">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Valor de Adquisición</label>
                  <span className="font-bold text-primary">{formatter.format(price)}</span>
                </div>
                <input type="range" min="100000" max="1500000" step="10000" value={price} onChange={e => setPrice(Number(e.target.value))} 
                       className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pago Inicial (%)</label>
                  <span className="font-bold text-primary">{downPct}%</span>
                </div>
                <input type="range" min="10" max="100" step="5" value={downPct} onChange={e => setDownPct(Number(e.target.value))} 
                       className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tarifa por Noche (ADR)</label>
                  <span className="font-bold text-primary">{formatter.format(adr)} / noche</span>
                </div>
                <input type="range" min="50" max="1000" step="10" value={adr} onChange={e => setAdr(Number(e.target.value))} 
                       className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ocupación Esperada</label>
                  <span className="font-bold text-primary">{occPct}%</span>
                </div>
                <input type="range" min="20" max="95" step="5" value={occPct} onChange={e => setOccPct(Number(e.target.value))} 
                       className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" />
              </div>

              <div className="bg-tertiary/5 p-4 rounded-xl border border-tertiary/10 flex gap-3">
                <span className="material-symbols-outlined text-tertiary">verified</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Incentivos CONFOTUR (0% transferencia y IPI) se aplican automáticamente a propiedades calificadas.</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary text-on-primary p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                <span className="text-[10px] font-bold tracking-widest text-primary-fixed uppercase block mb-2 opacity-70">Rendimiento CoC Proyectado</span>
                <div className="text-5xl font-black mb-1 font-headline">{cocYield.toFixed(1)}%</div>
                <p className="text-xs opacity-60">Retorno Anual sobre Efectivo</p>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] opacity-60 block uppercase font-bold mb-1">Flujo de Caja Neto</span>
                    <span className="font-bold text-2xl">{formatter.format(netAnnual)}</span>
                  </div>
                  <span className="material-symbols-outlined text-4xl opacity-20">trending_up</span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/10">
                <span className="text-[10px] font-bold tracking-widest text-secondary uppercase block mb-2">Ingresos Brutos Anuales</span>
                <div className="text-3xl font-bold text-primary mb-1">{formatter.format(grossAnnual)}</div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Gestión (20%)</span>
                    <span className="font-bold text-red-500">-{formatter.format(propMgmt)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">HOA & Servicios</span>
                    <span className="font-bold text-red-500">-{formatter.format(hoaUtils)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-primary pt-2 border-t border-outline-variant/10">
                    <span>Flujo Operativo</span>
                    <span>{formatter.format(grossAnnual - propMgmt - hoaUtils - maint)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/10">
              <h3 className="font-bold text-primary text-xs uppercase tracking-widest mb-8">Desglose de Flujo de Caja Mensual</h3>
              <div className="h-48 flex items-end gap-6 border-b border-outline-variant/20 pb-4">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-secondary-fixed rounded-t-lg transition-all duration-500" style={{ height: '100%' }}></div>
                  <span className="text-[9px] font-bold uppercase mt-3">Bruto</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-red-400 rounded-t-lg transition-all duration-500" style={{ height: `${(totalExpenses / grossAnnual) * 100}%` }}></div>
                  <span className="text-[9px] font-bold uppercase mt-3">Gastos</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-tertiary-fixed-dim rounded-t-lg transition-all duration-500" style={{ height: `${(netAnnual / grossAnnual) * 100}%` }}></div>
                  <span className="text-[9px] font-bold uppercase mt-3">Neto</span>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
