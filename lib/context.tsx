'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userId: string, name?: string, email?: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'helloml_user';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const isAuthenticated = !!user;

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (!isHydrated) return;

    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user, isHydrated]);

  const login = (userId: string, name?: string, email?: string) => {
    // Convert simple user IDs to UUID format for database compatibility
    const uuidMap: Record<string, string> = {
      'user-1': '00000000-0000-0000-0000-000000000001',
      'user-2': '00000000-0000-0000-0000-000000000002',
      'user-3': '00000000-0000-0000-0000-000000000003',
    };

    const actualUserId = uuidMap[userId] || userId;

    const newUser: User = {
      id: actualUserId,
      name: name || `User ${userId}`,
      email: email || `${userId}@example.com`,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
