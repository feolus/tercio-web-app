import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
export let firebaseInitializationError: Error | null = null;

try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_API_KEY,
      authDomain: import.meta.env.VITE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_APP_ID
    };

    const missingVars = Object.entries(firebaseConfig)
      .filter(([, value]) => !value)
      .map(([key]) => `VITE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

    if (missingVars.length > 0) {
      throw new Error(`Firebase configuration is missing the following environment variables: ${missingVars.join(', ')}. Please set them in your Netlify project settings.`);
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

} catch (error) {
    if (error instanceof Error) {
        firebaseInitializationError = error;
    } else {
        firebaseInitializationError = new Error('An unknown error occurred during Firebase initialization.');
    }
}

export { app, auth, db };