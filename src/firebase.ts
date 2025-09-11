import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "tercio-web-app.firebaseapp.com",
  projectId: "tercio-web-app",
  storageBucket: "tercio-web-app.appspot.com",
  messagingSenderId: "756613251002",
  appId: "1:756613251002:web:a969485e8277fbb9bba783"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;