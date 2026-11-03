import type { QuoteRequest } from './types';

type QuoteRequestInput = Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>;
type FirebaseClient = typeof import('./firebaseClient');

let firebaseClientPromise: Promise<FirebaseClient> | undefined;

function getFirebaseClient() {
  firebaseClientPromise ??= import('./firebaseClient');
  return firebaseClientPromise;
}

export function preloadFirebaseClient() {
  void getFirebaseClient().catch(() => undefined);
}

export async function submitQuoteRequest(data: QuoteRequestInput) {
  const client = await getFirebaseClient();
  return client.submitQuoteRequest(data);
}

export async function updateQuoteStatus(id: string, status: QuoteRequest['status']) {
  const client = await getFirebaseClient();
  return client.updateQuoteStatus(id, status);
}

export async function deleteQuoteRequest(id: string) {
  const client = await getFirebaseClient();
  return client.deleteQuoteRequest(id);
}
