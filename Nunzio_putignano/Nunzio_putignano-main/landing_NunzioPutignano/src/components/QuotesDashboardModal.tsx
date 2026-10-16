import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Phone, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Wrench, 
  Car, 
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { QuoteRequest } from '../types';
import { updateQuoteStatus, deleteQuoteRequest } from '../firebase';

interface QuotesDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: QuoteRequest[];
}

export const QuotesDashboardModal: React.FC<QuotesDashboardModalProps> = ({
  isOpen,
  onClose,
  quotes,
}) => {
  const [filter, setFilter] = useState<'all' | 'nuova' | 'contattato' | 'completata'>('all');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter = filter === 'all' ? true : q.status === filter;
    const matchesSearch = 
      q.fullName.toLowerCase().includes(search.toLowerCase()) ||
      q.phoneNumber.includes(search) ||
      q.carModel.toLowerCase().includes(search.toLowerCase()) ||
      q.vin.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: QuoteRequest['status']) => {
    try {
      await updateQuoteStatus(id, newStatus);
      setActionMessage('Stato aggiornato con successo');
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      setActionMessage('Errore durante l\'aggiornamento');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questa richiesta?')) {
      try {
        await deleteQuoteRequest(id);
        setActionMessage('Richiesta eliminata');
        setTimeout(() => setActionMessage(null), 3000);
      } catch {
        setActionMessage('Errore eliminazione');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#16191f] text-slate-100 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#121418]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Database Richieste Preventivo</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {quotes.length} totali
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dati sincronizzati in tempo reale con Firebase Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Chiudi finestra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {actionMessage && (
          <div className="px-5 py-2 bg-emerald-950/50 border-b border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {actionMessage}
          </div>
        )}

        {/* Filters and search */}
        <div className="p-4 bg-[#14161b] border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca per cliente, auto, telaio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'nuova', 'contattato', 'completata'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  filter === tab
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'Tutte le richieste' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* List of Quotes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/50">
          {filteredQuotes.length === 0 ? (
            <div className="py-16 text-center">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-medium text-sm">Nessuna richiesta trovata</p>
              <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                {search ? 'Nessun risultato corrispondente alla ricerca.' : 'Invia una richiesta dal form nella pagina principale per vederla apparire qui in tempo reale.'}
              </p>
            </div>
          ) : (
            filteredQuotes.map((quote) => (
              <div 
                key={quote.id} 
                className="pt-3 first:pt-0 pb-2 bg-[#1a1d24]/60 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-base">{quote.fullName}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {quote.serviceType || 'Servizio Generale'}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        quote.status === 'nuova'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : quote.status === 'contattato'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : quote.status === 'completata'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      ● {quote.status || 'nuova'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Adesso'}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-3 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Car className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Veicolo</span>
                      <strong className="text-white">{quote.carModel}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Wrench className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">N. Telaio (VIN)</span>
                      <code className="text-orange-300 font-mono font-semibold">{quote.vin}</code>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Telefono</span>
                      <a href={`tel:${quote.phoneNumber}`} className="text-white hover:underline font-semibold">
                        {quote.phoneNumber}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {quote.notes && (
                  <div className="text-xs text-slate-300 bg-black/30 p-2.5 rounded-lg border border-slate-800/80 mb-3">
                    <span className="text-slate-500 font-medium block text-[10px] uppercase mb-0.5">Note sui lavori richiesti:</span>
                    <p className="whitespace-pre-wrap leading-relaxed">{quote.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${quote.phoneNumber.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Chiama
                    </a>
                    <a
                      href={`https://wa.me/${quote.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Salve ${quote.fullName}, la contattiamo dall'Autofficina Nunzio Putignano in merito alla sua richiesta di preventivo per la sua ${quote.carModel}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/30 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Aggiorna stato:</span>
                    <select
                      value={quote.status || 'nuova'}
                      onChange={(e) => handleStatusChange(quote.id!, e.target.value as QuoteRequest['status'])}
                      className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-500"
                    >
                      <option value="nuova">Nuova</option>
                      <option value="contattato">Contattato</option>
                      <option value="in_lavorazione">In Lavorazione</option>
                      <option value="completata">Completata</option>
                    </select>

                    <button
                      onClick={() => handleDelete(quote.id!)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Elimina richiesta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#111317] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Autofficina Nunzio Putignano • Palagiano (TA)</span>
          <span>Sincronizzato con Cloud Firestore</span>
        </div>
      </div>
    </div>
  );
};
