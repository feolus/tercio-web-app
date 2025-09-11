// FIX: Updated Firebase initialization to use v9 compatibility mode to resolve import errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8YrctE-c3cVjCl8W_HWAXvXuvOkRvDzo",
  authDomain: "tercio-web-app.firebaseapp.com",
  projectId: "tercio-web-app",
  storageBucket: "tercio-web-app.appspot.com",
  messagingSenderId: "756613251002",
  appId: "1:756613251002:web:a969485e8277fbb9bba783"
};

// FIX: Ensure Firebase is only initialized once.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();

export default firebase.app();