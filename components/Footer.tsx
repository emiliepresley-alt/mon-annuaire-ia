'use client';
import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { BrainCircuit } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0c10] border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
                <BrainCircuit className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">AI Free Directory</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              {t('description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('navigation')}</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href={`/${locale}`} className="hover:text-purple-400 transition-colors">{t('home')}</Link></li>
              <li><Link href={`/${locale}/tools`} className="hover:text-purple-400 transition-colors">{t('allTools')}</Link></li>
              <li><Link href={`/${locale}/featured`} className="hover:text-purple-400 transition-colors">{t('featured')}</Link></li>
            </ul>
          </div>

          {/* Informations Légales */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {/* ⚠️ Vérifie que ces liens correspondent aux noms de tes dossiers ! */}
              <li><Link href={`/${locale}/about`} className="hover:text-purple-400 transition-colors">{t('about')}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="hover:text-purple-400 transition-colors">{t('privacy')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-purple-400 transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} AI Free Directory. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}