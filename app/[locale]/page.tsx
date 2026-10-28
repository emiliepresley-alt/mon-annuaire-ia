'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Filter, Type, Image as ImageIcon, Video, 
  Mic, PenTool, Code2, Megaphone, User, Settings, 
  Scale, GraduationCap, BrainCircuit, MessageSquareCode, 
  Database, Bot, ChevronRight, ChevronDown, ExternalLink, Loader2, X
} from 'lucide-react';
import SubmitToolModal from '../../components/SubmitToolModal';
import AdBanner from '../../components/AdBanner';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

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
  const tFilters = useTranslations('Filters');
  const tTags = useTranslations('Tags');
  const locale = useLocale(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [allTools, setAllTools] = useState([]);
  const [counts, setCounts] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilters, setPriceFilters] = useState([]);
  const [accessFilters, setAccessFilters] = useState([]);

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(/^\/(fr|en)/, `/${newLocale}`);
    router.push(newPath);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved')
        .in('language', [locale, 'both']) 
        .order('created_at', { ascending: false });

      if (data) {
        setAllTools(data);
        
        const calculatedCounts = {};
        data.forEach(tool => {
          if (tool.categories && Array.isArray(tool.categories)) {
            tool.categories.forEach(cat => {
              calculatedCounts[cat] = (calculatedCounts[cat] || 0) + 1;
            });
          }
        });
        setCounts(calculatedCounts);
      }
      setIsLoadingData(false);
    };

    fetchData();
  }, [isModalOpen, locale]);

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const descFr = tool.description_fr || "";
      const descEn = tool.description_en || "";
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            descFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            descEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = priceFilters.length === 0 || priceFilters.includes(tool.pricing);
      return matchesSearch && matchesPrice;
    });
  }, [allTools, priceFilters, searchQuery]);

  const isSearching = searchQuery.length > 0 || priceFilters.length > 0;

  const toggleFilter = (value, state, setState) => {
    setState(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPriceFilters([]);
    setAccessFilters([]);
  };

  const getPricingLabel = (pricing: string) => {
    switch (pricing) {
      case 'Gratuit': return tFilters('prices.free');
      case 'Freemium': return tFilters('prices.freemium');
      case 'Payant': return tFilters('prices.paid');
      case 'Open Source': return tFilters('prices.openSource');
      default: return pricing;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans selection:bg-purple-500/30">
      
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
          <div className="flex gap-2 mr-2">
            <button onClick={() => switchLanguage('fr')} className={`text-sm font-bold transition-colors ${pathname.startsWith('/fr') ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>FR</button>
            <span className="text-slate-600">|</span>
            <button onClick={() => switchLanguage('en')} className={`text-sm font-bold transition-colors ${pathname.startsWith('/en') ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>EN</button>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Header.searchPlaceholder')} 
              className="w-full bg-[#13141b] border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition-colors" 
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Link 
            href={`/${locale}/tools`}
            className="w-full sm:w-auto bg-[#13141b] border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-medium py-2 px-6 rounded-full flex items-center justify-center gap-2 transition-all"
          >
            {t('Header.allToolsButton')}
          </Link>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            <Plus className="w-5 h-5" />
            {t('Header.submitButton')}
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                {/* 👇 BANNIÈRE FEATURED (Prend toute la largeur) 👇 */}
        <div className="col-span-1 lg:col-span-12 mb-2">
          <div className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-purple-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Vous êtes un créateur d'outil IA ?</h2>
              <p className="text-sm text-slate-300">Soumettez votre outil et obtenez un badge pour votre site.</p>
            </div>
            <Link 
              href={`/${locale}/featured`}
              className="bg-white text-[#0b0c10] font-bold py-2 px-6 rounded-full hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              En savoir plus
            </Link>
          </div>
        </div>
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 text-cyan-400">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <h2 className="font-semibold text-lg">{tFilters('title')}</h2>
              </div>
              {(priceFilters.length > 0 || searchQuery) && (
                <button onClick={resetFilters} className="text-xs text-slate-400 hover:text-white border border-slate-700 px-2 py-1 rounded">
                  Reset
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-6">{tFilters('subtitle')}</p>

            <div className="mb-6">
              <div className="flex items-center justify-between cursor-pointer mb-3">
                <h3 className="font-medium text-sm text-slate-200">{tFilters('price')}</h3>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-2">
                {[
                  { value: 'Gratuit', label: tFilters('prices.free') },
                  { value: 'Freemium', label: tFilters('prices.freemium') },
                  { value: 'Payant', label: tFilters('prices.paid') },
                  { value: 'Open Source', label: tFilters('prices.openSource') }
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={priceFilters.includes(item.value)}
                      onChange={() => toggleFilter(item.value, priceFilters, setPriceFilters)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500/20" 
                    />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between cursor-pointer mb-3">
                <h3 className="font-medium text-sm text-slate-200">{tFilters('access')}</h3>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-2 opacity-50 pointer-events-none">
                {['Web App', 'API', 'Extension Chrome', 'Desktop/Mobile'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-500" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <AdBanner />
        </aside>

        <div className="col-span-1 lg:col-span-9">
          
          {isSearching ? (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                {filteredTools.length} résultat(s) trouvé(s)
              </h2>
              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map(tool => (
                    <div key={tool.id} className="bg-[#13141b] border border-slate-700/50 rounded-xl p-5 hover:border-purple-500/50 transition-colors flex flex-col">
                      <div className="flex justify-between items-start mb-3 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden shrink-0 relative">
                            <span className="font-bold text-lg text-purple-400 absolute">{tool.name.charAt(0)}</span>
                            <img 
                              src={`https://logo.clearbit.com/${new URL(tool.url).hostname}`} 
                              alt={tool.name}
                              className="w-full h-full object-cover relative z-10 bg-[#13141b]"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </div>
                          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                            <h3 className="font-bold text-lg text-white leading-tight truncate">{tool.name}</h3>
                          </a>
                        </div>
                        <span className="text-xs bg-slate-800 text-slate-300 py-1 px-2 rounded border border-slate-700 shrink-0">{getPricingLabel(tool.pricing)}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                        {locale === 'fr' ? (tool.description_fr || tool.description_en) : (tool.description_en || tool.description_fr)}
                      </p>
                      
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-auto">
                          {tool.tags.map(tag => (
                            <Link 
                              key={tag} 
                              href={`/${locale}/tag/${tag}`}
                              className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
                            >
                              {tTags(tag)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-[#13141b] border border-slate-800 rounded-2xl">
                  <p className="text-slate-400">Aucun outil ne correspond à votre recherche.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 shadow-lg h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg shrink-0"><ImageIcon className="w-6 h-6 text-purple-400" /></div>
                    <h2 className="text-lg lg:text-xl font-bold text-white leading-tight">{t('Categories.usageTitle')}<br/><span className="text-sm text-purple-400 font-normal">{t('Categories.usageSubtitle')}</span></h2>
                  </div>
                  <div className="space-y-3">
                    {categoriesUsage.map(item => <CategoryCard key={item.id} item={item} colorTheme="purple" realCount={counts[item.slug]} />)}
                  </div>
                </div>

                <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 shadow-lg h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-cyan-500/20 rounded-lg shrink-0"><Settings className="w-6 h-6 text-cyan-400" /></div>
                    <h2 className="text-lg lg:text-xl font-bold text-white leading-tight">{t('Categories.metierTitle')}</h2>
                  </div>
                  <div className="space-y-3">
                    {categoriesMetier.map(item => <CategoryCard key={item.id} item={item} colorTheme="cyan" realCount={counts[item.slug]} />)}
                  </div>
                </div>

                <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 shadow-lg h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0"><Database className="w-6 h-6 text-emerald-400" /></div>
                    <h2 className="text-lg lg:text-xl font-bold text-white leading-tight">{t('Categories.techTitle')}</h2>
                  </div>
                  <div className="space-y-3">
                    {categoriesTech.map(item => <CategoryCard key={item.id} item={item} colorTheme="emerald" realCount={counts[item.slug]} />)}
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-slate-800 flex-1"></div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 text-center">{t('Recent.title')}</h2>
                  <div className="h-px bg-slate-800 flex-1"></div>
                </div>
                {isLoadingData ? (
                  <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allTools.slice(0, 3).map(tool => (
                      <div key={tool.id} className="bg-[#13141b] border border-slate-700/50 rounded-xl p-5 hover:border-purple-500/50 transition-colors flex flex-col">
                        <div className="flex justify-between items-start mb-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden shrink-0 relative">
                              <span className="font-bold text-lg text-purple-400 absolute">{tool.name.charAt(0)}</span>
                              <img src={`https://logo.clearbit.com/${new URL(tool.url).hostname}`} alt={tool.name} className="w-full h-full object-cover relative z-10 bg-[#13141b]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </div>
                            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                              <h3 className="font-bold text-lg text-white leading-tight truncate">{tool.name}</h3>
                            </a>
                          </div>
                          <span className="text-xs bg-slate-800 text-slate-300 py-1 px-2 rounded border border-slate-700 shrink-0">{getPricingLabel(tool.pricing)}</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{locale === 'fr' ? (tool.description_fr || tool.description_en) : (tool.description_en || tool.description_fr)}</p>
                        
                        {tool.tags && tool.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-auto">
                            {tool.tags.map(tag => (
                              <Link key={tag} href={`/${locale}/tag/${tag}`} className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700 hover:bg-slate-700 transition-colors">
                                {tTags(tag)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <SubmitToolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}