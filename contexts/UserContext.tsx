import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role } from '../types';

export interface User {
    id: string;
    name: string;
    role: Role | string;
    email: string;
    avatar: string;
    status: 'Active' | 'Inactive';
    username?: string;
    password?: string;
}

interface UserContextType {
    user: User;
    users: User[]; // Add users list to context
    login: (username: string, password: string) => boolean;
    logout: () => void;
    updateUser: (newData: Partial<User>) => void;
    updateUserById: (id: string, newData: Partial<User>) => void;
}

const USERS = [
    {
        id: '1000001',
        username: 'Admin',
        password: 'Admin',
        name: 'Administrator',
        role: Role.ADMINISTRATOR,
        email: 'admin@ekohajj.kemenhaj.go.id',
        avatar: 'https://ui-avatars.com/api/?name=Administrator&background=064E3B&color=fff',
        status: 'Active' as const
    },
    {
        id: '2000001',
        username: 'Eksekutif',
        password: 'Eksekutif',
        name: 'Ahmad Ulin Nuha',
        role: Role.EXECUTIVE,
        email: 'eksekutif@ekohajj.kemenhaj.go.id',
        avatar: 'https://ui-avatars.com/api/?name=Ahmad+Ulin+Nuha&background=D4AF37&color=fff',
        status: 'Active' as const
    },
    {
        id: '4781994',
        username: 'Zain',
        password: '123',
        name: 'Zainul Syaifudin',
        role: Role.SURVEYOR,
        email: 'zainul@ekohajj.kemenhaj.go.id',
        avatar: 'https://ui-avatars.com/api/?name=Zainul+Syaifudin&background=10B981&color=fff',
        status: 'Active' as const
    }
];

const defaultUser: User = {
    id: '0000000',
    name: 'Guest',
    role: 'Guest',
    email: '',
    avatar: '',
    status: 'Inactive'
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(defaultUser);
    // In a real app, this would be a state fetched from an API
    const [usersList, setUsersList] = useState<User[]>(USERS.map(u => ({
        id: u.id,
        name: u.name,
        role: u.role,
        email: u.email,
        avatar: u.avatar,
        status: u.status,
        username: u.username,
        password: u.password
    })));

    const login = (username: string, password: string): boolean => {
        const foundUser = USERS.find(u => {
            // Check if input matches username (case-insensitive) OR id
            const isUsernameMatch = u.username.toLowerCase() === username.toLowerCase();
            const isIdMatch = u.id === username;
            
            if (!isUsernameMatch && !isIdMatch) return false;

            // Special password handling based on role/user
            if (u.role === Role.ADMINISTRATOR || u.role === Role.EXECUTIVE) {
                // Case-insensitive password for Admin and Executive
                return u.password.toLowerCase() === password.toLowerCase();
            }
            
            // Strict password check for others (Surveyor)
            return u.password === password;
        });

        if (foundUser) {
            setUser({
                id: foundUser.id,
                name: foundUser.name,
                role: foundUser.role,
                email: foundUser.email,
                avatar: foundUser.avatar,
                status: foundUser.status,
                username: foundUser.username,
                password: foundUser.password
            });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(defaultUser);
    };

    const updateUser = (newData: Partial<User>) => {
        updateUserById(user.id, newData);
    };

    const updateUserById = (id: string, newData: Partial<User>) => {
        setUsersList(prevList => prevList.map(u => {
            if (u.id === id) {
                const updated = { ...u, ...newData };
                // If we are updating the currently logged-in user, update that state too
                if (user.id === id) {
                    setUser(updated);
                }
                return updated;
            }
            return u;
        }));
    };

    return (
        <UserContext.Provider value={{ user, users: usersList, login, logout, updateUser, updateUserById }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
