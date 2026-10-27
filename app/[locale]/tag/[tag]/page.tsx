'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, ExternalLink, BrainCircuit, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useTranslations, useLocale } from 'next-intl';

export default function TagPage() {
  const params = useParams();
  const tag = params.tag as string; 

  const t = useTranslations('CategoryPage');
  const tFilters = useTranslations('Filters');
  const tTags = useTranslations('Tags');
  const locale = useLocale(); 

  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getPricingLabel = (pricing: string) => {
    switch (pricing) {
      case 'Gratuit': return tFilters('prices.free');
      case 'Freemium': return tFilters('prices.freemium');
      case 'Payant': return tFilters('prices.paid');
      case 'Open Source': return tFilters('prices.openSource');
      default: return pricing;
    }
  };

  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved')
        .contains('tags', [tag]) 
        .in('language', [locale, 'both'])
        .order('created_at', { ascending: false });

      if (data) setTools(data);
      setIsLoading(false);
    };
    if (tag) fetchTools();
  }, [tag, locale]);

  const filteredTools = tools.filter((tool: any) => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans">
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

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">{t('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-cyan-400 font-medium">Tag: {tTags(tag)}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Outils avec le tag "{tTags(tag)}"</h1>
            <p className="text-slate-400">Découvrez tous les outils correspondant à ce mot-clé.</p>
          </div>
          <span className="text-sm font-medium bg-slate-800 py-1 px-3 rounded-full text-slate-300">
            {t('toolsFound', { count: filteredTools.length })}
          </span>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 gap-8">
        <div>
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-purple-500 animate-spin" /></div>
          ) : filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool: any) => (
                <div key={tool.id} className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 relative overflow-hidden shrink-0">
                          <span className="font-bold text-lg text-purple-400 absolute">{tool.name.charAt(0)}</span>
                          <img src={`https://logo.clearbit.com/${new URL(tool.url).hostname}`} alt={tool.name} className="w-full h-full object-cover relative z-10 bg-[#13141b]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                        <div>
                          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                            <h3 className="font-bold text-lg text-white line-clamp-1">{tool.name}</h3>
                          </a>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tool.pricing === 'Freemium' ? 'bg-cyan-500/10 text-cyan-400' : tool.pricing === 'Payant' ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {getPricingLabel(tool.pricing)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                      {locale === 'fr' ? (tool.description_fr || tool.description_en) : (tool.description_en || tool.description_fr)}
                    </p>
                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {tool.tags.map((t_item: string) => (
                          <Link key={t_item} href={`/${locale}/tag/${t_item}`} className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700 hover:bg-slate-700 transition-colors">
                            {tTags(t_item)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-[#13141b] border border-slate-800 rounded-2xl">
              <Filter className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400">Aucun outil trouvé pour ce tag.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}