'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  // On met à jour l'input si la page change via les boutons
  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  if (totalPages <= 1) return null;

  // Fonction pour générer les numéros intelligemment (comme dans l'admin)
  const getPaginationRange = () => {
    const delta = 1; // Nombre de pages à côté de la page actuelle
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
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

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    } else {
      // Si l'utilisateur tape n'importe quoi, on remet la page actuelle
      setInputPage(currentPage.toString());
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12 py-6 border-t border-slate-800">
      
      {/* Boutons de pages */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button 
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 bg-[#13141b] border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPaginationRange().map((page, index) => (
          page === '...' ? (
            <span key={`dots-${index}`} className="px-2 text-slate-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
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

        <button 
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 bg-[#13141b] border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Champ pour aller à une page précise */}
      <form onSubmit={handleGoToPage} className="flex items-center gap-2 text-sm text-slate-400">
        <span>Aller à la page</span>
        <input 
          type="number" 
          min="1" 
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          className="w-16 bg-[#13141b] border border-slate-700 rounded-lg py-1.5 px-2 text-center text-white focus:outline-none focus:border-purple-500"
        />
        <span>/ {totalPages}</span>
        <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
          OK
        </button>
      </form>

    </div>
  );
}