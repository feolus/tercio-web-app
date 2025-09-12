import { createContext } from 'react';
import { User } from '../types';

export interface UserContextType {
    currentUser: User | null;
    error: string | null;
    updateUser: (user: User) => Promise<void>;
    removeUser: (uid: string) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
    currentUser: null,
    error: null,
    updateUser: async () => {},
    removeUser: async () => {},
});