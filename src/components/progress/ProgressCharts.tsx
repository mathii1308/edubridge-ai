"use client";

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Award, AlertTriangle, Plus, Edit2, Trash2, X, Check, FileText } from 'lucide-react';
import Link from 'next/link';

interface NoteItem {
  id: number;
  title: string;
  subject: string;
  content: string;
  date: string;
}

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
    { topic: 'Probability & Bayes Theorem', score: 42, subject: 'Mathematics' },
    { topic: 'DBMS 2NF/3NF Normalization', score: 55, subject: 'DBMS' },
  ],
}) => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('Mathematics');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('student_learning_gap_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {
        setNotes([]);
      }
    } else {
      setNotes([
        {
          id: 1,
          title: "Probability Formula Review",
          subject: "Mathematics",
          content: "Need to review conditional probability P(A|B) formula before next practice quiz.",
          date: "Aug 23, 2026"
        }
      ]);
    }
  }, []);

  const saveNotesToStorage = (updated: NoteItem[]) => {
    setNotes(updated);
    localStorage.setItem('student_learning_gap_notes', JSON.stringify(updated));
  };

  const handleOpenAdd = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteSubject('Mathematics');
    setNoteContent('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: NoteItem) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteSubject(note.subject);
    setNoteContent(note.content);
    setIsModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    if (editingNote) {
      const updated = notes.map(n => n.id === editingNote.id ? {
        ...n,
        title: noteTitle,
        subject: noteSubject,
        content: noteContent
      } : n);
      saveNotesToStorage(updated);
    } else {
      const newNote: NoteItem = {
        id: Date.now(),
        title: noteTitle,
        subject: noteSubject,
        content: noteContent,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      saveNotesToStorage([newNote, ...notes]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteNote = (id: number) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotesToStorage(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Over Time (Line Chart) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Learning Progress Over Time
            </h3>
            <span className="text-[10px] text-slate-500 font-bold">4 Week Score Trend</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                />
                <Line type="monotone" dataKey="Mathematics" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Physics" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Chemistry" stroke="#d97706" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Mastery Performance (Bar Chart) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Subject Performance Mastery
            </h3>
            <span className="text-[10px] text-slate-500 font-bold">Average Accuracy %</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weak Topics & Learning Gap Notes Widget */}
      <div className="glass-card rounded-3xl p-6 border border-amber-200 bg-amber-50/40 space-y-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Identified Learning Gaps & Student Notes</h3>
              <p className="text-xs text-slate-500">Track weak concepts and add custom learning revision notes.</p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Learning Gap Note
          </button>
        </div>

        {/* Identified Weak Topics List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakTopics.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-amber-200 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{item.subject}</span>
                <h4 className="text-sm font-bold text-slate-900">{item.topic}</h4>
                <p className="text-xs font-bold text-rose-600 mt-0.5">Accuracy: {item.score}%</p>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Link
                  href="/student/ai-tutor"
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold text-center transition-all"
                >
                  Ask AI Tutor
                </Link>
                <Link
                  href={`/student/tutors?subject=${encodeURIComponent(item.subject)}&topic=${encodeURIComponent(item.topic)}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-all border border-slate-200"
                >
                  Find Tutor
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Saved Learning Gap Notes Section */}
        <div className="pt-3 border-t border-amber-200 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600" />
            My Learning Revision Notes ({notes.length})
          </h4>

          {notes.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">No custom notes added yet. Click "+ Add Learning Gap Note" to add one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notes.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {n.subject}
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 mt-1">{n.title}</h5>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(n)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        title="Edit Note"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{n.content}</p>
                  <span className="text-[10px] text-slate-400 block text-right">{n.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingNote ? 'Edit Learning Gap Note' : 'Add Learning Gap Note'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Note Title:</label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Wave Optics Huygens Formula"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject / Concept:</label>
                <input
                  type="text"
                  value={noteSubject}
                  onChange={(e) => setNoteSubject(e.target.value)}
                  placeholder="e.g. Physics / Wave Optics"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Note Description:</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={3}
                  placeholder="Write your note or revision instructions..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  {editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

