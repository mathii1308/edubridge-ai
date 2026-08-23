"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { Booking } from '@/types';
import {
  TrendingUp,
  AlertTriangle,
  Bot,
  UserCheck,
  Award,
  CalendarDays,
  BrainCircuit,
  ArrowRight,
  Plus,
  BookOpen,
  CheckCircle2,
  X
} from 'lucide-react';

const AVAILABLE_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science & Programming",
  "DBMS & SQL",
  "Electrical & Electronics",
  "Mechanical Engineering"
];

function StudentDashboardContent() {
  const { user } = useAuth();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  useEffect(() => {
    // Load enrolled subjects from localStorage
    const saved = localStorage.getItem(`enrolled_subjects_${user?.id || 1}`);
    if (saved) {
      try {
        setSelectedSubjects(JSON.parse(saved));
      } catch {
        setSelectedSubjects([]);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      const fetchBookings = async () => {
        try {
          const res = await fetch(`http://localhost:8000/bookings?user_role=student&user_id=${user.id}`);
          if (res.ok) {
            const data: Booking[] = await res.json();
            const active = data.find(b => b.status === 'accepted' || b.status === 'requested');
            setUpcomingBooking(active || null);
          }
        } catch {
          setUpcomingBooking(null);
        }
      };
      fetchBookings();
    }
  }, [user?.id]);

  const toggleSubject = (sub: string) => {
    let updated: string[];
    if (selectedSubjects.includes(sub)) {
      updated = selectedSubjects.filter(s => s !== sub);
    } else {
      updated = [...selectedSubjects, sub];
    }
    setSelectedSubjects(updated);
    localStorage.setItem(`enrolled_subjects_${user?.id || 1}`, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl">
          {/* Welcome Banner */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Student Learning Portal
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
                Welcome back, {user?.name || 'Student'} 👋
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Account Email: <strong>{user?.email}</strong>. Select your enrolled subjects below to personalize your learning analytics.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setShowSubjectModal(true)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 border border-slate-300 transition-all"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>{selectedSubjects.length === 0 ? 'Select Enrolled Subjects' : 'Manage My Subjects'}</span>
              </button>
              <Link
                href="/student/ai-tutor"
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>Launch AI Tutor</span>
              </Link>
            </div>
          </div>

          {/* Initial State Banner if No Subjects Selected */}
          {selectedSubjects.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 border border-slate-200 bg-white text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">Personalize Your Academic Dashboard</h3>
                <p className="text-xs text-slate-500">
                  Select the academic subjects you are currently studying. Your mastery performance, weak topic alerts, and practice quizzes will adapt to your real selection.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto pt-2">
                {AVAILABLE_SUBJECTS.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => toggleSubject(sub)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Subjects Dashboard */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Subject Mastery Performance */}
              <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    Enrolled Subject Performance
                  </h3>
                  <button
                    onClick={() => setShowSubjectModal(true)}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Edit Enrolled Subjects ({selectedSubjects.length})
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedSubjects.map((subject, idx) => (
                    <div key={subject}>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-800">{subject}</span>
                        <span className="text-indigo-600 font-bold">Active Learning</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${Math.min(100, 45 + (idx * 20))}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Session Card */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Upcoming Session</span>
                    {upcomingBooking && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase border border-emerald-200">
                        {upcomingBooking.status}
                      </span>
                    )}
                  </div>

                  {upcomingBooking ? (
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700">
                          {upcomingBooking.teacher_name ? upcomingBooking.teacher_name.charAt(0) : 'T'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{upcomingBooking.teacher_name || 'Assigned Tutor'}</h4>
                          <p className="text-xs text-indigo-600 font-bold">{upcomingBooking.subject_name} • {upcomingBooking.topic_name}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <p className="text-slate-700">📅 Date: {upcomingBooking.scheduled_date}</p>
                        <p className="text-indigo-700 font-bold">⏰ Time: {upcomingBooking.start_time} - {upcomingBooking.end_time}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 space-y-2">
                      <CalendarDays className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-medium text-slate-500">No upcoming tutor sessions booked yet.</p>
                    </div>
                  )}
                </div>

                <Link
                  href="/student/sessions"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center block transition-all border border-slate-200"
                >
                  {upcomingBooking ? 'View All Sessions' : 'Book a Session'}
                </Link>
              </div>
            </div>
          )}

          {/* Quick Action Hub */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">AI Academic Tutor</h4>
              <p className="text-xs text-slate-500">Ask any doubt naturally across all subjects with step-by-step guidance.</p>
              <Link href="/student/ai-tutor" className="text-xs text-indigo-600 font-bold hover:underline inline-block pt-1">
                Open AI Tutor →
              </Link>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Practice & Quizzes</h4>
              <p className="text-xs text-slate-500">Search topics and generate concept-specific quizzes dynamically.</p>
              <Link href="/student/practice" className="text-xs text-emerald-600 font-bold hover:underline inline-block pt-1">
                Start Practice →
              </Link>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Verified Scholarships</h4>
              <p className="text-xs text-slate-500">Check official state and central government scholarship portals.</p>
              <Link href="/student/scholarships" className="text-xs text-amber-600 font-bold hover:underline inline-block pt-1">
                View Scholarships →
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Modal to Select Enrolled Subjects */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Select Your Enrolled Subjects</h3>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select the academic subjects you are currently studying. Your dashboard analytics and quiz options will adapt accordingly.
            </p>

            <div className="space-y-2">
              {AVAILABLE_SUBJECTS.map((sub) => {
                const isSelected = selectedSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    onClick={() => toggleSubject(sub)}
                    className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{sub}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowSubjectModal(false)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Save Subject Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}

