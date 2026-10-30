'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ArrowLeft, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ImportToolsPage() {
  const router = useRouter();
  const locale = useLocale();
  
  const [jsonInput, setJsonInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number; error?: string } | null>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setResult(null);

    try {
      // 1. On vérifie que le JSON est valide
      const parsedData = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsedData)) {
        throw new Error("Le JSON doit être un tableau d'objets (array).");
      }

      // 2. On prépare les données pour Supabase
      const toolsToInsert = parsedData.map((tool: any) => ({
        name: tool.name || 'Sans nom',
        url: tool.url || '',
        categories: Array.isArray(tool.categories) ? tool.categories : [],
        tags: Array.isArray(tool.tags) ? tool.tags : [],
        description_fr: tool.description_fr || null,
        description_en: tool.description_en || null,
        language: tool.language || 'both',
        pricing: tool.pricing || 'Freemium',
        status: 'pending', // Par défaut, on met en attente pour que tu vérifies
        contributor: tool.contributor || null
      }));

      // 3. On envoie à Supabase
      const { error } = await supabase
        .from('tools')
        .insert(toolsToInsert);

      if (error) throw error;

      setResult({ success: true, count: toolsToInsert.length });
      setJsonInput(''); // On vide le champ
      
    } catch (err: any) {
      setResult({ success: false, count: 0, error: err.message });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans p-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 border-b border-slate-800 pb-6">
          <Link href={`/${locale}/admin`} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à la gestion
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Upload className="w-8 h-8 text-purple-500" />
            Importer des outils
          </h1>
          <p className="text-slate-400 mt-2">Collez un tableau JSON d'outils pour les ajouter en masse. Ils seront ajoutés avec le statut "En attente".</p>
        </div>

        <div className="space-y-6">
          {/* Zone de texte */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Données JSON (Tableau)
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`[\n  {\n    "name": "Mon Outil",\n    "url": "https://mon-outil.com",\n    "categories": ["texte", "code"],\n    "tags": ["chatbot", "api"],\n    "description_fr": "...",\n    "description_en": "...",\n    "pricing": "Freemium"\n  }\n]`}
              className="w-full h-80 bg-[#13141b] border border-slate-700 rounded-xl p-4 text-sm text-slate-300 font-mono focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Bouton d'import */}
          <button
            onClick={handleImport}
            disabled={isImporting || !jsonInput.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isImporting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Importation en cours...</>
            ) : (
              <><Upload className="w-5 h-5" /> Lancer l'importation</>
            )}
          </button>

          {/* Message de résultat */}
          {result && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${result.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {result.success ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold">{result.success ? "Importation réussie !" : "Erreur d'importation"}</p>
                <p className="text-sm mt-1">
                  {result.success 
                    ? `${result.count} outils ont été ajoutés à la base de données en attente de validation.` 
                    : result.error}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}