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
  BookOpen,
  Plus,
  CheckCircle2
} from 'lucide-react';

const AVAILABLE_SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Computer Science / DBMS", "Engineering Mechanics", "Biology"];

function StudentDashboardContent() {
  const { user } = useAuth();
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>([]);
  const [selectedSubjectInput, setSelectedSubjectInput] = useState<string>('');

  useEffect(() => {
    // Load enrolled subjects from local storage or profile
    const saved = localStorage.getItem(`enrolled_subjects_${user?.id || 'default'}`);
    if (saved) {
      try {
        setEnrolledSubjects(JSON.parse(saved));
      } catch (e) {
        setEnrolledSubjects([]);
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

  const handleAddSubject = (subject: string) => {
    if (!subject || enrolledSubjects.includes(subject)) return;
    const updated = [...enrolledSubjects, subject];
    setEnrolledSubjects(updated);
    localStorage.setItem(`enrolled_subjects_${user?.id || 'default'}`, JSON.stringify(updated));
    setSelectedSubjectInput('');
  };

  const handleRemoveSubject = (subject: string) => {
    const updated = enrolledSubjects.filter(s => s !== subject);
    setEnrolledSubjects(updated);
    localStorage.setItem(`enrolled_subjects_${user?.id || 'default'}`, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl">
          {/* Welcome Academic Banner */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Academic Dashboard
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-2">
                Welcome back, {user?.name || 'Student'} 👋
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Logged in as <strong>{user?.email}</strong>. Select your subjects below to start natural learning, quizzes, and tutoring sessions.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/student/ai-tutor"
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>AI Academic Tutor</span>
              </Link>
            </div>
          </div>

          {/* Subject Enrollment / Initial State Handler */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Your Active Enrolled Subjects
                </h3>
                <p className="text-xs text-slate-500">Personalize your academic workspace by selecting your subjects.</p>
              </div>

              {/* Add Subject Select */}
              <div className="flex items-center space-x-2">
                <select
                  value={selectedSubjectInput}
                  onChange={(e) => handleAddSubject(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="">+ Add Enrolled Subject...</option>
                  {AVAILABLE_SUBJECTS.filter(s => !enrolledSubjects.includes(s)).map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            </div>

            {enrolledSubjects.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
                <h4 className="text-sm font-bold text-slate-800">No Subjects Added Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your academic dashboard is clean. Select subjects from the dropdown above to enable personalized practice quizzes, AI tutor grounding, and performance tracking.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {AVAILABLE_SUBJECTS.slice(0, 4).map(subj => (
                    <button
                      key={subj}
                      onClick={() => handleAddSubject(subj)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-blue-600 font-semibold hover:bg-blue-50 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{subj}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {enrolledSubjects.map(subj => (
                  <div key={subj} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-900">{subj}</h4>
                      <button
                        onClick={() => handleRemoveSubject(subj)}
                        className="text-[11px] text-slate-400 hover:text-red-600 font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
                      <Link
                        href={`/student/practice?subject=${encodeURIComponent(subj)}`}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition-all"
                      >
                        Generate Quiz
                      </Link>
                      <Link
                        href={`/student/ai-tutor?subject=${encodeURIComponent(subj)}`}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 text-[11px] font-medium hover:bg-slate-100 transition-all"
                      >
                        Ask AI Tutor
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grid Layout: Progress & Upcoming Session */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Mastery Performance */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Your Academic Progress Overview
                </h3>
                <Link href="/student/progress" className="text-xs text-blue-600 font-semibold hover:underline">
                  View Full Analytics →
                </Link>
              </div>

              {enrolledSubjects.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-xs">
                  <p>No subjects enrolled yet. Add subjects above to track your real practice quiz performance and learning progress.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledSubjects.map((subj) => {
                    // Calculate real quiz accuracy from saved activity
                    const historySaved = localStorage.getItem(`quiz_history_${user?.id || 'default'}`);
                    let realScore: number | null = null;
                    if (historySaved) {
                      try {
                        const historyArr = JSON.parse(historySaved);
                        const subjQuizzes = historyArr.filter((q: any) => q.subject === subj);
                        if (subjQuizzes.length > 0) {
                          const totalPct = subjQuizzes.reduce((acc: number, curr: any) => acc + curr.scorePct, 0);
                          realScore = Math.round(totalPct / subjQuizzes.length);
                        }
                      } catch (e) {}
                    }

                    return (
                      <div key={subj}>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-slate-800">{subj}</span>
                          <span className="text-blue-700">
                            {realScore !== null ? `${realScore}% Mastery` : 'No quiz activity yet'}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${realScore !== null ? realScore : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upcoming Session Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Scheduled Tutoring Session</span>
                  {upcomingBooking && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold uppercase">
                      {upcomingBooking.status}
                    </span>
                  )}
                </div>

                {upcomingBooking ? (
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700">
                        {upcomingBooking.teacher_name ? upcomingBooking.teacher_name.charAt(0) : 'T'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{upcomingBooking.teacher_name || 'Assigned Tutor'}</h4>
                        <p className="text-xs text-slate-500">{upcomingBooking.subject_name} • {upcomingBooking.topic_name}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <p className="text-slate-700">📅 Date: {upcomingBooking.scheduled_date}</p>
                      <p className="text-blue-700 font-semibold">⏰ Time: {upcomingBooking.start_time} - {upcomingBooking.end_time}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-500 space-y-2">
                    <CalendarDays className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs">No upcoming sessions booked yet.</p>
                  </div>
                )}
              </div>

              <Link
                href="/student/sessions"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center block transition-all border border-slate-200"
              >
                {upcomingBooking ? 'View All Sessions' : 'Find & Book Human Tutor'}
              </Link>
            </div>
          </div>

          {/* Scholarship Recommendation Teaser */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Verified Official Scholarships</h3>
              </div>
              <Link href="/student/scholarships" className="text-xs text-blue-600 font-semibold hover:underline">
                View Official Portals →
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-700 font-bold uppercase">Official Govt Scholarship</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">PM YASASVI Central Sector Post-Matric Scholarship 2026</h4>
                <p className="text-xs text-slate-500 mt-1">Ministry of Social Justice & Empowerment • Benefit: Full tuition & ₹75,000 allowance</p>
              </div>

              <Link
                href="/student/scholarships"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shrink-0"
              >
                View Official Portal
              </Link>
            </div>
          </div>
        </main>
      </div>
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

