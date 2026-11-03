import React from 'react';
import { Sparkles, ArrowRight, Music } from 'lucide-react';

export default function AdBanner() {
  return (
    <div className="bg-[#13141b] border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_20px_rgba(168,85,247,0.1)]">
      
      {/* Effet de dégradé en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-400/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-5 h-5 text-purple-400" />
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Notre autre projet</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Découvrez Soundiser</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Explorez notre plateforme de partage dédiée à la musique autoproduite et générée par l'IA.
        </p>
        
        <a 
          href="https://soundiser.com/" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-[#0b0c10] text-sm font-bold py-2.5 px-5 rounded-lg hover:bg-slate-200 transition-colors w-full justify-center"
        >
          Visiter Soundiser <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      
    </div>
  );
}