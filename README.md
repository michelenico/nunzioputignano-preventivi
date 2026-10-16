<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6f50ef1f-d363-4730-94aa-43f89cbe6a9c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Sicurezza dell'area amministrativa

L'area admin usa Firebase Authentication con email/password e richiede il custom claim `admin: true`. Non esistono credenziali predefinite nel codice.

1. In Firebase Console, abilita il provider **Email/Password** in Authentication e crea l'account amministratore. Non abilitare la registrazione dall'app.
2. Assegna il custom claim all'UID dell'account da un ambiente fidato con Firebase Admin SDK (mai dal browser):

   ```js
   import { initializeApp, applicationDefault } from 'firebase-admin/app';
   import { getAuth } from 'firebase-admin/auth';

   initializeApp({ credential: applicationDefault() });
   await getAuth().setCustomUserClaims('UID_AMMINISTRATORE', { admin: true });
   ```

   Sostituisci `UID_AMMINISTRATORE` con l'UID dell'utente. Dopo aver assegnato il claim, disconnetti e riconnetti l'account.
3. Pubblica il contenuto di `firestore.rules` nelle regole Cloud Firestore del progetto. Fino alla pubblicazione, le regole già distribuite continuano ad applicarsi.
4. Per limitare l'invio automatizzato di richieste, registra l'app web in **App Check** con reCAPTCHA v3, inserisci la site key in `firebase-applet-config.json`, verifica i token in modalità monitoraggio e poi attiva l'enforcement per Cloud Firestore. La chiave è attualmente vuota e l'enforcement non è attivo.

Le richieste inviate dal sito sono pubbliche solo in creazione; lettura, modifica dello stato ed eliminazione richiedono il claim amministrativo. Le richieste non vengono più conservate nel `localStorage` del visitatore.


## Sicurezza prima della pubblicazione

- Pubblica le regole Firestore (`firestore.rules`) e verifica con Firebase Emulator Suite che gli utenti non autenticati non possano leggere, modificare o cancellare richieste.
- Configura Firebase App Check con reCAPTCHA v3: inserisci la site key nel file di configurazione e abilita l'applicazione App Check per Cloud Firestore nella console Firebase. La site key è pubblica; non inserirvi mai chiavi segrete.
- Abilita MFA per gli account amministrativi e limita gli account autorizzati. Valuta una Cloud Function/server per rate limiting e protezione anti-spam delle richieste.
- Imposta sul server/hosting gli header HTTP `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`. I meta tag non sostituiscono gli header HTTP.
- La Firebase Web API key è visibile nel browser per natura: proteggi il progetto tramite Authentication, regole Firestore, App Check e restrizioni della chiave in Google Cloud, non cercando di nasconderla nel frontend.
