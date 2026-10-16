import React from 'react';
import { 
  Cpu, 
  Wrench, 
  Settings, 
  CircleDot, 
  FileCheck2,
  ArrowRight
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'diagnosi',
      title: 'Diagnosi elettronica',
      desc: 'Spie accese o comportamenti anomali? Troviamo la causa con strumentazione computerizzata di ultima generazione.',
      icon: (
        <svg className="w-9 h-9 text-orange-600 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M1 10v4M23 10v4M7 2v4M17 2v4M7 18v4M17 18v4" />
          <path d="M7 12h2l1-2 2 4 1-2h4" />
        </svg>
      ),
      badge: 'Multimarca'
    },
    {
      id: 'meccanica',
      title: 'Riparazioni meccaniche',
      desc: 'Interveniamo sui guasti con la giusta competenza: motore, freni, frizione, sospensioni e sterzo.',
      icon: (
        <svg className="w-9 h-9 text-orange-600 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      badge: 'Ricambi OE'
    },
    {
      id: 'tagliandi',
      title: 'Tagliandi e manutenzione',
      desc: 'Per mantenere la tua auto efficiente e sicura, preservando la garanzia ufficiale del costruttore.',
      icon: (
        <svg className="w-9 h-9 text-orange-600 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      badge: 'Certificato'
    },
  ];

  return (
    <section id="servizi" className="py-20 sm:py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-2xl mb-12 sm:mb-16">
          <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
            I NOSTRI SERVIZI
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Cosa possiamo fare per la tua auto?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Diagnosi, riparazioni e manutenzione
            Ti aiutiamo a rimetterti in strada, in sicurezza.
          </p>
        </div>

        {/* 3-column / 2-column Grid matching the mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service.title)}
              className="group relative p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Icon matching the orange line art in mockup */}
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>

                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {service.badge}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                <span>Richiedi preventivo per questo servizio</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>
          ))}

          {/* Bonus 6th Box: Customer Service Assistance */}
          <div className="p-7 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white flex flex-col justify-between border border-slate-800 shadow-lg">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6 font-bold text-lg">
                PN
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Non sai esattamente cosa ha l'auto?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Rumori strani, vibrazioni in frenata o perdita di potenza? Passa in officina a Palagiano per un check-up visivo immediato senza impegno.
              </p>
            </div>

            <a
              href="tel:3249991990"
              className="inline-flex items-center justify-center w-full py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase rounded-xl transition-colors tracking-wider"
            >
              Chiama il meccanico
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
