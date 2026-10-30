'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, ArrowLeft, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const t = useTranslations('LegalPages');
  const locale = useLocale();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    message: '',
    website: '' // Champ Honeypot (doit rester vide)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      alert("Veuillez patienter pendant la vérification anti-bot.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          turnstileToken
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          setTurnstileToken(null);
          setFormData({ name: '', email: '', message: '', website: '' });
        }, 3000);
      } else {
        alert("Erreur lors de l'envoi. Réessayez plus tard.");
      }
    } catch {
      alert("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans flex flex-col">
      <header className="p-6 border-b border-slate-800">
        <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour à l'annuaire
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">{t('contactTitle')}</h1>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto">{t('contactDesc')}</p>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-3 px-8 rounded-full transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          <Mail className="w-5 h-5" />
          {t('contactButton')}
        </button>
      </main>

      <Footer />

      {/* MODALE DE CONTACT */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-[#13141b] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" />
                Contactez-nous
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <div className="py-8 flex flex-col items-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Message envoyé !</h3>
                  <p className="text-slate-400 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* 🛡️ CHAMP HONEYPOT (Invisible pour les humains) */}
                  <div className="hidden" aria-hidden="true">
                    <input 
                      type="text" 
                      name="website" 
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      tabIndex={-1} 
                      autoComplete="off" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Votre nom</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Votre email</label>
                    <input 
                      required 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Votre message</label>
                    <textarea 
                      required 
                      rows={4}
                      value={formData.message} 
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none" 
                    />
                  </div>

                  {/* 🛡️ WIDGET CLOUDFLARE TURNSTILE */}
                  <div className="flex justify-center pt-2">
                    <Turnstile 
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} 
                      onSuccess={(token) => setTurnstileToken(token)}
                      onError={() => alert("Erreur lors du chargement du captcha.")}
                      onExpire={() => setTurnstileToken(null)}
                      options={{ theme: 'dark' }} // Pour que le captcha s'adapte au thème sombre
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || !turnstileToken}
                    className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</> : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}