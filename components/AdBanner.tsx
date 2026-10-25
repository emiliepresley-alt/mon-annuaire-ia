import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AdBanner() {
  return (
    <div className="bg-[#13141b] border border-slate-800 rounded-2xl p-6 text-center relative overflow-hidden group">
      
      {/* Effet de dégradé en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-400/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="w-12 h-12 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-3 border border-slate-700">
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">Votre publicité ici</h3>
        <p className="text-xs text-slate-400 mb-4">Touchez une audience qualifiée de professionnels et créateurs.</p>
        
        <a 
          href="mailto:contact@mon-annuaire-ia.com" 
          className="inline-block bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium py-2 px-4 rounded-lg border border-slate-700 transition-colors"
        >
          Nous contacter
        </a>
      </div>
      
    </div>
  );
}