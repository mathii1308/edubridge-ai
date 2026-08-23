"use client";

import React, { useState } from 'react';
import { Scholarship } from '@/types';
import { Award, ExternalLink, Calendar, CheckCircle2, Bookmark, BookmarkCheck, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const [saved, setSaved] = useState(scholarship.saved || false);

  const toggleSave = async () => {
    setSaved(!saved);
    try {
      await fetch(`http://localhost:8000/scholarships/${scholarship.id}/save`, {
        method: 'POST'
      });
    } catch {
      // Local state fallback
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white flex flex-col justify-between relative overflow-hidden shadow-sm">
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                {scholarship.provider}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">{scholarship.name}</h3>
            </div>
          </div>

          <button
            onClick={toggleSave}
            className={`p-2 rounded-xl border transition-all ${
              saved
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2 font-medium">
          {scholarship.description}
        </p>

        {/* Natural Language Eligibility Reasons Breakdown */}
        {scholarship.eligibility_reasons && scholarship.eligibility_reasons.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 pb-1 border-b border-slate-200">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Rule Engine Eligibility Evaluation:
              </span>
              {scholarship.match_percentage && (
                <span className="text-indigo-700 font-extrabold">{scholarship.match_percentage}% Match</span>
              )}
            </div>
            {scholarship.eligibility_reasons.map((reason, idx) => (
              <p
                key={idx}
                className={`text-[11px] font-bold leading-tight ${
                  reason.startsWith('✓')
                    ? 'text-emerald-700'
                    : reason.startsWith('✗')
                    ? 'text-rose-600'
                    : 'text-amber-700'
                }`}
              >
                {reason}
              </p>
            ))}
          </div>
        )}

        {/* Scholarship Key Info */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-slate-500 text-[10px] block font-bold">Annual Benefit:</span>
            <span className="font-extrabold text-emerald-700 text-xs">{scholarship.benefits}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block font-bold">Application Deadline:</span>
            <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-600" /> {formatDate(scholarship.application_deadline)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer & Source Link */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Last Verified: {scholarship.last_verified_at ? formatDate(scholarship.last_verified_at) : 'Today'}</span>
        </div>

        <a
          href={scholarship.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
