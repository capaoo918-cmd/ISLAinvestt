'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'fr' | 'it' | 'zh' | 'pt';

const translations: Record<Language, any> = {
  es: {
    welcome: 'Bienvenido',
    marketplace: 'Marketplace',
    auditor: 'ROI Auditor',
    profile: 'Mi Bóveda',
    logout: 'Cerrar Sesión',
    verify_identity: 'Validar Identidad',
    search: 'Buscar Inversiones',
    property_details: 'Detalles de Propiedad',
    invest: 'Adquirir Token',
    high_roi: 'Alto Rendimiento',
  },
  en: {
    welcome: 'Welcome',
    marketplace: 'Marketplace',
    auditor: 'ROI Auditor',
    profile: 'My Vault',
    logout: 'Logout',
    verify_identity: 'Verify Identity',
    search: 'Search Investments',
    property_details: 'Property Details',
    invest: 'Acquire Token',
    high_roi: 'High ROI',
  },
  fr: {
    welcome: 'Bienvenue',
    marketplace: 'Marketplace',
    auditor: 'Auditeur ROI',
    profile: 'Mon Coffre',
    logout: 'Déconnexion',
    verify_identity: 'Vérifier l\'identité',
    search: 'Rechercher des investissements',
    property_details: 'Détails de la propriété',
    invest: 'Acquérir un jeton',
    high_roi: 'ROI élevé',
  },
  it: {
    welcome: 'Benvenuto',
    marketplace: 'Mercato',
    auditor: 'Audit ROI',
    profile: 'Mio Caveau',
    logout: 'Disconnettersi',
    verify_identity: 'Verifica identità',
    search: 'Cerca investimenti',
    property_details: 'Dettagli della proprietà',
    invest: 'Acquista Token',
    high_roi: 'Elevato ROI',
  },
  zh: {
    welcome: '欢迎',
    marketplace: '市场',
    auditor: '回报率审计员',
    profile: '我的金库',
    logout: '登出',
    verify_identity: '身份验证',
    search: '搜索投资',
    property_details: '物业详情',
    invest: '获取代币',
    high_roi: '高回报率',
  },
  pt: {
    welcome: 'Bem-vindo',
    marketplace: 'Marketplace',
    auditor: 'Auditor de ROI',
    profile: 'Meu Cofre',
    logout: 'Sair',
    verify_identity: 'Verificar Identidade',
    search: 'Buscar Investimentos',
    property_details: 'Detalhes da Propriedade',
    invest: 'Adquirir Token',
    high_roi: 'Alto ROI',
  }
};

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('es');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang) setLang(savedLang);
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
