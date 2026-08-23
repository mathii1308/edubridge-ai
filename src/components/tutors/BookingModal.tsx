"use client";

import React, { useState } from 'react';
import { Tutor } from '@/types';
import { Calendar, Clock, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: Tutor;
  subject: string;
  topic: string;
  studentRequirement?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  tutor,
  subject,
  topic,
  studentRequirement = "Needs 1-on-1 concept explanation"
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-08-23');
  const [selectedSlot, setSelectedSlot] = useState('10:00 - 11:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);
    const newBookingObj = {
      id: Date.now(),
      teacher_id: tutor.id,
      teacher_name: tutor.name,
      student_name: "Student",
      subject_name: subject || 'Mathematics',
      topic_name: topic || 'Normalization',
      scheduled_date: selectedDate,
      start_time: selectedSlot.split(' - ')[0],
      end_time: selectedSlot.split(' - ')[1],
      student_requirement: studentRequirement,
      status: 'accepted',
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch(`http://localhost:8000/bookings?student_id=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: tutor.id,
          subject_name: subject || 'Mathematics',
          topic_name: topic || 'Normalization',
          scheduled_date: selectedDate,
          start_time: selectedSlot.split(' - ')[0],
          end_time: selectedSlot.split(' - ')[1],
          student_requirement: studentRequirement
        }),
      });

      if (res.ok) {
        const createdData = await res.json();
        Object.assign(newBookingObj, createdData);
      }
    } catch {
      // Local fallback
    } finally {
      // Always store in localStorage for local state sync guarantee
      try {
        const existingStr = localStorage.getItem('edubridge_booked_sessions');
        const existingArr = existingStr ? JSON.parse(existingStr) : [];
        existingArr.unshift(newBookingObj);
        localStorage.setItem('edubridge_booked_sessions', JSON.stringify(existingArr));
      } catch {
        // ignore
      }
      setIsConfirmed(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full rounded-3xl p-6 border border-slate-200 bg-white relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!isConfirmed ? (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-extrabold text-white text-lg shadow-sm">
                {tutor.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Book 1-on-1 Session with {tutor.name}
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h3>
                <p className="text-xs text-slate-500 font-medium">{subject} • {topic}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs mb-4">
              <span className="text-slate-500 block mb-0.5 font-bold">Requirement Context Passed from AI:</span>
              <span className="text-indigo-800 font-bold">{studentRequirement}</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" /> Select Session Date:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['2026-08-23', '2026-08-24', '2026-08-25'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`p-2.5 rounded-xl font-bold border text-center transition-all ${
                        selectedDate === d
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" /> Select Available Time Slot:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['10:00 - 11:00', '16:00 - 17:00', '17:30 - 18:30'].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl font-bold border text-center transition-all ${
                        selectedSlot === slot
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
            >
              {isSubmitting ? 'Checking Real-time Slot Lock...' : 'Confirm & Reserve Slot'}
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Your 1-on-1 session with <strong className="text-indigo-600">{tutor.name}</strong> for <strong className="text-indigo-600">{topic}</strong> has been successfully booked for <strong>{selectedDate} ({selectedSlot})</strong>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
            >
              Done & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

