import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowItWorks } from './components/HowItWorks';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { VinHelperModal } from './components/VinHelperModal';
import { AdminDashboard } from './components/AdminDashboard';
import { QuoteRequest } from './types';
import { auth, subscribeToQuoteRequests } from './firebase';
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth';
import { MessageSquare, ChevronUp } from 'lucide-react';

export default function App() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [isVinHelperOpen, setIsVinHelperOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'site' | 'admin'>(() => {
    return window.location.hash === '#admin' ? 'admin' : 'site';
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync hash with current view
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('site');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Subscribe to real-time quotes updates from Firestore
  useEffect(() => {
    let active = true;
    let authCheck = 0;
    let unsubscribeQuotes: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const currentCheck = ++authCheck;
      unsubscribeQuotes?.();
      unsubscribeQuotes = undefined;

      if (!user) {
        setQuotes([]);
        return;
      }

      void getIdTokenResult(user, true).then(({ claims }) => {
        if (!active || currentCheck !== authCheck) return;
        if (claims.admin === true) {
          unsubscribeQuotes = subscribeToQuoteRequests(setQuotes, () => setQuotes([]));
        } else {
          setQuotes([]);
        }
      }).catch(() => {
        if (active && currentCheck === authCheck) setQuotes([]);
      });
    });

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      active = false;
      unsubscribeAuth();
      unsubscribeQuotes?.();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openAdminView = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToSiteView = () => {
    window.location.hash = '';
    setCurrentView('site');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceFromSection = (serviceName: string) => {
    setSelectedService(serviceName);
    const formElement = document.getElementById('preventivo');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If the admin view is requested (via #admin or button click), render the full password-protected page
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        quotes={quotes}
        onBackToSite={backToSiteView}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* One-page layout: ogni sezione è una tappa naturale dello scroll */}
      <main id="contenuto-principale" className="flex-1">
        {/* Hero Section with Form */}
        <Hero
          onOpenVinHelper={() => setIsVinHelperOpen(true)}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />

        {/* Services Section */}
        <Services onSelectService={handleSelectServiceFromSection} />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Call To Action & Contact Section */}
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer onOpenDashboard={openAdminView} />

      {/* Modals */}
      <VinHelperModal
        isOpen={isVinHelperOpen}
        onClose={() => setIsVinHelperOpen(false)}
      />

      {/* Floating Action Controls for Mobile / Desktop */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2.5">
        {/* WhatsApp Fast Floating Button */}
        <a
          href="https://wa.me/393249991990?text=Salve%20Autofficina%20Putignano,%20vorrei%20informazioni%20su%20un%20preventivo."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl shadow-emerald-950/60 transition-transform hover:scale-105 active:scale-95 group"
          aria-label="Contattaci su WhatsApp"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline-block pr-1 text-xs font-bold">WhatsApp</span>
        </a>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full shadow-lg border border-slate-700 transition-all cursor-pointer"
            aria-label="Torna su"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
