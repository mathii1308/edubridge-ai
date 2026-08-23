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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Student Booking Requests</h1>
              <p className="text-xs text-slate-500 mt-1">Review incoming session requests, view AI-identified student learning gaps, and communicate with assigned students.</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold">
              Total Requests: {bookings.length}
            </div>
          </div>

          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="glass-card rounded-3xl p-8 border border-slate-200 bg-white text-center text-slate-500 text-xs font-medium shadow-sm">
                No active booking requests assigned to your tutor account.
              </div>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="glass-card rounded-3xl p-6 border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-extrabold text-white">
                        {b.student_name ? b.student_name.charAt(0) : 'S'}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          {b.student_name || 'Student'}
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                            Booking #{b.id}
                          </span>
                        </h3>
                        <p className="text-xs text-indigo-700 font-bold">{b.subject_name} — {b.topic_name}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">📅 Date: {b.scheduled_date} • ⏰ Time: {b.start_time} - {b.end_time}</p>

                    {/* Student Learning Context Card */}
                    {b.student_requirement && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                        <p className="text-[10px] uppercase font-extrabold text-amber-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Student Learning Context (AI Handoff Payload):
                        </p>
                        <p className="text-slate-800 leading-relaxed font-bold">
                          "{b.student_requirement}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => { setSelectedBooking(b); setIsChatOpen(true); }}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open Chat</span>
                    </button>

                    {b.status === 'requested' ? (
                      <>
                        <button
                          onClick={() => handleAction(b.id, 'accepted')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-4 h-4" /> Accept Session
                        </button>
                        <button
                          onClick={() => handleAction(b.id, 'rejected')}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-700 font-bold text-xs border border-slate-200"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
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
