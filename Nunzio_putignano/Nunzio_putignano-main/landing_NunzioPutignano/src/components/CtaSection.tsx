import React from 'react';
import { Phone, MessageSquare, MapPin } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section id="contatti" className="relative py-20 lg:py-24 bg-[#0d0f14] text-white overflow-hidden border-t border-slate-800">
      {/* Automotive Workshop Tire / Rim visual background */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none opacity-20 overflow-hidden flex items-center justify-end">
        <svg
          className="w-[450px] sm:w-[600px] h-auto text-slate-700"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Detailed Car Alloy Wheel / Tire */}
          <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="12" />
          <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="6" />
          <circle cx="200" cy="200" r="50" stroke="currentColor" strokeWidth="10" />
          <circle cx="200" cy="200" r="20" fill="currentColor" />
          {/* Spokes */}
          <line x1="200" y1="70" x2="200" y2="150" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          <line x1="200" y1="250" x2="200" y2="330" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          <line x1="70" y1="200" x2="150" y2="200" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          <line x1="250" y1="200" x2="330" y2="200" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          <line x1="105" y1="105" x2="165" y2="165" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          <line x1="235" y1="235" x2="295" y2="295" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          <line x1="105" y1="295" x2="165" y2="235" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          <line x1="235" y1="165" x2="295" y2="105" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left space-y-6">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block">
            HAI ANCORA DUBBI?
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Parliamone. <br />
            <span className="text-orange-500">Insieme troviamo la soluzione.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
            Hai un'emergenza o preferisci parlare a voce con Nunzio? Chiamaci subito o scrivici su WhatsApp per fissare un appuntamento immediato.
          </p>

          {/* CTA Buttons matching mockup */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="tel:3249991990"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-950/50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Chiama ora</span>
            </a>

            <a
              href="https://wa.me/393249991990?text=Salve,%20vorrei%20informazioni%20su%20un%20preventivo%20per%20la%20mia%20auto."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#1a1f29] hover:bg-[#232936] text-white font-bold text-sm rounded-xl border border-slate-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Scrivici su WhatsApp</span>
            </a>
          </div>

          {/* Address & Phone Bar matching mockup */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs sm:text-sm text-slate-300">
            <a
              href="https://maps.google.com/?q=Via+Caduti+di+Nassirya+Palagiano+TA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-orange-400 transition-colors"
            >
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Via Caduti di Nassirya, Palagiano (TA)</span>
            </a>

            <a
              href="tel:3249991990"
              className="flex items-center gap-2 hover:text-orange-400 transition-colors font-semibold"
            >
              <Phone className="w-4 h-4 text-orange-500 shrink-0" />
              <span>324 999 1990</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
