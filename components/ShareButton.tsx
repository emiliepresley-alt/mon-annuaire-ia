'use client';
import React, { useState } from 'react';
import { Share2, Copy, Check, X, Facebook, Twitter, MessageCircle, Send } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title: string;
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#13141b] border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
        title="Partager cet outil"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-[#13141b] border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Partager</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1a1b23] hover:bg-[#2a2b33] border border-slate-700 text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1a1b23] hover:bg-[#2a2b33] border border-slate-700 text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/?text=${shareTitle} ${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1a1b23] hover:bg-[#2a2b33] border border-slate-700 text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1a1b23] hover:bg-[#2a2b33] border border-slate-700 text-white transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href={`https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1a1b23] hover:bg-[#2a2b33] border border-slate-700 text-white transition-colors">
                {/* Icône Reddit générique */}
                <span className="font-bold text-lg">r/</span>
              </a>
              <button onClick={handleCopy} className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1a1b23] hover:bg-[#2a2b33] border border-slate-700 text-white transition-colors">
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}