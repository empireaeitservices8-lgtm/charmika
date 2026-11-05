'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserAddress } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateAddress: (address: UserAddress) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('charmika_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load user auth', e);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('charmika_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('charmika_user');
      }
    } catch (e) {
      console.error('Failed to update user auth in storage', e);
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      id: 'usr_' + Date.now(),
      email,
      name: name || email.split('@')[0],
      phone: '+91 98470 12345',
      address: {
        firstName: name || 'Lekshmi',
        lastName: 'DS',
        phone: '+91 94009 76257',
        addressLine1: 'Karthika, Kuttypady',
        addressLine2: 'Gandhinagar PO',
        city: 'Kottayam',
        state: 'Kerala',
        pincode: '686008',
        country: 'India',
      },
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateAddress = (address: UserAddress) => {
    if (user) {
      setUser({ ...user, address });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
