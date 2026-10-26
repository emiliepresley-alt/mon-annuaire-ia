'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { supabase } from '../../../lib/supabase';
import { BrainCircuit, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const locale = useLocale();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setIsLoading(false);
    } else {
      router.push(`/${locale}/admin`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#13141b] border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <BrainCircuit className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Accès Administrateur</h1>
          <p className="text-sm text-slate-400 mt-1">Connectez-vous pour gérer l'annuaire.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Mot de passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b0c10] border border-slate-700 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href={`/${locale}`} className="text-sm text-slate-400 hover:text-white transition-colors">
            &larr; Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}