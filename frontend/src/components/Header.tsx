'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { lang, changeLang, t } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-outline-variant/20 h-20 flex items-center px-8 justify-between">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold text-primary font-headline">
          <Link href="/marketplace">IslaInvest</Link>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/marketplace" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-secondary-fixed transition-colors">Marketplace</Link>
          <Link href="/auditor" className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-secondary-fixed transition-colors">ROI Auditor</Link>
          <Link href="/finder" className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary-fixed hover:text-white transition-colors flex items-center gap-2">
            AI Finder <span className="w-2 h-2 bg-secondary-fixed rounded-full animate-pulse"></span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-outline-variant/10">
            <span className="material-symbols-outlined text-sm">language</span>
            {lang}
          </button>
          <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-2xl border border-outline-variant/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 space-y-1">
            {['es', 'en', 'fr', 'it', 'zh', 'pt'].map((l) => (
              <button 
                key={l} 
                onClick={() => changeLang(l as any)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors ${lang === l ? 'text-primary bg-primary/5' : 'text-on-surface-variant'}`}
              >
                {l === 'es' ? 'Español' : l === 'en' ? 'English' : l === 'fr' ? 'Français' : l === 'it' ? 'Italiano' : l === 'zh' ? '中文' : 'Português'}
              </button>
            ))}
          </div>
        </div>

        <Link href="/profile" className="w-10 h-10 bg-primary/5 text-primary rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined">person</span>
        </Link>
        
        <button onClick={handleLogout} className="text-on-surface-variant hover:text-red-500 transition-colors">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  );
}
