import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  Database, 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Phone, 
  MessageSquare, 
  Trash2, 
  Copy, 
  Check, 
  Clock, 
  Car, 
  Wrench, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle,
  LogOut,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { QuoteRequest } from '../types';
import { auth, submitQuoteRequest, updateQuoteStatus, deleteQuoteRequest } from '../firebase';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getIdTokenResult,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

interface AdminDashboardProps {
  quotes: QuoteRequest[];
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ quotes, onBackToSite }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'nuova' | 'contattato' | 'in_lavorazione' | 'completata'>('all');
  const [copiedVinId, setCopiedVinId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // Form for manual new entry
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCar, setManualCar] = useState('');
  const [manualVin, setManualVin] = useState('');
  const [manualService, setManualService] = useState('Diagnosi elettronica');
  const [manualNotes, setManualNotes] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setIsAuthLoading(false);
        return;
      }

      setIsAuthLoading(true);
      void getIdTokenResult(user, true).then(({ claims }) => {
        if (!active || auth.currentUser?.uid !== user.uid) return;
        const isAdmin = claims.admin === true;
        setIsAuthenticated(isAdmin);
        setIsAuthLoading(false);
        if (!isAdmin) {
          setAuthError('Questo account non è autorizzato ad accedere al pannello.');
          void signOut(auth);
        }
      }).catch(() => {
        if (!active || auth.currentUser?.uid !== user.uid) return;
        setIsAuthenticated(false);
        setIsAuthLoading(false);
        setAuthError('Impossibile verificare le autorizzazioni dell’account.');
        void signOut(auth);
      });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Notification Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const { user } = await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      const { claims } = await getIdTokenResult(user, true);
      if (claims.admin !== true) {
        await signOut(auth);
        setAuthError('Questo account non è autorizzato ad accedere al pannello.');
        return;
      }
      setIsAuthenticated(true);
      setAuthError(null);
      showToast('Accesso effettuato con successo!');
    } catch {
      setAuthError('Accesso non riuscito. Verifica email e password.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
  };

  // Copy VIN to clipboard
  const handleCopyVin = (vin: string, id: string) => {
    navigator.clipboard.writeText(vin);
    setCopiedVinId(id);
    showToast(`Numero telaio ${vin} copiato negli appunti!`);
    setTimeout(() => setCopiedVinId(null), 2500);
  };

  // Change status in Firestore
  const handleStatusChange = async (id: string, newStatus: QuoteRequest['status']) => {
    try {
      await updateQuoteStatus(id, newStatus);
      showToast('Stato richiesta aggiornato!');
    } catch {
      showToast('Errore durante l\'aggiornamento dello stato.');
    }
  };

  // Delete quote
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Sei sicuro di voler eliminare la richiesta di ${name}?`)) {
      try {
        await deleteQuoteRequest(id);
        showToast('Richiesta eliminata con successo.');
      } catch {
        showToast('Errore durante l\'eliminazione.');
      }
    }
  };

  // Save manual request
  const handleSaveManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone || !manualCar || !manualVin) {
      alert('Compila tutti i campi obbligatori');
      return;
    }
    setIsSavingManual(true);
    try {
      await submitQuoteRequest({
        fullName: manualName,
        phoneNumber: manualPhone,
        carModel: manualCar,
        vin: manualVin,
        serviceType: manualService,
        notes: manualNotes || 'Inserimento manuale da officina',
      });
      setIsSavingManual(false);
      setIsAddModalOpen(false);
      setManualName('');
      setManualPhone('');
      setManualCar('');
      setManualVin('');
      setManualNotes('');
      showToast('Richiesta salvata nel database Firebase!');
    } catch {
      setIsSavingManual(false);
      showToast('Errore nel salvataggio');
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (quotes.length === 0) {
      alert('Nessuna richiesta da esportare.');
      return;
    }

    const csvCell = (value: string) => {
      const safeValue = /^[\t\r ]*[=+\-@]/.test(value) ? `'${value}` : value;
      return `"${safeValue.replace(/"/g, '""')}"`;
    };
    const headers = ['ID', 'Data', 'Stato', 'Cliente', 'Telefono', 'Modello Auto', 'Numero Telaio', 'Servizio', 'Note'];
    const rows = quotes.map((q) => [
      q.id || '',
      q.createdAt ? new Date(q.createdAt).toLocaleString('it-IT') : '',
      q.status || 'nuova',
      q.fullName || '',
      q.phoneNumber || '',
      q.carModel || '',
      q.vin || '',
      q.serviceType || '',
      q.notes || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
      headers.map(csvCell).join(';'),
      ...rows.map(row => row.map(csvCell).join(';'))
    ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `richieste_preventivi_putignano_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV esportato con successo!');
  };

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) => {
    const matchesStatus = statusFilter === 'all' ? true : q.status === statusFilter;
    const qText = searchQuery.toLowerCase();
    const matchesSearch =
      q.fullName.toLowerCase().includes(qText) ||
      q.phoneNumber.toLowerCase().includes(qText) ||
      q.carModel.toLowerCase().includes(qText) ||
      q.vin.toLowerCase().includes(qText) ||
      (q.serviceType && q.serviceType.toLowerCase().includes(qText)) ||
      (q.notes && q.notes.toLowerCase().includes(qText));

    return matchesStatus && matchesSearch;
  });

  // Calculate Statistics
  const totalCount = quotes.length;
  const newCount = quotes.filter(q => !q.status || q.status === 'nuova').length;
  const inProgressCount = quotes.filter(q => q.status === 'contattato' || q.status === 'in_lavorazione').length;
  const completedCount = quotes.filter(q => q.status === 'completata').length;

  if (isAuthLoading) {
    return <div className="min-h-screen bg-[#0e1014] text-slate-300 flex items-center justify-center">Verifica accesso...</div>;
  }

  // Login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e1014] text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#161920] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          
          {/* Back button */}
          <button
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al sito web
          </button>

          {/* Header & Lock Icon */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-600/10 border border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Area Riservata Officina</h1>
            <p className="text-xs text-slate-400 mt-1">
              Accedi con l’account autorizzato per consultare le richieste
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="username"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nome@esempio.it"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Inserisci password..."
                  autoComplete="current-password"
                  className="w-full pl-4 pr-11 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-orange-600 focus:ring-orange-500 bg-slate-900"
                />
                <span>Ricorda accesso</span>
              </label>

            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm tracking-wide uppercase rounded-xl shadow-lg shadow-orange-950/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Accedi al Database</span>
            </button>
          </form>

          {/* Quick hint box */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center leading-relaxed">
            Accesso protetto per il personale autorizzato dell'<strong>Autofficina Nunzio Putignano</strong>.
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARD VIEW WHEN AUTHENTICATED
  return (
    <div className="min-h-screen bg-[#0e1014] text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-orange-500/40 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-[#14161c]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Torna al sito principale"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-black text-white text-sm shadow">
                PN
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
                    Pannello Gestione Preventivi
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Firebase Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Autofficina Nunzio Putignano • Palagiano (TA)
                </p>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Nuova Richiesta</span>
              <span className="sm:hidden">Aggiungi</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Esporta elenco in formato CSV / Excel"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">Esporta CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-300 text-xs font-semibold border border-red-500/30 transition-colors cursor-pointer"
              title="Disconnetti dalla sessione"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Esci</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#151820] border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Totale Richieste</span>
              <Database className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Archiviate su Firebase</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#151820] border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center justify-between text-xs text-amber-400 mb-2 font-semibold">
              <span>Nuove da Gestire</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">{newCount}</div>
            <div className="text-[11px] text-amber-400/70 mt-1">In attesa di contatto</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#151820] border border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center justify-between text-xs text-blue-400 mb-2 font-semibold">
              <span>In Lavorazione</span>
              <Wrench className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-300">{inProgressCount}</div>
            <div className="text-[11px] text-blue-400/70 mt-1">Contattati o in officina</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#151820] border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-center justify-between text-xs text-emerald-400 mb-2 font-semibold">
              <span>Completate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">{completedCount}</div>
            <div className="text-[11px] text-emerald-400/70 mt-1">Interventi conclusi</div>
          </div>
        </div>

        {/* Toolbar: Search and Filter Tabs */}
        <div className="p-4 rounded-2xl bg-[#151820] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca cliente, telefono, modello, telaio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {(
              [
                { id: 'all', label: 'Tutte' },
                { id: 'nuova', label: 'Nuove' },
                { id: 'contattato', label: 'Contattate' },
                { id: 'in_lavorazione', label: 'In Corso' },
                { id: 'completata', label: 'Completate' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredQuotes.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-[#14161c] border border-slate-800 p-8">
              <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-200">Nessuna richiesta trovata</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {searchQuery
                  ? 'Nessuna corrispondenza con i filtri di ricerca applicati.'
                  : 'Nessuna richiesta presente per questo stato. Puoi inviare una richiesta di test dal sito web o registrarla manualmente.'}
              </p>
            </div>
          ) : (
            filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-5 rounded-2xl bg-[#151820] border border-slate-800/90 hover:border-slate-700 transition-all shadow-md"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-bold text-white tracking-tight">
                      {quote.fullName}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                        quote.status === 'nuova' || !quote.status
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : quote.status === 'contattato'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : quote.status === 'in_lavorazione'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      ● {quote.status || 'nuova'}
                    </span>

                    {/* Service Type */}
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                      {quote.serviceType || 'Servizio Generale'}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {quote.createdAt ? new Date(quote.createdAt).toLocaleString('it-IT', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Adesso'}
                    </span>
                  </div>
                </div>

                {/* Details Grid: Car, VIN, Phone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                  {/* Veicolo */}
                  <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Veicolo</div>
                      <div className="text-sm font-bold text-white">{quote.carModel}</div>
                    </div>
                  </div>

                  {/* Numero di telaio */}
                  <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">N. Telaio (VIN)</div>
                        <div className="text-xs font-mono font-bold text-orange-300 truncate">{quote.vin}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyVin(quote.vin, quote.id!)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Copia numero di telaio"
                    >
                      {copiedVinId === quote.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Telefono */}
                  <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Recapito Cliente</div>
                        <a href={`tel:${quote.phoneNumber.replace(/\s+/g, '')}`} className="text-sm font-bold text-white hover:underline">
                          {quote.phoneNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {quote.notes && (
                  <div className="mb-4 p-3 bg-black/40 border border-slate-800 rounded-xl text-xs text-slate-300">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                      Note e lavori richiesti dal cliente:
                    </span>
                    <p className="whitespace-pre-wrap leading-relaxed">{quote.notes}</p>
                  </div>
                )}

                {/* Actions & Status Control Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                  {/* Direct Contact Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${quote.phoneNumber.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-xl transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Chiama
                    </a>

                    <a
                      href={`https://wa.me/${quote.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Salve ${quote.fullName}, la contattiamo dall'Autofficina Nunzio Putignano (Palagiano) in merito alla sua richiesta di preventivo per la sua ${quote.carModel}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/30 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>

                  {/* Status Dropdown and Delete */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Stato:</span>
                      <select
                        value={quote.status || 'nuova'}
                        onChange={(e) => handleStatusChange(quote.id!, e.target.value as QuoteRequest['status'])}
                        className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="nuova">Nuova (da gestire)</option>
                        <option value="contattato">Cliente Contattato</option>
                        <option value="in_lavorazione">In Lavorazione</option>
                        <option value="completata">Completata / Ritirata</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDelete(quote.id!, quote.fullName)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
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

      </main>

      {/* MODAL: Manual Add Request */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#161920] border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">Registra Nuova Richiesta</h3>
            <p className="text-xs text-slate-400 mb-5">
              Inserisci manualmente un intervento per un cliente passato in officina
            </p>

            <form onSubmit={handleSaveManual} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome e Cognome *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Es. Giuseppe Bianchi"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Telefono *</label>
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="Es. 333 1234567"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Modello Auto *</label>
                  <input
                    type="text"
                    required
                    value={manualCar}
                    onChange={(e) => setManualCar(e.target.value)}
                    placeholder="Es. Fiat Panda 1.2"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">N. Telaio (VIN) *</label>
                  <input
                    type="text"
                    required
                    value={manualVin}
                    onChange={(e) => setManualVin(e.target.value.toUpperCase())}
                    placeholder="ZFA12345..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Tipologia Servizio</label>
                  <select
                    value={manualService}
                    onChange={(e) => setManualService(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Diagnosi elettronica">Diagnosi elettronica</option>
                    <option value="Riparazioni meccaniche">Riparazioni meccaniche</option>
                    <option value="Tagliandi e manutenzione">Tagliandi e manutenzione</option>
                    <option value="Pneumatici">Pneumatici</option>
                    <option value="Revisioni">Revisioni</option>
                    <option value="Altro">Altro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Note Lavori</label>
                <textarea
                  rows={3}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Descrizione guasto, pezzi da ordinare..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSavingManual}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold"
                >
                  {isSavingManual ? 'Salvataggio...' : 'Salva su Firebase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
