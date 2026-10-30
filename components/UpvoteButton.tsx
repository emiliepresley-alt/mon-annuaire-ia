'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function UpvoteButton({ toolId, initialVotes = 0 }: { toolId: string, initialVotes: number }) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Vérifier si l'utilisateur a déjà voté au chargement
  useEffect(() => {
    const votedTools = JSON.parse(localStorage.getItem('voted_tools') || '[]');
    if (votedTools.includes(toolId)) {
      setHasVoted(true);
    }
  }, [toolId]);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche le clic de naviguer si le bouton est dans un lien
    if (hasVoted || isVoting) return;

    setIsVoting(true);
    // Optimistic UI : on met à jour l'affichage instantanément
    setVotes(prev => prev + 1);
    setHasVoted(true);

    // Sauvegarde dans le localStorage
    const votedTools = JSON.parse(localStorage.getItem('voted_tools') || '[]');
    localStorage.setItem('voted_tools', JSON.stringify([...votedTools, toolId]));

    // Appel à l'API
    try {
      await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId }),
      });
    } catch (error) {
      console.error("Erreur lors du vote:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <button 
      onClick={handleVote}
      disabled={hasVoted}
      className={`flex flex-col items-center justify-center min-w-[40px] h-12 rounded-lg border transition-all ${
        hasVoted 
          ? 'bg-purple-500/20 border-purple-500 text-purple-400 cursor-default' 
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer'
      }`}
      title={hasVoted ? "Vous avez déjà voté" : "Voter pour cet outil"}
    >
      <ArrowUp className={`w-4 h-4 ${hasVoted ? 'text-purple-400' : ''}`} />
      <span className="text-xs font-bold">{votes}</span>
    </button>
  );
}