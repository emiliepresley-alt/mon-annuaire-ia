'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Type, Image as ImageIcon, Video, 
  Mic, PenTool, Code2, Megaphone, User, Settings, 
  Scale, GraduationCap, BrainCircuit, MessageSquareCode, 
  Database, Bot, ChevronRight, ChevronDown, ExternalLink, Loader2
} from 'lucide-react';
import SubmitToolModal from '../../components/SubmitToolModal';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import AdBanner from '../../components/AdBanner';
// --- 1. DÉFINITION DES DONNÉES ---
const categoriesUsage = [
  { id: 1, slug: "texte", icon: Type },
  { id: 2, slug: "image", icon: ImageIcon },
  { id: 3, slug: "video", icon: Video },
  { id: 4, slug: "audio", icon: Mic },
  { id: 5, slug: "design", icon: PenTool }
];

const categoriesMetier = [
  { id: 6, slug: "code", icon: Code2 },
  { id: 7, slug: "marketing", icon: Megaphone },
  { id: 8, slug: "support", icon: User },
  { id: 9, slug: "productivite", icon: Settings },
  { id: 10, slug: "finance", icon: Scale },
  { id: 11, slug: "education", icon: GraduationCap }
];

const categoriesTech = [
  { id: 12, slug: "llm", icon: BrainCircuit },
  { id: 13, slug: "prompt", icon: MessageSquareCode },
  { id: 14, slug: "data", icon: Database },
  { id: 15, slug: "agents", icon: Bot }
];

// --- 2. COMPOSANT CARTE ---
const CategoryCard = ({ item, colorTheme, realCount }) => {
  const Icon = item.icon;
  const t = useTranslations('Categories');
  const locale = useLocale(); 
  
  const themes = {
    purple: { text: "text-purple-300", icon: "text-purple-400", badge: "bg-purple-500/20 text-purple-300", hoverBorder: "hover:border-purple-500/50", marker: "marker:text-purple-500/50" },
    cyan: { text: "text-cyan-300", icon: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-300", hoverBorder: "hover:border-cyan-500/50", marker: "marker:text-cyan-500/50" },
    emerald: { text: "text-emerald-300", icon: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300", hoverBorder: "hover:border-emerald-500/50", marker: "marker:text-emerald-500/50" }
  };
  
  const theme = themes[colorTheme] || themes.purple;

  const descriptions = [
    t(`${item.slug}.desc1`), 
    t(`${item.slug}.desc2`), 
    t(`${item.slug}.desc3`)
  ].filter(Boolean); 

  return (
    <Link href={`/${locale}/categorie/${item.slug}`} className="block">
      <div className={`bg-[#1a1b23] border border-slate-700/50 rounded-xl p-4 transition-colors cursor-pointer group ${theme.hoverBorder}`}>
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex items-center gap-3 min-w-0"> 
            <Icon className={`w-5 h-5 shrink-0 ${theme.icon}`} /> 
            <h3 className={`font-semibold text-sm md:text-base leading-tight ${theme.text}`}>{t(`${item.slug}.title`)}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs py-1 px-2 rounded-full font-medium ${theme.badge}`}>
              {realCount || 0}
            </span>
            <ChevronRight className={`w-4 h-4 text-slate-500 group-hover:${theme.text}`} />
          </div>
        </div>
        <ul className={`text-xs text-slate-400 space-y-1 ml-6 list-disc ${theme.marker}`}>
          {descriptions.map((line, index) => (
            <li key={index} className="leading-relaxed">{line}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
};

// --- 3. PAGE PRINCIPALE ---
export default function AnnuaireDesktop() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale(); // <-- On récupère la langue actuelle
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counts, setCounts] = useState({});
  const [recentTools, setRecentTools] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(/^\/(fr|en)/, `/${newLocale}`);
    router.push(newPath);
  };

  // --- RÉCUPÉRATION SUPABASE ---
  useEffect(() => {
    const fetchData = async () => {
      // On filtre par langue (locale actuelle ou 'both')
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved')
        .in('language', [locale, 'both']) 
        .order('created_at', { ascending: false });

      if (data) {
        const calculatedCounts = {};
        
        // On boucle sur chaque outil
        data.forEach(tool => {
          // On vérifie si l'outil a des catégories (tableau)
          if (tool.categories && Array.isArray(tool.categories)) {
            tool.categories.forEach(cat => {
              calculatedCounts[cat] = (calculatedCounts[cat] || 0) + 1;
            });
          }
        });
        
        setCounts(calculatedCounts);
        setRecentTools(data.slice(0, 3));
      }
      setIsLoadingData(false);
    };

    fetchData();
  }, [isModalOpen, locale]); // Ajout de locale dans les dépendances

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row items-center justify-between p-4 border-b border-slate-800 sticky top-0 bg-[#0b0c10]/90 backdrop-blur-md z-50 gap-4">
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shrink-0">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {t('Header.title')}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">{t('Header.subtitle')}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          
          {/* SÉLECTEUR DE LANGUE */}
          <div className="flex gap-2 mr-2">
            <button onClick={() => switchLanguage('fr')} className={`text-sm font-bold transition-colors ${pathname.startsWith('/fr') ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>FR</button>
            <span className="text-slate-600">|</span>
            <button onClick={() => switchLanguage('en')} className={`text-sm font-bold transition-colors ${pathname.startsWith('/en') ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>EN</button>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder={t('Header.searchPlaceholder')} 
              className="w-full bg-[#13141b] border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition-colors" 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            <Plus className="w-5 h-5" />
            {t('Header.submitButton')}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        
        {/* SIDEBAR FILTRES */}
        {/* SIDEBAR FILTRES */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <Filter className="w-5 h-5" />
              <h2 className="font-semibold text-lg">{t('Filters.title')}</h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">{t('Filters.subtitle')}</p>

            {/* FILTRE PRIX */}
            <div className="mb-6">
              <div className="flex items-center justify-between cursor-pointer mb-3">
                <h3 className="font-medium text-sm text-slate-200">{t('Filters.price')}</h3>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-2">
                {[
                  { value: 'Gratuit', label: t('Filters.prices.free') },
                  { value: 'Freemium', label: t('Filters.prices.freemium') },
                  { value: 'Payant', label: t('Filters.prices.paid') },
                  { value: 'Essai gratuit', label: t('Filters.prices.trial') },
                  { value: 'Open Source', label: t('Filters.prices.openSource') }
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500/20" />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* FILTRE ACCÈS */}
            <div>
              <div className="flex items-center justify-between cursor-pointer mb-3">
                <h3 className="font-medium text-sm text-slate-200">{t('Filters.access')}</h3>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-2">
                {[
                  { value: 'Extension Chrome', label: t('Filters.accessTypes.chrome') },
                  { value: 'Web App', label: t('Filters.accessTypes.web') },
                  { value: 'API', label: t('Filters.accessTypes.api') },
                  { value: 'Application Desktop/Mobile', label: t('Filters.accessTypes.desktop') }
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500/20" />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 👇 AJOUTEZ LA BANNIÈRE ICI 👇 */}
          <AdBanner />
          
        </aside>

        {/* COLONNES PRINCIPALES */}
        <div className="col-span-1 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* COLONNE 1 */}
          <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 shadow-lg h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg shrink-0">
                <ImageIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-white leading-tight">
                {t('Categories.usageTitle')}<br/>
                <span className="text-sm text-purple-400 font-normal">{t('Categories.usageSubtitle')}</span>
              </h2>
            </div>
            <div className="space-y-3">
              {categoriesUsage.map(item => (
                <CategoryCard key={item.id} item={item} colorTheme="purple" realCount={counts[item.slug]} />
              ))}
            </div>
          </div>

          {/* COLONNE 2 */}
          <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 shadow-lg h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg shrink-0">
                <Settings className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-white leading-tight">{t('Categories.metierTitle')}</h2>
            </div>
            <div className="space-y-3">
              {categoriesMetier.map(item => (
                <CategoryCard key={item.id} item={item} colorTheme="cyan" realCount={counts[item.slug]} />
              ))}
            </div>
          </div>

          {/* COLONNE 3 */}
          <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 shadow-lg h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0">
                <Database className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-white leading-tight">{t('Categories.techTitle')}</h2>
            </div>
            <div className="space-y-3">
              {categoriesTech.map(item => (
                <CategoryCard key={item.id} item={item} colorTheme="emerald" realCount={counts[item.slug]} />
              ))}
            </div>
          </div>

        </div>

        {/* DERNIERS AJOUTS */}
        <div className="col-span-1 lg:col-span-12 mt-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-slate-800 flex-1"></div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 text-center">
              {t('Recent.title')}
            </h2>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          {isLoadingData ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
          ) : recentTools.length === 0 ? (
            <p className="text-center text-slate-500 py-10">{t('Recent.noTools')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTools.map(tool => (
                <div key={tool.id} className="bg-[#13141b] border border-slate-700/50 rounded-xl p-5 hover:border-purple-500/50 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-bold text-lg text-white leading-tight">{tool.name}</h3>
                      <span className="text-xs bg-slate-800 text-slate-300 py-1 px-2 rounded border border-slate-700 shrink-0">{tool.pricing}</span>
                    </div>
                    {/* Affichage conditionnel de la description selon la langue */}
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {locale === 'fr' 
                        ? (tool.description_fr || tool.description_en) 
                        : (tool.description_en || tool.description_fr)}
                    </p>
                  </div>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 w-fit">
                    {t('Recent.visit')} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <SubmitToolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}