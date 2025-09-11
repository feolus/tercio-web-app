import { createContext } from 'react';
import { User } from '../types';

export interface UserContextType {
    users: User[];
    currentUser: User | null;
    updateUser: (user: User) => Promise<void>;
    removeUser: (uid: string) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
    users: [],
    currentUser: null,
    updateUser: async () => {},
    removeUser: async () => {},
});