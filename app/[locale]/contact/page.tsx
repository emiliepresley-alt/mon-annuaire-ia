'use client';
import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, ArrowLeft } from 'lucide-react';
import Footer from '../../../components/Footer';

export default function ContactPage() {
  const t = useTranslations('LegalPages');
  const locale = useLocale();

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
        
        <a 
          href="mailto:contact@aifreedirectory.com" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-3 px-8 rounded-full transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          <Mail className="w-5 h-5" />
          {t('contactButton')}
        </a>
      </main>

      <Footer />
    </div>
  );
}