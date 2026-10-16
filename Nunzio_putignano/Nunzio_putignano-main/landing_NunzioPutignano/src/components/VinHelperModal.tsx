import React from 'react';
import { X, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

interface VinHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VinHelperModal: React.FC<VinHelperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#1a1d24] text-slate-100 rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden p-6"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Chiudi finestra"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Dove trovo il Numero di Telaio (VIN)?</h3>
            <p className="text-xs text-slate-400">Codice identificativo univoco a 17 caratteri</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-1">1. Sul Libretto di Circolazione (Carta di Circolazione / DU)</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cerca la <strong className="text-orange-400">lettera (E)</strong> sulla facciata interna del libretto. Troverai una sequenza alfanumerica di 17 caratteri (es. <span className="font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded text-orange-300">ZFA1990000...</span>).
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-1">2. Sulla tua Auto</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  È visibile anche nell'angolo inferiore sinistro del parabrezza (lato conducente) oppure impresso sulla targhetta nel montante della portiera anteriore o sotto il cofano motore.
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-orange-950/20 border border-orange-500/20 p-3 rounded-lg">
            💡 <strong>Perché è importante?</strong> Il numero di telaio ci permette di identificare i ricambi esatti compatibili al 100% con la tua vettura per un preventivo preciso senza errori.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Ho capito, torna al modulo
          </button>
        </div>
      </div>
    </div>
  );
};
