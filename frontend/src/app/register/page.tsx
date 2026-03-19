export default function RegisterSelectorPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary/5 rounded-full blur-3xl z-0"></div>

      <div className="w-full max-w-4xl z-10 animate-fade-in relative">
        <div className="text-center mb-12">
          <span className="material-symbols-outlined text-[48px] text-primary mb-4 drop-shadow-lg">gavel</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-headline tracking-tight">Únete a IslaInvest</h1>
          <p className="text-on-surface-variant mt-4 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Selecciona el tipo de cuenta que mejor se adapte a tu perfil. Cumplimos con normativas estrictas de KYC / AML para garantizar 100% de seguridad en nuestro ecosistema.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card: Inversor Regular */}
          <a href="/register/investor" className="group bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute right-[-20%] top-[-20%] w-[100%] h-[100%] bg-gradient-to-br from-primary/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <span className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-6 inline-block">Comprador / Inversor</span>
              <h2 className="text-2xl font-bold text-primary font-headline mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[28px]">person</span> Cuenta Personal
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Adquiere propiedades, reserva intenciones de compra (Leads) y obtén acceso total al mercado inmobiliario curado por Inteligencia Artificial.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col gap-3 relative z-10">
              <span className="flex items-center gap-2 text-xs font-bold text-on-surface-variant"><span className="material-symbols-outlined text-[16px] text-primary">fingerprint</span> Autenticación Biométrica (Face ID)</span>
              <span className="flex items-center gap-2 text-xs font-bold text-on-surface-variant"><span className="material-symbols-outlined text-[16px] text-primary">contact_mail</span> Verificación de Identidad (ID)</span>
            </div>
            
            <div className="absolute right-6 bottom-6 material-symbols-outlined text-outline-variant/30 text-5xl group-hover:text-primary transition-colors group-hover:translate-x-2">arrow_forward</div>
          </a>

          {/* Card: Empresa / Creador */}
          <a href="/register/business" className="group bg-primary text-on-primary rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute right-0 top-0 w-[50%] h-[100%] bg-gradient-to-l from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <span className="bg-secondary-fixed/20 text-secondary-fixed text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-6 inline-block border border-secondary-fixed/50">Empresa / Real Estate</span>
              <h2 className="text-2xl font-bold text-white font-headline mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed text-[28px]">domain</span> Hub Corporativo
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Registra tu desarrolladora, agencia inmobiliaria o entidad fiduciaria. Publica proyectos estructurados y recibe Leads de compradores pre-calificados globales.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 flex flex-col gap-3 relative z-10">
              <span className="flex items-center gap-2 text-xs font-bold text-white/90"><span className="material-symbols-outlined text-[16px] text-secondary-fixed">shield_locked</span> Auditoría Anti-Lavado (RNC)</span>
              <span className="flex items-center gap-2 text-xs font-bold text-white/90"><span className="material-symbols-outlined text-[16px] text-secondary-fixed">assignment_ind</span> Verificación de Licencia de Corredor</span>
            </div>
            
            <div className="absolute right-6 bottom-6 material-symbols-outlined text-white/30 text-5xl group-hover:text-white transition-colors group-hover:translate-x-2">arrow_forward</div>
          </a>
        </div>
        
        <div className="text-center mt-10">
          <p className="text-sm text-on-surface-variant font-medium">¿Ya tienes una cuenta verificada? <a href="/login" className="text-primary font-bold hover:underline">Inicia Sesión</a></p>
        </div>
      </div>
    </div>
  );
}
