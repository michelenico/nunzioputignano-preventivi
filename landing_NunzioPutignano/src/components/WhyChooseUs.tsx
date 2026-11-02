import React from 'react';
import { ShieldCheck, Users, MessageSquareQuote, Check } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="perche-noi" className="py-20 lg:py-28 bg-[#13161c] text-white overflow-hidden border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual: Workshop Atmosphere / Mechanic Representation */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 group">
              {/* Automotive Workshop Mechanic SVG Illustration */}
              <div className="aspect-[4/5] w-full bg-gradient-to-b from-[#1a1e27] via-[#151820] to-[#0e1014] relative flex items-center justify-center p-6">
                
                {/* Glow & Lighting */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

                {/* Technical Graphic of Workshop / Mechanic Engine */}
                <div className="w-full max-w-sm space-y-4 relative z-10">
                  <div className="p-5 rounded-2xl bg-[#1e232e]/90 border border-slate-700 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-black text-white text-base">
                        PN
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Nunzio Putignano</div>
                        <div className="text-xs text-orange-400 font-medium">Capo Meccanico & Titolare</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "Il nostro impegno principale è farti guidare sicuro, spiegandoti sempre ogni lavoro prima di toccare la tua auto."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <div className="text-2xl font-black text-white">20+</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">Anni nel settore auto</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <div className="text-2xl font-black text-orange-400">100%</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">Preventivi trasparenti</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-orange-950/30 border border-orange-500/30 text-xs text-orange-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Officina autorizzata a Palagiano (TA)</span>
                  </div>
                </div>

                {/* Subtitle brand tag */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">
                    Tecnologia diagnostica all'avanguardia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div>
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block mb-3">
                PERCHÉ SCEGLIERCI
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Competenza, ascolto <br />
                <span className="text-orange-500">e trasparenza.</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Non ti avvolgiamo di tecnicismi. Ti ascoltiamo, valutiamo il problema e ti spieghiamo come procedere, passo dopo passo.
              </p>
            </div>

            {/* 3 Key Highlights matching the Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              
              {/* Item 1 */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-bold text-white text-base leading-snug">
                  Esperienza e competenza
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aggiornamento continuo su motori endotermici, ibridi e centraline di ultima generazione.
                </p>
              </div>

              {/* Item 2 */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <Users className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-bold text-white text-base leading-snug">
                  Un punto di riferimento a Palagiano
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Un'officina radicata nel territorio che mette al primo posto la fiducia dei propri concittadini.
                </p>
              </div>

              {/* Item 3 */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <MessageSquareQuote className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-bold text-white text-base leading-snug">
                  Spiegazioni chiare e senza sorprese
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ti illustriamo sempre i costi prima di procedere. Nessun lavoro extra senza la tua autorizzazione.
                </p>
              </div>

            </div>

            {/* Call to action anchor */}
            <div className="pt-2">
              <a
                href="#preventivo"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm uppercase tracking-wide rounded-xl shadow-lg shadow-orange-950/50 transition-colors"
              >
                Raccontaci il tuo problema
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
