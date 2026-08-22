"use client";

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, Award, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProgressChartsProps {
  historyTrend?: any[];
  subjectScores?: any[];
  weakTopics?: any[];
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  historyTrend = [
    { week: 'Week 1', Mathematics: 60, Physics: 70, Chemistry: 55 },
    { week: 'Week 2', Mathematics: 65, Physics: 75, Chemistry: 60 },
    { week: 'Week 3', Mathematics: 72, Physics: 80, Chemistry: 62 },
    { week: 'Week 4', Mathematics: 78, Physics: 85, Chemistry: 65 },
  ],
  subjectScores = [
    { subject: 'Mathematics', score: 78 },
    { subject: 'Physics', score: 85 },
    { subject: 'Chemistry', score: 65 },
  ],
  weakTopics = [
    { topic: 'Probability', score: 42, subject: 'Mathematics' },
    { topic: 'Trigonometry', score: 55, subject: 'Mathematics' },
  ],
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Over Time (Line Chart) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Learning Progress Over Time
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Last 4 Weeks</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="Mathematics" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Physics" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Chemistry" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Mastery Performance (Bar Chart) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Subject Performance Mastery
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Average Accuracy %</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weak Topics Callout Widget */}
      <div className="glass-card rounded-3xl p-6 border border-amber-500/20 bg-amber-500/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Identified Weak Topics Requiring Attention</h3>
          </div>
          <span className="text-[10px] text-amber-300 font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20">
            Adaptive Trigger Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakTopics.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{item.subject}</span>
                <h4 className="text-sm font-bold text-indigo-300">{item.topic}</h4>
                <p className="text-xs font-semibold text-rose-400 mt-0.5">Accuracy: {item.score}%</p>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Link
                  href="/student/ai-tutor"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-medium text-center transition-all"
                >
                  Ask AI Tutor
                </Link>
                <Link
                  href={`/student/tutors?subject=${encodeURIComponent(item.subject)}&topic=${encodeURIComponent(item.topic)}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium text-center transition-all"
                >
                  Find Tutor
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
