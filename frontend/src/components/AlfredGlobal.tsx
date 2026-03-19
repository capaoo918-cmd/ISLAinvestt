'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AlfredGlobal() {
  const [isOpen, setIsOpen] = useState(false);
  const [userStatus, setUserStatus] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch(`${API_URL}/auth/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setUserStatus(data);
        if (data.estado_kyc !== 'aprobado') {
          setMessages([{
            role: 'assistant',
            content: 'Hola, soy Alfred. He notado que tu bóveda aún no está verificada. Para proteger tus inversiones, te recomiendo validar tu identidad ahora.',
            action: true
          }]);
        } else {
          setMessages([{
            role: 'assistant',
            content: 'Hola de nuevo. Tu cuenta está verificada y lista para operar. ¿En qué puedo ayudarte hoy?'
          }]);
        }
      });
    }
  }, []);

  if (pathname === '/login' || pathname === '/register' || pathname === '/verify') return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Alfred Bubble */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 border-4 border-white active:scale-95"
      >
        <span className="material-symbols-outlined text-3xl">smart_toy</span>
        {!isOpen && userStatus?.estado_kyc !== 'aprobado' && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-outline-variant/20 overflow-hidden animate-slide-up">
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">identity_platform</span>
              <span className="font-bold text-sm tracking-wide">ALFRED AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="material-symbols-outlined text-sm opacity-60">close</button>
          </div>
          
          <div className="p-4 h-64 overflow-y-auto space-y-4 bg-surface-container-low/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-on-surface-variant border border-outline-variant/10 rounded-tl-none'
                }`}>
                  {m.content}
                  {m.action && (
                    <button 
                      onClick={() => { setIsOpen(false); router.push('/verify'); }}
                      className="mt-3 w-full bg-tertiary text-white py-2 rounded-lg font-bold hover:bg-tertiary/90 transition-all uppercase tracking-tighter"
                    >
                      Validar Identidad Ahora
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-outline-variant/10 bg-white flex gap-2">
            <input 
              type="text" 
              placeholder="Pregunta a Alfred..." 
              className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
            />
            <button className="bg-primary text-white w-8 h-8 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
