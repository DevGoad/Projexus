'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { fetchCurrentUser, loginUser, registerUser } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: string; organization?: string }) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  isRecruiter: boolean;
  isStudent: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('projexus_token');
    const savedUser = localStorage.getItem('projexus_user');
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore
        }
      }
      fetchCurrentUser()
        .then((u) => {
          setUser(u);
          localStorage.setItem('projexus_user', JSON.stringify(u));
        })
        .catch(() => {
          // invalid token
          localStorage.removeItem('projexus_token');
          localStorage.removeItem('projexus_user');
          setUser(null);
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await loginUser(email, pass);
    localStorage.setItem('projexus_token', res.access_token);
    localStorage.setItem('projexus_user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    organization?: string;
  }) => {
    const res = await registerUser(data);
    localStorage.setItem('projexus_token', res.access_token);
    localStorage.setItem('projexus_user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('projexus_token');
    localStorage.removeItem('projexus_user');
    setToken(null);
    setUser(null);
  };

  const isRecruiter = user?.role === 'recruiter';
  const isStudent = user?.role === 'student' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isLoggedIn: !!user,
        isRecruiter,
        isStudent,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
