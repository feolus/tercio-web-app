import { createContext } from 'react';
import { User } from '../types';

export interface UserContextType {
    currentUser: User | null;
    users: User[];
    error: string | null;
    userFetchError: string | null;
    updateUser: (user: User) => Promise<void>;
    removeUser: (uid: string) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
    currentUser: null,
    users: [],
    error: null,
    userFetchError: null,
    updateUser: async () => {},
    removeUser: async () => {},
});