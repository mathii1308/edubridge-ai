"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (email: string, role?: Role) => void;
  logout: () => void;
  switchRole: (newRole: Role) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'student',
  login: () => {},
  logout: () => {},
  switchRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('student');
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: "Ananya Sharma",
    email: "student@edubridge.ai",
    role: "student",
    created_at: new Date().toISOString()
  });

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'student') {
      setUser({
        id: 1,
        name: "Ananya Sharma",
        email: "student@edubridge.ai",
        role: "student",
        created_at: new Date().toISOString()
      });
    } else if (newRole === 'teacher') {
      setUser({
        id: 2,
        name: "Dr. Rajesh Kumar",
        email: "tutor.rajesh@edubridge.ai",
        role: "teacher",
        created_at: new Date().toISOString()
      });
    } else {
      setUser({
        id: 5,
        name: "EduBridge Admin",
        email: "admin@edubridge.ai",
        role: "admin",
        created_at: new Date().toISOString()
      });
    }
  };

  const login = (email: string, overrideRole?: Role) => {
    const r = overrideRole || (email.includes('tutor') || email.includes('teacher') ? 'teacher' : email.includes('admin') ? 'admin' : 'student');
    switchRole(r);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
