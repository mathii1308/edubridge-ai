"use client";

import React, { useState, useEffect } from 'react';
import { Booking, BookingMessage } from '@/types';
import { useAuth } from '@/lib/auth';
import { Send, X, MessageSquare, Sparkles, RefreshCw } from 'lucide-react';

interface BookingChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

export const BookingChatModal: React.FC<BookingChatModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<BookingMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:8000/bookings/${booking.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      if (messages.length === 0) {
        setMessages([
          {
            id: 1,
            booking_id: booking.id,
            sender_id: booking.student_id,
            sender_name: booking.student_name || "Student",
            sender_role: "student",
            message: `Hi! I requested this session for ${booking.subject_name} (${booking.topic_name}). ${booking.student_requirement ? 'Details: ' + booking.student_requirement : ''}`,
            created_at: booking.created_at || new Date().toISOString(),
            read: true
          },
          {
            id: 2,
            booking_id: booking.id,
            sender_id: booking.teacher_id,
            sender_name: booking.teacher_name || "Tutor",
            sender_role: "teacher",
            message: `Hello! I have reviewed your requirement for ${booking.topic_name}. Looking forward to our session on ${booking.scheduled_date} at ${booking.start_time}!`,
            created_at: new Date().toISOString(),
            read: true
          }
        ]);
      }
    }
  };

  useEffect(() => {
    if (isOpen && booking) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen, booking?.id]);

  if (!isOpen || !booking) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSending) return;

    const currentSenderId = user?.id || (role === 'teacher' ? booking.teacher_id : booking.student_id);
    const currentSenderName = user?.name || (role === 'teacher' ? booking.teacher_name : booking.student_name);

    const tempMsg: BookingMessage = {
      id: Date.now(),
      booking_id: booking.id,
      sender_id: currentSenderId,
      sender_name: currentSenderName,
      sender_role: role === 'teacher' ? 'teacher' : 'student',
      message: input,
      created_at: new Date().toISOString(),
      read: false
    };

    setMessages((prev) => [...prev, tempMsg]);
    const textToSend = input;
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch(`http://localhost:8000/bookings/${booking.id}/messages?sender_id=${currentSenderId}&sender_role=${role === 'teacher' ? 'teacher' : 'student'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      if (res.ok) {
        const savedMsg = await res.json();
        setMessages((prev) => prev.map(m => m.id === tempMsg.id ? savedMsg : m));
      }
    } catch {
      // Keep optimistic message state
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full h-[600px] rounded-xl border border-slate-200 flex flex-col relative shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Session Chat: {booking.subject_name} — {booking.topic_name}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  Booking #{booking.id}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {role === 'teacher' ? `Student: ${booking.student_name}` : `Tutor: ${booking.teacher_name}`} • {booking.scheduled_date} ({booking.start_time})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Learning Context Header Box */}
        {booking.student_requirement && (
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs flex items-center justify-between text-slate-700">
            <div className="flex items-center space-x-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate"><strong>Session Details:</strong> {booking.student_requirement}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 ml-2 font-bold uppercase">
              {booking.status}
            </span>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
          {messages.map((m) => {
            const isMe = (role === 'teacher' && m.sender_role === 'teacher') || (role === 'student' && m.sender_role === 'student');
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-2.5 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isMe ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {m.sender_name ? m.sender_name.charAt(0) : 'U'}
                </div>

                <div className={`max-w-md space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-medium px-1">
                    <span className="font-bold text-slate-800">{m.sender_name}</span>
                    <span>•</span>
                    <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-2xs font-medium'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none font-medium'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${role === 'teacher' ? booking.student_name : booking.teacher_name}...`}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all shadow-2xs"
          >
            {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

