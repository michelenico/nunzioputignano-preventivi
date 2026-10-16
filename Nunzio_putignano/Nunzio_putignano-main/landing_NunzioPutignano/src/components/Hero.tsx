import React, { useState } from 'react';
import { 
  Lock, 
  HelpCircle, 
  CheckCircle2, 
  Loader2, 
  MessageSquare, 
  AlertCircle,
  Car,
  ChevronDown
} from 'lucide-react';
import { submitQuoteRequest } from '../firebase';
import { ServiceTypeOption } from '../types';
import { PhoneNumberInput } from './PhoneNumberInput';

interface HeroProps {
  onOpenVinHelper: () => void;
  selectedService: string;
  setSelectedService: (s: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOpenVinHelper,
  selectedService,
  setSelectedService 
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carModel, setCarModel] = useState('');
  const [vin, setVin] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Inserisci il tuo nome e cognome completo.');
      return;
    }
    const nationalPhoneNumber = phoneNumber.replace(/^\+\d+\s*/, '').replace(/\D/g, '');
    if (nationalPhoneNumber.length < 5) {
      setErrorMessage('Inserisci un numero di telefono valido per essere ricontattato.');
      return;
    }
    if (!carModel.trim() || carModel.trim().length < 2) {
      setErrorMessage('Inserisci la marca e il modello della tua auto.');
      return;
    }
    if (!vin.trim() || vin.trim().length < 3) {
      setErrorMessage('Inserisci il numero di telaio (o le ultime cifre se non lo hai sottomano).');
      return;
    }
    if (!notes.trim() || notes.trim().length < 5) {
      setErrorMessage('Descrivi brevemente cosa succede o quali lavori sono necessari.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitQuoteRequest({
        fullName,
        phoneNumber,
        carModel,
        vin,
        serviceType: selectedService || 'Diagnosi o riparazione generale',
        notes,
      });

      setSubmittedId(res.id);
      setIsSubmitting(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage('Si è verificato un errore durante l\'invio. Riprova tra poco.');
    }
  };

  const resetForm = () => {
    setSubmittedId(null);
    setFullName('');
    setPhoneNumber('');
    setCarModel('');
    setVin('');
    setNotes('');
  };

  return (
    <section 
      id="preventivo" 
      className="relative min-h-[640px] pt-10 pb-16 lg:py-20 bg-[#121419] overflow-hidden"
    >
      {/* Background Automotive Visual Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-35 mix-blend-luminosity overflow-hidden">
        {/* Subtle Workshop Gradient & Car Silhouette */}
        <div className="absolute -top-32 right-0 w-[600px] lg:w-[850px] h-full bg-gradient-to-l from-orange-500/10 via-transparent to-transparent blur-3xl" />
        <svg
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-[700px] lg:w-[950px] h-auto text-slate-800/40"
          viewBox="0 0 1000 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* High-tech mechanic workshop engine & car lines */}
          <path
            d="M 100 480 Q 250 490 350 400 L 450 360 Q 600 230 750 250 L 900 350 Q 980 430 990 490"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="8 6"
          />
          <circle cx="350" cy="480" r="70" stroke="currentColor" strokeWidth="3" />
          <circle cx="350" cy="480" r="30" stroke="currentColor" strokeWidth="2" />
          <circle cx="820" cy="480" r="70" stroke="currentColor" strokeWidth="3" />
          <circle cx="820" cy="480" r="30" stroke="currentColor" strokeWidth="2" />
          <path
            d="M 280 480 L 890 480"
            stroke="currentColor"
            strokeWidth="3"
          />
          <rect x="520" y="160" width="160" height="90" rx="8" stroke="currentColor" strokeWidth="2" />
          <path d="M 540 200 L 660 200 M 540 220 L 620 220" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headlines & Callout */}
          <div className="lg:col-span-6 space-y-6 text-left">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              La tua auto ha <br />
              un problema? <br />
              <span className="text-orange-500 underline decoration-orange-500/40 decoration-4 underline-offset-8">
                Vediamo insieme.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Raccontaci cosa succede alla tua auto e richiedi un preventivo per il tuo caso.
              Valutiamo ogni dettaglio con la massima trasparenza, senza costi imprevisti.
            </p>

            {/* Quick Badges */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-orange-400 font-bold block text-sm">Tempi Rapidi</span>
                Risposta in giornata
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-orange-400 font-bold block text-sm">Ricambi Certificati</span>
                Garanzia 100%
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-orange-400 font-bold block text-sm">Zero Sorprese</span>
                Prezzo chiaro
              </div>
            </div>
          </div>

          {/* Right Column: Hero Form Card matching Mockup */}
          <div className="lg:col-span-6">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100 transition-all">
              
              {submittedId ? (
                /* Success View */
                <div className="text-center py-6 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Richiesta Ricevuta!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-5 leading-relaxed">
                    Grazie <strong className="text-slate-900">{fullName}</strong>! La tua richiesta per la <strong className="text-slate-900">{carModel}</strong> è stata salvata con successo. Ti ricontatteremo a breve al numero <strong className="text-slate-900">{phoneNumber}</strong>.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 mb-6 text-left space-y-1">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Codice pratica:</span>
                      <span className="font-mono text-slate-900 font-bold">{submittedId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Telaio:</span>
                      <span className="font-mono text-slate-900">{vin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Intervento:</span>
                      <span className="text-slate-900">{selectedService || 'Generale'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`https://wa.me/393249991990?text=${encodeURIComponent(
                        `Salve Autofficina Nunzio Putignano, ho appena inviato la richiesta di preventivo online #${submittedId} per ${fullName} (${carModel}, telaio: ${vin}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Invia copia su WhatsApp
                    </a>

                    <button
                      onClick={resetForm}
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
                    >
                      Nuova richiesta
                    </button>
                  </div>
                </div>
              ) : (
                /* Submission Form */
                <>
                  <div className="mb-5">
                    <h2 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
                      Richiedi il tuo preventivo
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Compila i dati per ricevere la nostra migliore offerta.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Nome e cognome */}
                    <div>
                      <label htmlFor="fullName" className="sr-only">Nome e cognome *</label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nome e cognome *"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Numero di telefono */}
                    <div>
                      <label htmlFor="phoneNumber" className="sr-only">Numero di telefono *</label>
                      <PhoneNumberInput
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                      />
                    </div>

                    {/* Modello macchina */}
                    <div>
                      <label htmlFor="carModel" className="sr-only">Marca e modello dell'auto *</label>
                      <input
                        id="carModel"
                        type="text"
                        required
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                        placeholder="Marca e modello dell'auto *"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Numero telaio with Helper Button */}
                    <div className="relative">
                      <label htmlFor="vin" className="sr-only">Numero telaio *</label>
                      <input
                        id="vin"
                        type="text"
                        required
                        value={vin}
                        onChange={(e) => setVin(e.target.value.toUpperCase())}
                        placeholder="Numero telaio (VIN) *"
                        className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all uppercase"
                      />
                      <button
                        type="button"
                        onClick={onOpenVinHelper}
                        title="Dove trovo il numero di telaio?"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                        aria-label="Info numero telaio"
                      >
                        <HelpCircle className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Di cosa hai bisogno? */}
                    <div className="relative">
                      <label htmlFor="serviceType" className="sr-only">Di cosa hai bisogno?</label>
                      <select
                        id="serviceType"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-10 cursor-pointer"
                      >
                        <option value="">Di cosa hai bisogno? (Seleziona intervento)</option>
                        <option value="Diagnosi elettronica">Diagnosi elettronica (spie accese)</option>
                        <option value="Riparazioni meccaniche">Riparazioni meccaniche (motore, freni, frizione)</option>
                        <option value="Tagliandi e manutenzione">Tagliandi e manutenzione periodica</option>
                        <option value="Pneumatici">Pneumatici (sostituzione, convergenza)</option>
                        <option value="Revisioni">Revisione periodica ministeriale</option>
                        <option value="Altro intervento">Altro intervento personalizzato</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Note sui lavori richiesti */}
                    <div>
                      <label htmlFor="notes" className="sr-only">Note sui lavori richiesti *</label>
                      <textarea
                        id="notes"
                        required
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Raccontaci cosa succede (note sui lavori richiesti) *"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:from-[#f97316] hover:to-[#ea580c] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase rounded-xl shadow-lg shadow-orange-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>INVIO IN CORSO...</span>
                        </>
                      ) : (
                        <span>RICHIEDI IL PREVENTIVO</span>
                      )}
                    </button>

                    {/* Microcopy reassurance */}
                    <p className="text-center text-xs text-slate-500 pt-1">
                      Ti ricontatteremo per capire meglio la tua richiesta.
                    </p>

                    {/* Security Badge */}
                    <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>I tuoi dati sono al sicuro e verranno trattati secondo la nostra privacy policy.</span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
