'use client';
import React, { useState, useEffect } from 'react';
import { 
  Plus, X, CheckCircle2, Loader2, Sparkles 
} from 'lucide-react';

export default function ProposerOutil() {
  // --- ÉTATS DE LA MODALE ---
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // --- ÉTATS DU FORMULAIRE ---
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: '',
    pricing: 'Freemium', // Valeur par défaut
    plusProduct: '',
    contributor: ''
  });

  // Fermer la modale avec la touche "Échap"
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    // Réinitialiser après l'animation de fermeture
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', url: '', description: '', category: '', pricing: 'Freemium', plusProduct: '', contributor: '' });
    }, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // SIMULATION D'ENVOI VERS SUPABASE (Remplacer par votre appel API plus tard)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Ici, vous ferez : supabase.from('tools').insert([{ ...formData, status: 'pending' }])
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center font-sans">
      
      {/* BOUTON DÉCLENCHEUR (Simule le header de l'annuaire) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-3 px-8 rounded-full flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105"
      >
        <Plus className="w-5 h-5" />
        Proposer un outil
      </button>

      {/* ========================================= */}
      {/* MODALE : PROPOSER UN OUTIL                */}
      {/* ========================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          
          {/* Overlay sombre avec flou */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Conteneur de la Modale */}
          <div className="relative bg-[#13141b] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header de la Modale */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#13141b]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Proposer un nouvel outil IA
                </h2>
                <p className="text-xs text-slate-400 mt-1">Aidez la communauté à découvrir les meilleures pépites.</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu (Scrollable) */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              
              {/* ÉTAT DE SUCCÈS */}
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Merci pour votre contribution !</h3>
                  <p className="text-slate-400 max-w-sm mb-6">
                    L'outil <span className="text-white font-medium">"{formData.name}"</span> a bien été reçu. Notre équipe va le vérifier et il sera mis en ligne très bientôt.
                  </p>
                  <button onClick={closeModal} className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-6 rounded-lg transition-colors">
                    Fermer
                  </button>
                </div>
              ) : (
                
                /* FORMULAIRE */
                <form id="tool-form" onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Nom & URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom de l'outil <span className="text-purple-400">*</span></label>
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: ChatGPT" className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Lien (URL) <span className="text-purple-400">*</span></label>
                      <input required type="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white" />
                    </div>
                  </div>

                  {/* Description courte */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Accroche courte <span className="text-purple-400">*</span></label>
                    <input required type="text" name="description" value={formData.description} onChange={handleChange} maxLength="100" placeholder="En 1 phrase, à quoi sert cet outil ?" className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white" />
                    <p className="text-xs text-slate-500 mt-1 text-right">{formData.description.length}/100</p>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Catégorie principale <span className="text-purple-400">*</span></label>
                    <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white appearance-none">
                      <option value="" disabled>Sélectionnez une catégorie</option>
                      <option value="texte">Texte & Rédaction</option>
                      <option value="image">Image & Art Visuel</option>
                      <option value="video">Vidéo & Animation</option>
                      <option value="audio">Audio & Musique</option>
                      <option value="code">Développement & Code</option>
                      <option value="marketing">Marketing & SEO</option>
                      <option value="productivite">Productivité & Gestion</option>
                    </select>
                  </div>

                  {/* Modèle économique (Boutons radio stylisés) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Modèle d'accès <span className="text-purple-400">*</span></label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Gratuit', 'Freemium', 'Payant', 'Open Source'].map((price) => (
                        <label key={price} className={`cursor-pointer border rounded-lg py-2 text-center text-sm transition-all ${formData.pricing === price ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-medium' : 'bg-[#0b0c10] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                          <input type="radio" name="pricing" value={price} checked={formData.pricing === price} onChange={handleChange} className="hidden" />
                          {price}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Le "+ produit" */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Le petit "+" (Optionnel)</label>
                    <textarea name="plusProduct" value={formData.plusProduct} onChange={handleChange} rows="2" placeholder="Pourquoi avez-vous trouvé cet outil génial ?" className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white resize-none"></textarea>
                  </div>

                  {/* Contributeur */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Votre nom / Pseudo (Optionnel)</label>
                    <input type="text" name="contributor" value={formData.contributor} onChange={handleChange} placeholder="Pour être crédité (ex: @JeanDupont)" className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white" />
                  </div>

                </form>
              )}
            </div>

            {/* Footer de la Modale (Actions) */}
            {!isSuccess && (
              <div className="p-6 border-t border-slate-800 bg-[#13141b] flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                  Annuler
                </button>
                <button 
                  type="submit" 
                  form="tool-form"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
                  ) : (
                    "Soumettre l'outil"
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}