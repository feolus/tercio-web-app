import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../firebase';
// FIX: Using Firebase v9 compatibility syntax to fix import errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// FIX: Define FirebaseUser type using v9 compat syntax.
type FirebaseUser = firebase.User;

interface AuthContextType {
    authUser: FirebaseUser | null;
    loading: boolean;
    signup: (email: string, password: string) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
    authUser: null,
    loading: true,
    signup: async () => {},
    login: async () => {},
    logout: async () => {},
    loginWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        // FIX: Use v8 onAuthStateChanged method
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setAuthUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signup = (email: string, password: string) => {
        if (!auth) return Promise.reject(new Error('Firebase not initialized.'));
        // FIX: Use v8 createUserWithEmailAndPassword method
        return auth.createUserWithEmailAndPassword(email, password);
    };

    const login = (email: string, password: string) => {
        if (!auth) return Promise.reject(new Error('Firebase not initialized.'));
        // FIX: Use v8 signInWithEmailAndPassword method
        return auth.signInWithEmailAndPassword(email, password);
    };

    const logout = () => {
        if (!auth) return Promise.reject(new Error('Firebase not initialized.'));
        // FIX: Use v8 signOut method
        return auth.signOut();
    };
    
    const loginWithGoogle = () => {
        if (!auth) return Promise.reject(new Error('Firebase not initialized.'));
        // FIX: Use v8 GoogleAuthProvider and signInWithPopup method
        const provider = new firebase.auth.GoogleAuthProvider();
        return auth.signInWithPopup(provider);
    };

    const value = {
        authUser,
        loading,
        signup,
        login,
        logout,
        loginWithGoogle,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};