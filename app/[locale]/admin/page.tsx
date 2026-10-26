'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; 
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, ExternalLink, Loader2, ArrowLeft, Pencil, X, Trash2, ChevronLeft, ChevronRight, LogOut, BrainCircuit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const predefinedTags = [
  "Chatbot", "Copywriting", "Traduction", "Résumé", 
  "Text-to-Image", "Text-to-Video", "Text-to-Speech", 
  "Avatar", "Montage vidéo", "Édition photo", 
  "Génération de code", "SQL", "API", "Automatisation", 
  "Productivité", "Design UI/UX", "SEO", "Recherche"
];

const ITEMS_PER_PAGE = 10;

const getPaginationRange = (current: number, total: number) => {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

export default function AdminDashboard() {
  const router = useRouter();
  const locale = useLocale(); 
  
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTools, setTotalTools] = useState(0);
  const [activeTab, setActiveTab] = useState('pending'); 

  const [editingTool, setEditingTool] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '', url: '', description_fr: '', description_en: '', 
    categories: [] as string[], 
    tags: [] as string[], 
    pricing: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const [session, setSession] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ✅ CORRECTION 1 : Redirection vers /{locale}/login
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/${locale}/login`); 
      } else {
        setSession(session);
        setIsCheckingAuth(false);
      }
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push(`/${locale}/login`);
    });

    return () => authListener.subscription.unsubscribe();
  }, [router, locale]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
  };

  const fetchTools = async () => {
    setIsLoading(true);
    setErrorMsg('');
    
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count, error } = await supabase
      .from('tools')
      .select('*', { count: 'exact' })
      .eq('status', activeTab)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error);
      setErrorMsg("Erreur de chargement. Vérifiez vos règles de sécurité (RLS).");
    } else {
      setTools(data || []);
      setTotalTools(count || 0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (session) fetchTools();
  }, [activeTab, currentPage, session]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading(id);
    const { error } = await supabase
      .from('tools')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      fetchTools();
    }
    setActionLoading(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet outil ?")) return;
    
    setActionLoading(id);
    const { error } = await supabase.from('tools').delete().eq('id', id);

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      if (tools.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchTools();
      }
    }
    setActionLoading(null);
  };

  const openEditModal = (tool) => {
    setEditingTool(tool);
    setEditFormData({
      name: tool.name || '',
      url: tool.url || '',
      description_fr: tool.description_fr || '',
      description_en: tool.description_en || '',
      categories: tool.categories || [],
      tags: tool.tags || [], 
      pricing: tool.pricing || 'Freemium'
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (slug: string) => {
    setEditFormData(prev => {
      const isSelected = prev.categories.includes(slug);
      return {
        ...prev,
        categories: isSelected 
          ? prev.categories.filter(c => c !== slug) 
          : [...prev.categories, slug]
      };
    });
  };

  const handleTagToggle = (tag: string) => {
    setEditFormData(prev => {
      const isSelected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: isSelected 
          ? prev.tags.filter(t => t !== tag) 
          : [...prev.tags, tag]
      };
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await supabase
      .from('tools')
      .update({
        name: editFormData.name,
        url: editFormData.url,
        description_fr: editFormData.description_fr,
        description_en: editFormData.description_en,
        categories: editFormData.categories,
        tags: editFormData.tags, 
        pricing: editFormData.pricing
      })
      .eq('id', editingTool.id);

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      setEditingTool(null);
      fetchTools();
    }
    setIsSaving(false);
  };

  const totalPages = Math.ceil(totalTools / ITEMS_PER_PAGE);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* ✅ CORRECTION 2 : Header propre avec le bouton Déconnexion bien placé */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-800 pb-6 gap-4">
          <div>
            {/* 👇 LE LOGO ET LE TEXTE SONT MAINTENANT CLIQUABLES 👇 */}
            <a href={`/${locale}`} className="group flex items-center gap-3 mb-4 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform">
                <BrainCircuit className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white flex items-center gap-1 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Retour au site
                </span>
                <span className="text-xs text-slate-500">Annuaire de l'IA</span>
              </div>
            </a>

            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-500" />
              Gestion des outils
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-[#13141b] border border-slate-700 py-2 px-4 rounded-lg flex items-center gap-3">
              <span className="text-sm text-slate-400">Total :</span>
              <span className="text-xl font-bold text-purple-400">{totalTools}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        <div className="flex space-x-2 mb-6 bg-[#13141b] p-1 rounded-lg w-fit border border-slate-800">
          <button 
            onClick={() => handleTabChange('pending')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'pending' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            En attente
          </button>
          <button 
            onClick={() => handleTabChange('approved')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'approved' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Approuvés
          </button>
          <button 
            onClick={() => handleTabChange('rejected')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'rejected' ? 'bg-slate-800 text-red-400 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Refusés
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
            {errorMsg}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
            <p className="text-slate-400">Chargement...</p>
          </div>
        ) : tools.length === 0 ? (
          <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-slate-600 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Aucun outil ici</h2>
            <p className="text-slate-400">Il n'y a pas d'outil dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {tools.map((tool) => (
                <div key={tool.id} className="bg-[#13141b] border border-slate-700 rounded-xl p-5 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                      <span className="text-xs bg-slate-800 text-slate-300 py-1 px-2 rounded border border-slate-700">
                        {tool.pricing}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        {tool.categories && tool.categories.map(cat => (
                          <span key={cat} className="text-xs bg-purple-500/20 text-purple-300 py-1 px-2 rounded border border-purple-500/30">
                            {cat}
                          </span>
                        ))}
                        {tool.tags && tool.tags.map(tag => (
                          <span key={tag} className="text-xs bg-cyan-500/10 text-cyan-400 py-1 px-2 rounded border border-cyan-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm text-slate-400 mb-4 space-y-1 bg-[#0b0c10] p-3 rounded-lg border border-slate-800">
                      {tool.description_fr && <p><strong className="text-slate-300">FR :</strong> {tool.description_fr}</p>}
                      {tool.description_en && <p><strong className="text-slate-300">EN :</strong> {tool.description_en}</p>}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                        Visiter le site <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="text-slate-500">Proposé par : {tool.contributor || "Anonyme"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => openEditModal(tool)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
                    >
                      <Pencil className="w-4 h-4" /> Éditer
                    </button>
                    <button 
                      onClick={() => handleDelete(tool.id)}
                      disabled={actionLoading === tool.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 text-sm"
                    >
                      {actionLoading === tool.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>

                    {activeTab === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(tool.id, 'rejected')}
                          disabled={actionLoading === tool.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50 text-sm"
                        >
                          <XCircle className="w-4 h-4" /> Refuser
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(tool.id, 'approved')}
                          disabled={actionLoading === tool.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors disabled:opacity-50 text-sm"
                        >
                          <CheckCircle className="w-4 h-4" /> Approuver
                        </button>
                      </>
                    )}
                    
                    {activeTab === 'approved' && (
                      <button 
                        onClick={() => handleStatusUpdate(tool.id, 'pending')}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20 transition-colors text-sm"
                      >
                        Mettre en attente
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 pt-6 border-t border-slate-800 gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 bg-[#13141b] border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Précédent</span>
                </button>
                
                <div className="flex gap-1">
                  {getPaginationRange(currentPage, totalPages).map((page, index) => (
                    page === '...' ? (
                      <span key={`dots-${index}`} className="px-3 py-2 text-slate-500">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors border ${
                          currentPage === page 
                            ? 'bg-purple-600 border-purple-500 text-white font-bold' 
                            : 'bg-[#13141b] border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 bg-[#13141b] border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Suivant</span> <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {editingTool && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingTool(null)}></div>
            <div className="relative bg-[#13141b] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Éditer : {editingTool.name}</h2>
                <button onClick={() => setEditingTool(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="edit-form" onSubmit={handleSaveEdit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom de l'outil</label>
                      <input required type="text" name="name" value={editFormData.name} onChange={handleEditChange} className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2 px-4 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">URL</label>
                      <input required type="url" name="url" value={editFormData.url} onChange={handleEditChange} className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2 px-4 text-sm text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (FR)</label>
                      <input type="text" name="description_fr" value={editFormData.description_fr} onChange={handleEditChange} className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2 px-4 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (EN)</label>
                      <input type="text" name="description_en" value={editFormData.description_en} onChange={handleEditChange} className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2 px-4 text-sm text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Catégories</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['texte', 'image', 'video', 'audio', 'design', 'code', 'marketing', 'support', 'productivite', 'finance', 'education', 'llm', 'prompt', 'data', 'agents'].map((cat) => (
                        <label key={cat} className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${editFormData.categories.includes(cat) ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700'}`}>
                          <input type="checkbox" checked={editFormData.categories.includes(cat)} onChange={() => handleCategoryToggle(cat)} className="w-4 h-4 rounded bg-slate-800 text-purple-500" />
                          <span className="text-sm capitalize">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {predefinedTags.map((tag) => (
                        <label key={tag} className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium border transition-colors ${editFormData.tags.includes(tag) ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-[#0b0c10] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                          <input type="checkbox" className="hidden" checked={editFormData.tags.includes(tag)} onChange={() => handleTagToggle(tag)} />
                          {tag}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Prix</label>
                    <select name="pricing" value={editFormData.pricing} onChange={handleEditChange} className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2 px-4 text-sm text-white">
                      <option value="Gratuit">Gratuit</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Payant">Payant</option>
                      <option value="Open Source">Open Source</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                <button onClick={() => setEditingTool(null)} className="px-4 py-2 text-sm text-slate-300 hover:text-white">Annuler</button>
                <button type="submit" form="edit-form" disabled={isSaving} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}