import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Raccontaci cosa succede',
      desc: 'Compila il modulo e dicci di cosa ha bisogno la tua auto.',
    },
    {
      number: '2',
      title: 'Valutiamo la richiesta',
      desc: 'Ti ricontatteremo per capire meglio la tua esigenza.',
    },
    {
      number: '3',
      title: 'Ricevi il tuo preventivo',
      desc: 'Ti daremo tutte le informazioni per procedere.',
    },
  ];

  return (
    <section id="come-funziona" className="py-20 sm:py-24 bg-white text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left max-w-2xl mb-14 sm:mb-16">
          <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
            COME FUNZIONA
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Richiedere un preventivo è semplice.
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Niente code o attese al telefono: 3 semplici passaggi per ricevere l'assistenza che ti serve.
          </p>
        </div>

        {/* 3 Step Flow matching Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative flex flex-col items-start">
              
              {/* Row with Number Badge & Desktop Arrow */}
              <div className="flex items-center justify-between w-full mb-5">
                <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-orange-600/30">
                  {step.number}
                </div>

                {/* Arrow to next step (only for steps 1 and 2 on desktop) */}
                {idx < 2 && (
                  <div className="hidden md:flex items-center text-slate-300 pr-6">
                    <ArrowRight className="w-6 h-6 stroke-[1.5]" />
                  </div>
                )}
              </div>

              {/* Step Title & Description */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
