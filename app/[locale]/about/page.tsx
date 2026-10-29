'use client';
import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { BrainCircuit, ArrowLeft } from 'lucide-react';
import Footer from '../../../components/Footer';

export default function AboutPage() {
  const t = useTranslations('LegalPages');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans flex flex-col">
      <header className="p-6 border-b border-slate-800">
        <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour à l'annuaire
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-6">
          <BrainCircuit className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">{t('aboutTitle')}</h1>
        </div>
        <p className="text-slate-400 leading-relaxed text-lg">{t('aboutDesc')}</p>
      </main>
      
      <Footer />
    </div>
  );
}