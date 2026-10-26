'use client';
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Turnstile } from '@marsidev/react-turnstile'; 

// On déclare les tags en dehors du composant (c'est plus propre)
const predefinedTags = [
  "Chatbot", "Copywriting", "Traduction", "Résumé", 
  "Text-to-Image", "Text-to-Video", "Text-to-Speech", 
  "Avatar", "Montage vidéo", "Édition photo", 
  "Génération de code", "SQL", "API", "Automatisation", 
  "Productivité", "Design UI/UX", "SEO", "Recherche"
];

export default function SubmitToolModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const t = useTranslations('Modal'); 
  const tCat = useTranslations('Categories'); 
  const tFilters = useTranslations('Filters'); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  // ✅ CORRECTION 1 : Ajout de "tags" dans le state initial
  const [formData, setFormData] = useState({
    name: '', url: '', description_fr: '', description_en: '', 
    categories: [] as string[], 
    tags: [] as string[], // <-- Ajouté ici
    pricing: 'Freemium', contributor: ''
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (slug: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(slug);
      return {
        ...prev,
        categories: isSelected 
          ? prev.categories.filter(c => c !== slug) 
          : [...prev.categories, slug]
      };
    });
  };

  // ✅ CORRECTION 2 : Fonction déplacée au bon endroit et typée correctement
  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const isSelected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: isSelected 
          ? prev.tags.filter(t => t !== tag) 
          : [...prev.tags, tag]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description_fr.trim() && !formData.description_en.trim()) {
      alert(t('descError'));
      return;
    }
    
    if (formData.categories.length === 0) {
      alert("Veuillez choisir au moins une catégorie.");
      return;
    }
    
    if (!turnstileToken) {
      alert("Veuillez patienter pendant la vérification anti-bot.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turnstileToken: turnstileToken,
          formData: formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setIsSuccess(true); 

    } catch (error: any) {
      alert("Erreur : " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setTurnstileToken(null); 
      // ✅ CORRECTION 3 : Ajout de tags: [] lors de la réinitialisation
      setFormData({ 
        name: '', url: '', description_fr: '', description_en: '', 
        categories: [], tags: [], pricing: 'Freemium', contributor: '' 
      });
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>

      <div className="relative bg-[#13141b] border border-slate-700 w-full max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#13141b]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              {t('title')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{t('subtitle')}</p>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('successTitle')}</h3>
              <p className="text-slate-400 max-w-sm mb-6">
                {t('successDesc1')} <span className="text-white font-medium">"{formData.name}"</span> {t('successDesc2')}
              </p>
              <button onClick={handleClose} className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-6 rounded-lg transition-colors">
                {t('close')}
              </button>
            </div>
          ) : (
            <form id="tool-form" onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('nameLabel')} <span className="text-purple-400">*</span></label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: ChatGPT" className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('urlLabel')} <span className="text-purple-400">*</span></label>
                  <input required type="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('descLabelFr')}</label>
                  <input type="text" name="description_fr" value={formData.description_fr} onChange={handleChange} maxLength={100} placeholder={t('descPlaceholderFr')} className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('descLabelEn')}</label>
                  <input type="text" name="description_en" value={formData.description_en} onChange={handleChange} maxLength={100} placeholder={t('descPlaceholderEn')} className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white" />
                </div>
              </div>
              
              {/* CASES À COCHER POUR LES CATÉGORIES */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('categoryLabel')} <span className="text-purple-400">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { slug: 'texte' },
                    { slug: 'image' },
                    { slug: 'video' },
                    { slug: 'audio' },
                    { slug: 'design' },
                    { slug: 'code' },
                    { slug: 'marketing' },
                    { slug: 'support' },
                    { slug: 'productivite' },
                    { slug: 'finance' },
                    { slug: 'education' },
                    { slug: 'llm' },
                    { slug: 'prompt' },
                    { slug: 'data' },
                    { slug: 'agents' }
                  ].map((cat) => (
                    <label key={cat.slug} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${formData.categories.includes(cat.slug) ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 hover:border-slate-500'}`}>
                      <input 
                        type="checkbox" 
                        checked={formData.categories.includes(cat.slug)} 
                        onChange={() => handleCategoryToggle(cat.slug)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500/20" 
                      />
                      <span className="text-sm text-slate-300">{tCat(`${cat.slug}.title`)}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* TAGS */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tags (Optionnel)</label>
                <div className="flex flex-wrap gap-2">
                  {predefinedTags.map((tag) => (
                    <label key={tag} className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium border transition-colors ${formData.tags.includes(tag) ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-[#0b0c10] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                      <input type="checkbox" className="hidden" checked={formData.tags.includes(tag)} onChange={() => handleTagToggle(tag)} />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>
              
              {/* PRIX */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('pricingLabel')} <span className="text-purple-400">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'Gratuit', key: 'free' },
                    { value: 'Freemium', key: 'freemium' },
                    { value: 'Payant', key: 'paid' },
                    { value: 'Open Source', key: 'openSource' }
                  ].map((price) => (
                    <label key={price.value} className={`cursor-pointer border rounded-lg py-2 text-center text-sm transition-all ${formData.pricing === price.value ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-medium' : 'bg-[#0b0c10] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                      <input type="radio" name="pricing" value={price.value} checked={formData.pricing === price.value} onChange={handleChange} className="hidden" />
                      {tFilters(`prices.${price.key}`)}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('contributorLabel')}</label>
                <input type="text" name="contributor" value={formData.contributor} onChange={handleChange} placeholder={t('contributorPlaceholder')} className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white" />
              </div>

              <div className="pt-2 flex justify-center">
                <Turnstile 
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} 
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => alert("Erreur lors du chargement du captcha.")}
                  onExpire={() => setTurnstileToken(null)}
                />
              </div>

            </form>
          )}
        </div>

        {!isSuccess && (
          <div className="p-6 border-t border-slate-800 bg-[#13141b] flex justify-end gap-3">
            <button type="button" onClick={handleClose} className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              form="tool-form" 
              disabled={isSubmitting || !turnstileToken} 
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('submitting')}</> : t('submit')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}