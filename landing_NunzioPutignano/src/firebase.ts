import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy,
  updateDoc,
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { QuoteRequest } from './types';
import firebaseAppletConfig from '../firebase-applet-config.json';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseAppletConfig.measurementId || undefined,
};

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
const firestoreDatabaseId = import.meta.env.VITE_FIRESTORE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId || '(default)';

const missingConfig = Object.entries(firebaseConfig)
  .filter(([key, value]) => key !== 'measurementId' && !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  throw new Error(`Missing Firebase env vars: ${missingConfig.join(', ')}`);
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
if (recaptchaSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}
export const db = getFirestore(app, firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.warn('Firestore Error Context:', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot as recommended by skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'quoteRequests', 'test-connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or starting up.");
    }
  }
}
testConnection();

const COLLECTION_NAME = 'quoteRequests';

export async function submitQuoteRequest(data: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>): Promise<{ id: string; success: boolean }> {
  const customId = `quote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanData: Record<string, any> = {
    fullName: data.fullName.trim(),
    phoneNumber: data.phoneNumber.trim(),
    carModel: data.carModel.trim(),
    vin: data.vin.trim().toUpperCase(),
    notes: data.notes.trim(),
    status: 'nuova',
    createdAt: serverTimestamp(),
  };

  if (data.serviceType && data.serviceType.trim()) {
    cleanData.serviceType = data.serviceType.trim();
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, cleanData);
    return { id: customId, success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${customId}`);
    throw error;
  }
}

export function subscribeToQuoteRequests(
  onUpdate: (quotes: QuoteRequest[]) => void,
  onError?: (err: any) => void
) {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    
    return onSnapshot(
      q,
      (snapshot) => {
        const results: QuoteRequest[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          results.push({
            id: docSnap.id,
            fullName: data.fullName || '',
            phoneNumber: data.phoneNumber || '',
            carModel: data.carModel || '',
            vin: data.vin || '',
            serviceType: data.serviceType || 'Generale',
            notes: data.notes || '',
            status: data.status || 'nuova',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
          });
        });

        onUpdate(results);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
        onUpdate([]);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
    onUpdate([]);
    return () => {};
  }
}

export async function updateQuoteStatus(id: string, status: QuoteRequest['status']): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
    throw error;
  }
}

export async function deleteQuoteRequest(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    throw error;
  }
}
