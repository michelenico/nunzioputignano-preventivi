import { useEffect, useState } from 'react';
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth';
import { auth, subscribeToQuoteRequests } from '../firebaseClient';
import type { QuoteRequest } from '../types';
import { AdminDashboard } from './AdminDashboard';

interface AdminContainerProps {
  onBackToSite: () => void;
}

export function AdminContainer({ onBackToSite }: AdminContainerProps) {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);

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

    return () => {
      active = false;
      unsubscribeAuth();
      unsubscribeQuotes?.();
    };
  }, []);

  return <AdminDashboard quotes={quotes} onBackToSite={onBackToSite} />;
}