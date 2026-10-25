'use client';
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, ChevronDown, ArrowUp, ExternalLink, 
  BrainCircuit, ChevronRight, Check, SlidersHorizontal 
} from 'lucide-react';
import AdBanner from '../../components/AdBanner';
// --- 1. DONNÉES FICTIVES (Prêt pour Supabase) ---
const MOCK_TOOLS = [
  { id: 1, name: "ChatGPT", desc: "L'assistant conversationnel d'OpenAI. Idéal pour rédiger, résumer et brainstormer.", pricing: "Freemium", access: ["Web App", "API"], votes: 1250, url: "#", tags: ["Chatbot", "Généraliste"] },
  { id: 2, name: "Jasper AI", desc: "Plateforme de copywriting alimentée par l'IA pour le marketing et les ventes.", pricing: "Payant", access: ["Web App"], votes: 840, url: "#", tags: ["Copywriting", "Marketing"] },
  { id: 3, name: "DeepL", desc: "Le traducteur le plus précis du marché, propulsé par l'IA.", pricing: "Freemium", access: ["Web App", "API", "Application Desktop/Mobile"], votes: 2100, url: "#", tags: ["Traduction"] },
  { id: 4, name: "Claude", desc: "L'IA d'Anthropic, excellente pour l'analyse de documents longs et la rédaction nuancée.", pricing: "Freemium", access: ["Web App", "API"], votes: 980, url: "#", tags: ["Chatbot", "Analyse"] },
  { id: 5, name: "Copy.ai", desc: "Générateur de textes rapides pour les posts réseaux sociaux et les emails.", pricing: "Freemium", access: ["Web App"], votes: 450, url: "#", tags: ["Copywriting"] },
  { id: 6, name: "Grammarly", desc: "Correcteur orthographique et grammatical avancé avec suggestions de style.", pricing: "Freemium", access: ["Extension Chrome", "Web App", "Application Desktop/Mobile"], votes: 1800, url: "#", tags: ["Correction", "Rédaction"] },
  { id: 7, name: "Notion AI", desc: "L'IA intégrée à Notion pour rédiger, résumer et organiser vos notes.", pricing: "Payant", access: ["Web App", "Application Desktop/Mobile"], votes: 720, url: "#", tags: ["Productivité", "Rédaction"] },
];

export default function CategoryPage() {
  // --- ÉTATS DES FILTRES ---
  const [priceFilters, setPriceFilters] = useState([]);
  const [accessFilters, setAccessFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // --- LOGIQUE DE FILTRAGE ---
  const filteredTools = useMemo(() => {
    return MOCK_TOOLS.filter(tool => {
      // Filtre par recherche (nom ou description)
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre par prix
      const matchesPrice = priceFilters.length === 0 || priceFilters.includes(tool.pricing);
      
      // Filtre par accès
      const matchesAccess = accessFilters.length === 0 || tool.access.some(a => accessFilters.includes(a));

      return matchesSearch && matchesPrice && matchesAccess;
    }).sort((a, b) => b.votes - a.votes); // Tri par nombre de votes
  }, [priceFilters, accessFilters, searchQuery]);

  // --- GESTIONNAIRES DE CHECKBOX ---
  const toggleFilter = (value, state, setState) => {
    setState(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans">
      
      {/* HEADER (Réutilisé) */}
      <header className="flex items-center justify-between p-4 border-b border-slate-800 sticky top-0 bg-[#0b0c10]/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Annuaire de l'IA</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Rechercher dans cette catégorie..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#13141b] border border-slate-700 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2 px-5 rounded-full flex items-center gap-2 text-sm transition-all">
            <Plus className="w-4 h-4" /> Proposer un outil
          </button>
        </div>
      </header>

      {/* FIL D'ARIANE & TITRE */}
      <div className="max-w-[1400px] mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <span className="hover:text-white cursor-pointer">Accueil</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-white cursor-pointer">Texte & Langage</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400 font-medium">Texte & Rédaction</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Texte & Rédaction</h1>
            <p className="text-slate-400">Découvrez les meilleurs outils d'IA pour générer, corriger et traduire du texte.</p>
          </div>
          <span className="text-sm font-medium bg-slate-800 py-1 px-3 rounded-full text-slate-300">
            {filteredTools.length} outils trouvés
          </span>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <main className="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-12 gap-8">
        
        {/* SIDEBAR FILTRES */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-cyan-400 border-b border-slate-800 pb-4">
              <SlidersHorizontal className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Filtres</h2>
            </div>

            {/* Filtre: Prix */}
            <div className="mb-6">
              <h3 className="font-medium text-sm text-slate-200 mb-3">Modèle économique</h3>
              <div className="space-y-2.5">
                {['Gratuit', 'Freemium', 'Payant', 'Open Source'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${priceFilters.includes(item) ? 'bg-purple-500 border-purple-500' : 'border-slate-600 bg-slate-800'}`}>
                      {priceFilters.includes(item) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" onChange={() => toggleFilter(item, priceFilters, setPriceFilters)} />
                    <span className={`text-sm transition-colors ${priceFilters.includes(item) ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'}`}>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtre: Type d'accès */}
            <div>
              <h3 className="font-medium text-sm text-slate-200 mb-3">Type d'accès</h3>
              <div className="space-y-2.5">
                {['Web App', 'API', 'Extension Chrome', 'Application Desktop/Mobile'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${accessFilters.includes(item) ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 bg-slate-800'}`}>
                      {accessFilters.includes(item) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" onChange={() => toggleFilter(item, accessFilters, setAccessFilters)} />
                    <span className={`text-sm transition-colors ${accessFilters.includes(item) ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'}`}>{item}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Bouton reset */}
            {(priceFilters.length > 0 || accessFilters.length > 0) && (
              <button 
                onClick={() => { setPriceFilters([]); setAccessFilters([]); }}
                className="mt-6 w-full py-2 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
          
          {/* 👇 AJOUTEZ LA BANNIÈRE ICI 👇 */}
          <AdBanner />
          
        </aside>

        {/* LISTE DES OUTILS */}
        <div className="col-span-9 grid grid-cols-2 gap-5">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <div key={tool.id} className="bg-[#13141b] border border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                      {/* Logo de l'outil (Placeholder) */}
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xl text-purple-400 border border-slate-700 group-hover:border-purple-500/50 transition-colors">
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">{tool.name}</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          tool.pricing === 'Freemium' ? 'bg-cyan-500/10 text-cyan-400' : 
                          tool.pricing === 'Payant' ? 'bg-fuchsia-500/10 text-fuchsia-400' : 
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {tool.pricing}
                        </span>
                      </div>
                    </div>
                    {/* Bouton Upvote */}
                    <button className="flex flex-col items-center justify-center bg-[#1a1b23] border border-slate-700 rounded-lg py-1 px-2.5 hover:border-purple-500 hover:text-purple-400 transition-colors">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-xs font-bold mt-0.5">{tool.votes}</span>
                    </button>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{tool.desc}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
                  <div className="flex flex-wrap gap-1.5">
                    {tool.access.map(acc => (
                      <span key={acc} className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                        {acc}
                      </span>
                    ))}
                  </div>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white flex items-center gap-1 hover:text-purple-400 transition-colors">
                    Visiter <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            /* État vide (si aucun outil ne correspond aux filtres) */
            <div className="col-span-2 py-20 flex flex-col items-center justify-center text-center bg-[#13141b] border border-slate-800 rounded-2xl">
              <Filter className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Aucun outil trouvé</h3>
              <p className="text-slate-400 text-sm mb-4">Essayez de modifier vos filtres ou votre recherche.</p>
              <button 
                onClick={() => { setPriceFilters([]); setAccessFilters([]); setSearchQuery(""); }}
                className="text-purple-400 hover:text-purple-300 font-medium text-sm"
              >
                Effacer tous les filtres
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}