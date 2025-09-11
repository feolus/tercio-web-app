import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

type FirebaseUser = User;

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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signup = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };
    
    const loginWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
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