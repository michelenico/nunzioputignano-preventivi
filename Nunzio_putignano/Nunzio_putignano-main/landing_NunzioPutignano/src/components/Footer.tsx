import React from 'react';
import { Database, Shield } from 'lucide-react';

interface FooterProps {
  onOpenDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDashboard }) => {
  return (
    <footer className="bg-[#080a0d] text-slate-400 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row matching mockup */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#ea580c] to-[#c2410c] rounded-xl text-white font-black text-xl select-none shadow">
              PN
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-base tracking-tight leading-none">
                NUNZIO PUTIGNANO
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-[0.25em] uppercase mt-1">
               AUTO OFFICINA - PALAGIANO
              </span>
            </div>
          </div>

          {/* Slogan matching mockup */}
          <div className="text-sm font-medium text-slate-400">
            <span className="text-slate-300">La tua auto</span>, la nostra esperienza.
          </div>

        </div>

        {/* Secondary Info & Timetable */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs text-slate-500">
          <div>
            <h4 className="text-slate-300 font-bold uppercase text-[11px] mb-2 tracking-wider">
              Orari di Apertura
            </h4>
            <p>Lunedì - Venerdì: 08:00 - 13:00 / 15:00 - 19:30</p>
            <p>Sabato: 08:00 - 12:30</p>
            <p>Domenica: Chiuso</p>
          </div>

          <div>
            <h4 className="text-slate-300 font-bold uppercase text-[11px] mb-2 tracking-wider">
              Sede Operativa
            </h4>
            <p>Via Caduti di Nassirya</p>
            <p>74019 Palagiano (TA) - Puglia, Italia</p>
            <p className="mt-1 text-slate-400">Tel: 324 999 1990</p>
          </div>
            </div>

        {/* Copyright notice */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
          <p>© {new Date().getFullYear()} Autofficina Nunzio Putignano. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-500" />
              Privacy & Cookie Policy conforme GDPR
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
