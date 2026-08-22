"use client";

import React, { useState } from 'react';
import { Tutor } from '@/types';
import { BookingModal } from './BookingModal';
import { Star, ShieldCheck, Languages, Calendar, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface TutorCardProps {
  tutor: Tutor;
  searchSubject?: string;
  searchTopic?: string;
  studentRequirement?: string;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, searchSubject, searchTopic, studentRequirement }) => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner & Match Percentage */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-indigo-500/20">
            {tutor.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-1.5">
              {tutor.name}
              {tutor.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {tutor.rating}
              </span>
              <span>•</span>
              <span>{tutor.experience} Yrs Exp</span>
              <span>•</span>
              <span className="text-indigo-300">{tutor.teaching_mode}</span>
            </div>
          </div>
        </div>

        {/* Match Percentage Pill */}
        {tutor.match_score && (
          <div className="flex flex-col items-end">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {tutor.match_score}% Match
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-300 mb-4 leading-relaxed line-clamp-2">
        {tutor.bio}
      </p>

      {/* Match Reasons Breakdown */}
      {tutor.match_reasons && tutor.match_reasons.length > 0 && (
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 mb-4 space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Why Matched for You:</p>
          <div className="flex flex-wrap gap-1.5">
            {tutor.match_reasons.map((reason, i) => (
              <span key={i} className="text-[11px] text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                ✓ {reason}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages & Subjects */}
      <div className="space-y-2 text-xs mb-5">
        <div className="flex items-center space-x-2 text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate">Subjects: {tutor.subjects.join(', ')}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <Languages className="w-3.5 h-3.5 text-purple-400" />
          <span>Languages: {tutor.languages.join(', ')}</span>
        </div>
      </div>

      {/* Real-time Status & Booking Trigger */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Slots Open Today</span>
        </div>

        <button
          onClick={() => setShowBooking(true)}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-500/20 transition-all"
        >
          <span>Book Session</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        tutor={tutor}
        subject={searchSubject || tutor.subjects[0] || 'Mathematics'}
        topic={searchTopic || tutor.topics[0] || 'Probability'}
        studentRequirement={studentRequirement}
      />
    </div>
  );
};

