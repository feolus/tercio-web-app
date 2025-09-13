import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    Auth,
    User,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
    authUser: User | null;
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
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signup = (email: string, password: string) => {
        if (!auth) throw new Error("Auth service not available");
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email: string, password: string) => {
        if (!auth) throw new Error("Auth service not available");
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        if (!auth) throw new Error("Auth service not available");
        return signOut(auth);
    };
    
    const loginWithGoogle = () => {
        if (!auth) throw new Error("Auth service not available");
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