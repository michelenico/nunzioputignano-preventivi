import React, { useState } from 'react';
import { Menu, X, Phone, Database } from 'lucide-react';

interface NavbarProps {
  onOpenDashboard: () => void;
  quotesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDashboard, quotesCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#12151b]/95 backdrop-blur-md border-b border-slate-800/80 transition-all" aria-label="Navigazione principale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo matching mockup */}
          <a href="#" className="flex items-center gap-3 group">
            {/* PN Monogram Badge */}
            <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-[#ea580c] to-[#c2410c] rounded-xl shadow-md shadow-orange-950/40 text-white font-black text-2xl tracking-tighter select-none transition-transform group-hover:scale-105">
              <span>PN</span>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-base sm:text-lg tracking-tight leading-none group-hover:text-orange-400 transition-colors">
                NUNZIO PUTIGNANO
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-[0.25em] uppercase leading-relaxed">
                AUTO OFFICINA - PALAGIANO
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button 
              onClick={() => scrollTo('servizi')} 
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              I Nostri Servizi
            </button>
            <button 
              onClick={() => scrollTo('perche-noi')} 
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              Perché Sceglierci
            </button>
            <button 
              onClick={() => scrollTo('come-funziona')} 
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              Come Funziona
            </button>
            <button 
              onClick={() => scrollTo('contatti')} 
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              Contatti
            </button>
          </nav>

          {/* Actions on Desktop */}
          <div className="hidden lg:flex items-center gap-3">

            <a
              href="tel:3249991990"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-orange-900/30 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Chiamaci</span>
            </a>
          </div>

          {/* Mobile Right Controls: Dashboard Icon + Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenDashboard}
              className="relative p-2 rounded-xl bg-slate-800/80 text-orange-400 border border-slate-700"
              aria-label="Database Preventivi"
            >
              <Database className="w-5 h-5" />
              {quotesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {quotesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label={mobileMenuOpen ? "Chiudi menu" : "Apri menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#12151b] px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => scrollTo('preventivo')}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-orange-400 bg-orange-950/20 hover:bg-orange-950/40"
          >
            Richiedi Preventivo Subito
          </button>
          <button
            onClick={() => scrollTo('servizi')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            I Nostri Servizi
          </button>
          <button
            onClick={() => scrollTo('perche-noi')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Perché Sceglierci
          </button>
          <button
            onClick={() => scrollTo('come-funziona')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Come Funziona
          </button>
          <button
            onClick={() => scrollTo('contatti')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Contatti e Dove Siamo
          </button>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="tel:3249991990"
              className="flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-xl"
            >
              <Phone className="w-4 h-4" />
              Chiama 324 999 1990
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
