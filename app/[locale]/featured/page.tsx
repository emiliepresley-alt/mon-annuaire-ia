'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Sparkles, ArrowRight, ShieldCheck, Link as LinkIcon, Eye, Check } from 'lucide-react';

export default function FeaturedPage() {
  const t = useTranslations('FeaturedPage');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  // Le code HTML du badge que les créateurs pourront copier
  const badgeCode = `<a href="https://www.aifreedirectory.com" target="_blank" rel="noopener"><img src="https://www.aifreedirectory.com/badge.png" alt="Featured on AI Free Directory" width="200" height="50" /></a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(badgeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* Header simple */}
      <header className="p-6 border-b border-slate-800">
        <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
          &larr; Retour à l'annuaire
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        
        {/* Section Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <Link 
            href={`/${locale}`} // On renvoie vers l'accueil, où la modale peut s'ouvrir
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] text-lg"
          >
            <Sparkles className="w-5 h-5" />
            {t('ctaButton')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {/* Section Avantages */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t('whyTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('why1Title')}</h3>
              <p className="text-sm text-slate-400">{t('why1Desc')}</p>
            </div>

            <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('why2Title')}</h3>
              <p className="text-sm text-slate-400">{t('why2Desc')}</p>
            </div>

            <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('why3Title')}</h3>
              <p className="text-sm text-slate-400">{t('why3Desc')}</p>
            </div>

          </div>
        </div>

        {/* Section Badge */}
        <div className="bg-[#13141b] border border-slate-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">{t('badgeTitle')}</h2>
              <p className="text-slate-400 mb-6">{t('badgeSubtitle')}</p>
              
              <div className="bg-[#0b0c10] border border-slate-700 rounded-xl p-4 mb-4 font-mono text-xs text-slate-300 overflow-x-auto">
                {badgeCode}
              </div>
              
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-6 rounded-lg transition-colors border border-slate-600"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                {copied ? t('badgeCopied') : t('badgeCopy')}
              </button>
            </div>

            {/* Aperçu visuel du badge */}
            <div className="flex-1 flex justify-center">
              <div className="bg-[#1a1b23] p-4 rounded-xl border border-slate-700 shadow-xl">
                <div className="flex items-center gap-3 bg-[#0b0c10] px-4 py-2 rounded-lg border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Featured on</p>
                    <p className="text-sm font-bold text-white leading-none">AI Free Directory</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}