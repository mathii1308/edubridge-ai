"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import {
  Sparkles,
  Bot,
  UserCheck,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Zap,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  const { switchRole } = useAuth();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">EduBridge AI</span>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
          <a href="#ai-tutor" className="hover:text-indigo-400 transition-colors">AI Tutor RAG</a>
          <a href="#human-tutor" className="hover:text-indigo-400 transition-colors">Human Tutors</a>
          <a href="#scholarships" className="hover:text-indigo-400 transition-colors">Verified Scholarships</a>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/student/dashboard"
            onClick={() => switchRole('student')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all"
          >
            Start Learning Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-28 max-w-6xl mx-auto text-center space-y-8 overflow-hidden">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AI First Support • Seamless Human Tutor Handoff • Verified Scholarships</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Learn Smarter. <br />
          <span className="text-gradient">Get the Right Support.</span>
        </h1>

        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          EduBridge AI connects grounded AI learning, human tutors upon struggle detection, progress analytics, and verified scholarship opportunities in one unified platform.
        </p>

        {/* Demo Quick Launch Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/student/dashboard"
            onClick={() => switchRole('student')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold flex items-center space-x-2 shadow-xl shadow-indigo-500/30 transition-all scale-105"
          >
            <span>Explore Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/teacher/dashboard"
            onClick={() => switchRole('teacher')}
            className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-sm font-bold flex items-center space-x-2 transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Explore Tutor View</span>
          </Link>

          <Link
            href="/admin/dashboard"
            onClick={() => switchRole('admin')}
            className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-sm font-bold flex items-center space-x-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Explore Admin Portal</span>
          </Link>
        </div>

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold text-sm text-white">Grounded RAG AI</h4>
            <p className="text-[11px] text-slate-400">Step-by-step explanations with verified open textbook sources.</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-sm text-white">Human Tutor Handoff</h4>
            <p className="text-[11px] text-slate-400">Automatic 1-on-1 tutor pre-fill when persistent struggle is detected.</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <Globe className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-sm text-white">Multilingual Access</h4>
            <p className="text-[11px] text-slate-400">Full English and Tamil (தமிழ்) academic support.</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <Award className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-sm text-white">Verified Scholarships</h4>
            <p className="text-[11px] text-slate-400">Deterministic rule-based eligibility evaluation.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-6 py-16 bg-slate-900/40 border-t border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Integrated Workflow</span>
            <h2 className="text-3xl font-extrabold text-white">Right Explanation. Right Language. Right Tutor.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">1</span>
              <h3 className="text-base font-bold text-white">AI First Assistance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Student asks academic questions in English or Tamil. AI retrieves open educational textbook chunks and provides step-by-step grounded explanations with citations.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <h3 className="text-base font-bold text-white">Seamless Human Handoff</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If the student clicks "I still don't understand", the system identifies the subject, topic, and language, and matches available human tutors in real-time.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <h3 className="text-base font-bold text-white">Verified Scholarships</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The student's verified profile is matched against active government and institutional scholarships using exact rule engine logic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 EduBridge AI — AI-Powered Personalized Education Access Platform. Built with Next.js, FastAPI & PostgreSQL.</p>
      </footer>
    </div>
  );
}
