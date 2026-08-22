"use client";

import React from 'react';
import { useAuth } from '@/lib/auth';
import { Role } from '@/types';
import { UserCheck, Shield, GraduationCap } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole } = useAuth();

  const roles: { id: Role; label: string; icon: any; color: string }[] = [
    { id: 'student', label: 'Student View', icon: GraduationCap, color: 'from-indigo-500 to-purple-600' },
    { id: 'teacher', label: 'Tutor View', icon: UserCheck, color: 'from-emerald-500 to-teal-600' },
    { id: 'admin', label: 'Admin View', icon: Shield, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 py-2 px-4 sticky top-0 z-50 flex items-center justify-between text-xs">
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          PROTOTYPE EVALUATION MODE
        </span>
        <span className="text-slate-400 hidden sm:inline">Switch role context instantly:</span>
      </div>

      <div className="flex items-center space-x-1.5">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = role === r.id;
          return (
            <button
              key={r.id}
              onClick={() => switchRole(r.id)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                isActive
                  ? `bg-gradient-to-r ${r.color} text-white shadow-lg shadow-indigo-500/20 scale-105`
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
