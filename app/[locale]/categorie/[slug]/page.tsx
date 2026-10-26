'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Filter, ExternalLink, 
  BrainCircuit, ChevronRight, Check, SlidersHorizontal, Loader2 
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useTranslations, useLocale } from 'next-intl';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string; 

  const t = useTranslations('CategoryPage');
  const tCat = useTranslations('Categories');
  const tFilters = useTranslations('Filters'); 
  const tTags = useTranslations('Tags'); // <-- AJOUTE CETTE LIGNE
  const locale = useLocale(); 
  
  const categoryTitle = tCat(`${slug}.title`);

  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [priceFilters, setPriceFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved')
        .contains('categories', [slug])
        .in('language', [locale, 'both'])
        .order('created_at', { ascending: false });

      if (data) setTools(data);
      setIsLoading(false);
    };
    if (slug) fetchTools();
  }, [slug, locale]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const descFr = tool.description_fr || "";
      const descEn = tool.description_en || "";
      
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            descFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            descEn.toLowerCase().includes(searchQuery.toLowerCase());
                            
      const matchesPrice = priceFilters.length === 0 || priceFilters.includes(tool.pricing);
      return matchesSearch && matchesPrice;
    });
  }, [tools, priceFilters, searchQuery]);

  const toggleFilter = (value: string) => {
    setPriceFilters(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
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
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-800 bg-[#0b0c10]/90 backdrop-blur-md sticky top-0 z-50 gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">{t('shortTitle')}</h1>
        </Link>
        
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13141b] border border-slate-700 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
      </header>

      {/* FIL D'ARIANE & TITRE */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">{t('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400 font-medium">{categoryTitle}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('title', { category: categoryTitle })}</h1>
            <p className="text-slate-400">{t('subtitle')}</p>
          </div>
          <span className="text-sm font-medium bg-slate-800 py-1 px-3 rounded-full text-slate-300">
            {t('toolsFound', { count: filteredTools.length })}
          </span>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR FILTRES */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-cyan-400 border-b border-slate-800 pb-4">
              <SlidersHorizontal className="w-5 h-5" />
              <h2 className="font-semibold text-lg">{t('filtersTitle')}</h2>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-sm text-slate-200 mb-3">{t('pricingModel')}</h3>
              <div className="space-y-2.5">
                {[
                  { value: 'Gratuit', label: tFilters('prices.free') },
                  { value: 'Freemium', label: tFilters('prices.freemium') },
                  { value: 'Payant', label: tFilters('prices.paid') },
                  { value: 'Open Source', label: tFilters('prices.openSource') }
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${priceFilters.includes(item.value) ? 'bg-purple-500 border-purple-500' : 'border-slate-600 bg-slate-800'}`}>
                      {priceFilters.includes(item.value) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" onChange={() => toggleFilter(item.value)} />
                    <span className={`text-sm transition-colors ${priceFilters.includes(item.value) ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'}`}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* LISTE DES OUTILS */}
        <div className="col-span-1 lg:col-span-9">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-purple-500 animate-spin" /></div>
          ) : filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-center">
                        {/* Logo */}
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 relative overflow-hidden shrink-0">
                          <span className="font-bold text-xl text-purple-400 absolute">{tool.name.charAt(0)}</span>
                          <img 
                            src={`https://logo.clearbit.com/${new URL(tool.url).hostname}`} 
                            alt={tool.name}
                            className="w-full h-full object-cover relative z-10 bg-[#13141b]"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">{tool.name}</h3>
<span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
  tool.pricing === 'Freemium' ? 'bg-cyan-500/10 text-cyan-400' : 
  tool.pricing === 'Payant' ? 'bg-fuchsia-500/10 text-fuchsia-400' : 
  'bg-emerald-500/10 text-emerald-400'
}`}>
  {getPricingLabel(tool.pricing)}
</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                      {locale === 'fr' 
                        ? (tool.description_fr || tool.description_en) 
                        : (tool.description_en || tool.description_fr)}
                    </p>

                    {/* TAGS */}
                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
{tool.tags.map(tag => (
  <span key={tag} className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
    {tTags(tag)}
  </span>
))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
                    <span className="text-xs text-slate-500">{t('submittedBy')} {tool.contributor || t('anonymous')}</span>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white flex items-center gap-1 hover:text-purple-400 transition-colors">
                      {t('visit')} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-[#13141b] border border-slate-800 rounded-2xl">
              <Filter className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">{t('noToolsTitle')}</h3>
              <p className="text-slate-400 text-sm mb-4">{t('noToolsDesc')}</p>
              <Link href={`/${locale}`} className="text-purple-400 hover:text-purple-300 font-medium text-sm">
                {t('backHome')}
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}