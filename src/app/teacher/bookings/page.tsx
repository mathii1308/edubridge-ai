"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BookingChatModal } from '@/components/chat/BookingChatModal';
import { Booking } from '@/types';
import { useAuth } from '@/lib/auth';
import { Check, X, Calendar, Clock, User, MessageSquare, Sparkles, AlertCircle } from 'lucide-react';

function TeacherBookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchBookings = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(`http://localhost:8000/bookings?user_role=teacher&user_id=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setBookings(data);
          } else {
            setBookings([]);
          }
        } catch {
          setBookings([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookings();
    }
  }, [user?.id]);

  const handleAction = async (id: number, newStatus: 'accepted' | 'rejected') => {
    try {
      await fetch(`http://localhost:8000/bookings/${id}?status=${newStatus}`, {
        method: 'PUT'
      });
    } catch {
      // Local fallback
    } finally {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Student Booking Requests</h1>
              <p className="text-xs text-slate-400 mt-1">Review incoming session requests, view AI-identified student learning gaps, and communicate with assigned students.</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
              Total Requests: {bookings.length}
            </div>
          </div>

          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="glass-card rounded-3xl p-8 border border-slate-800 text-center text-slate-400 text-xs">
                No active booking requests assigned to your tutor account.
              </div>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300">
                        {b.student_name ? b.student_name.charAt(0) : 'S'}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {b.student_name || 'Student'}
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                            Booking #{b.id}
                          </span>
                        </h3>
                        <p className="text-xs text-indigo-300 font-semibold">{b.subject_name} — {b.topic_name}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">📅 Date: {b.scheduled_date} • ⏰ Time: {b.start_time} - {b.end_time}</p>

                    {/* Student Learning Context Card */}
                    {b.student_requirement && (
                      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                        <p className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Student Learning Context (AI Handoff Payload):
                        </p>
                        <p className="text-slate-200 leading-relaxed font-medium">
                          "{b.student_requirement}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => { setSelectedBooking(b); setIsChatOpen(true); }}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open Chat</span>
                    </button>

                    {b.status === 'requested' ? (
                      <>
                        <button
                          onClick={() => handleAction(b.id, 'accepted')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
                        >
                          <Check className="w-4 h-4" /> Accept Session
                        </button>
                        <button
                          onClick={() => handleAction(b.id, 'rejected')}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        {b.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {selectedBooking && (
        <BookingChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
}

export default function TeacherBookingsPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherBookingsContent />
    </ProtectedRoute>
  );
}
