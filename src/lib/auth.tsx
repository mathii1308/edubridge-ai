"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isLoading: boolean;
  login: (userData: User, tokenStr: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  role: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('edubridge_user');
      const storedToken = localStorage.getItem('edubridge_token');

      if (storedUser && storedToken) {
        const parsed: User = JSON.parse(storedUser);
        if (parsed && parsed.id && parsed.email && parsed.role) {
          setUser(parsed);
          setRole(parsed.role as Role);
          setToken(storedToken);
        } else {
          // Clean invalid state
          localStorage.removeItem('edubridge_user');
          localStorage.removeItem('edubridge_token');
        }
      }
    } catch (e) {
      console.warn("Could not load stored user session:", e);
      localStorage.removeItem('edubridge_user');
      localStorage.removeItem('edubridge_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, tokenStr: string) => {
    setUser(userData);
    setToken(tokenStr);
    setRole(userData.role as Role);
    localStorage.setItem('edubridge_user', JSON.stringify(userData));
    localStorage.setItem('edubridge_token', tokenStr);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('edubridge_user');
    localStorage.removeItem('edubridge_token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
