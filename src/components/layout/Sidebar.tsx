"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Bot,
  BrainCircuit,
  TrendingUp,
  UserCheck,
  CalendarDays,
  Award,
  User,
  BookOpen,
  Users,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, user } = useAuth();

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/ai-tutor', label: 'AI Tutor', icon: Bot, badge: 'RAG Grounded' },
    { href: '/student/practice', label: 'Practice & Quizzes', icon: BrainCircuit },
    { href: '/student/progress', label: 'Progress & Gaps', icon: TrendingUp },
    { href: '/student/tutors', label: 'Find Human Tutor', icon: UserCheck },
    { href: '/student/sessions', label: 'My Sessions', icon: CalendarDays },
    { href: '/student/scholarships', label: 'Scholarships', icon: Award, badge: 'Verified' },
    { href: '/student/profile', label: 'Profile Settings', icon: User },
  ];

  const teacherLinks = [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/teacher/availability', label: 'Availability Grid', icon: Clock },
    { href: '/teacher/bookings', label: 'Booking Requests', icon: CalendarDays },
    { href: '/teacher/students', label: 'Student Learning Gaps', icon: Users },
    { href: '/teacher/profile', label: 'Tutor Profile', icon: User },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Overview Analytics', icon: LayoutDashboard },
    { href: '/admin/resources', label: 'Educational Resources', icon: BookOpen },
    { href: '/admin/scholarships', label: 'Scholarship Verifier', icon: Award },
    { href: '/admin/users', label: 'Manage Users', icon: Users },
  ];

  const currentLinks = role === 'teacher' ? teacherLinks : role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-800 min-h-[calc(100vh-45px)] p-4 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center space-x-3 px-2 py-4 mb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">EduBridge AI</h1>
            <p className="text-[11px] text-indigo-400 font-medium capitalize">{role} Platform</p>
          </div>
        </div>

        <nav className="space-y-1">
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 glass-card rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
