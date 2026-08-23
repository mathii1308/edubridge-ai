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
  Clock,
  Sparkles,
  LogOut,
  FolderKanban,
  BarChart3
} from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();

  const studentLinks: NavLink[] = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/ai-tutor', label: 'AI Academic Tutor', icon: Bot },
    { href: '/student/practice', label: 'Practice & Quizzes', icon: BrainCircuit },
    { href: '/student/progress', label: 'Progress & Learning Gaps', icon: TrendingUp },
    { href: '/student/tutors', label: 'Find Human Tutor', icon: UserCheck },
    { href: '/student/sessions', label: 'My Sessions', icon: CalendarDays },
    { href: '/student/scholarships', label: 'Verified Scholarships', icon: Award },
    { href: '/student/profile', label: 'Profile & Settings', icon: User },
  ];

  const teacherLinks: NavLink[] = [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/teacher/availability', label: 'Availability Grid', icon: Clock },
    { href: '/teacher/bookings', label: 'Booking Requests', icon: CalendarDays },
    { href: '/teacher/students', label: 'Student Learning Gaps', icon: Users },
    { href: '/admin/resources', label: 'Educational Resources', icon: BookOpen },
    { href: '/teacher/profile', label: 'Profile & Settings', icon: User },
  ];

  const adminLinks: NavLink[] = [
    { href: '/admin/dashboard', label: 'Overview Analytics', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/resources', label: 'Content Resources', icon: BookOpen },
    { href: '/admin/scholarships', label: 'Scholarship Verifier', icon: Award },
  ];

  const currentLinks: NavLink[] = role === 'teacher' ? teacherLinks : role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-45px)] p-4 flex flex-col justify-between hidden md:flex shadow-xs">
      <div>
        <div className="flex items-center space-x-3 px-2 py-4 mb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 leading-tight">EduBridge AI</h1>
            <p className="text-[11px] text-indigo-600 font-semibold capitalize">{role} Platform</p>
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-indigo-600 font-semibold capitalize truncate">{user?.role || role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 text-slate-500 hover:text-rose-600 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      </div>
    </aside>
  );
};

