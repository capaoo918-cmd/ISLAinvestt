import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-fixed/10 rounded-full blur-3xl z-0"></div>

      <div className="w-full max-w-3xl z-10 text-center animate-slide-up">
        
        <span className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-6 inline-block border border-primary/20">IslaInvest Web App V2</span>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary font-headline tracking-tight mb-6 flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-secondary-fixed text-[64px] drop-shadow-md">account_balance</span> 
          El Hub Central
        </h1>
        
        <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
          La migración al nuevo ecosistema de Next.js está en marcha. Ya puedes explorar el **Marketplace en tiempo real**, gestionar tus inversiones desde la nueva **Bóveda Segura** y registrar proyectos con auditoría automatizada.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Link href="/login" className="bg-primary text-white py-4 px-6 rounded-lg font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-primary/90 hover:-translate-y-1 transition-all flex justify-center items-center gap-2 group">
             <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">vpn_key</span> Desbloquear Bóveda
          </Link>

          <Link href="/register" className="bg-surface-container-low text-primary border border-outline-variant/30 py-4 px-6 rounded-lg font-bold uppercase tracking-widest text-sm shadow-sm hover:bg-surface-container-highest hover:border-primary/50 hover:-translate-y-1 transition-all flex justify-center items-center gap-2 group">
             <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">how_to_reg</span> Abrir Cuenta
          </Link>
        </div>

      </div>
    </div>
  );
}
