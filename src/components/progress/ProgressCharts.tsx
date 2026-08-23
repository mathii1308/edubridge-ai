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
import { TrendingUp, Award, AlertTriangle, Plus, Edit2, Trash2, Check, FileText } from 'lucide-react';
import Link from 'next/link';

interface NoteItem {
  id: number;
  topic_name: string;
  subject_name: string;
  note_text: string;
  updated_at: string;
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
    { topic: 'Database Normalization (2NF & 3NF)', score: 42, subject: 'Computer Science / DBMS' },
    { topic: 'Probability & Bayes Theorem', score: 55, subject: 'Mathematics' },
  ],
}) => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  
  const [targetTopic, setTargetTopic] = useState('Database Normalization (2NF & 3NF)');
  const [targetSubject, setTargetSubject] = useState('Computer Science / DBMS');
  const [noteContent, setNoteContent] = useState('');

  // Fetch notes from API or LocalStorage
  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:8000/progress/notes?student_id=1');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch {
      // Local storage fallback
      const saved = localStorage.getItem('learning_gap_notes');
      if (saved) {
        try { setNotes(JSON.parse(saved)); } catch (e) {}
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const saveLocalNotes = (updated: NoteItem[]) => {
    setNotes(updated);
    localStorage.setItem('learning_gap_notes', JSON.stringify(updated));
  };

  const handleOpenAddModal = (topicName: string, subjectName: string) => {
    setTargetTopic(topicName);
    setTargetSubject(subjectName);
    setNoteContent('');
    setEditingNoteId(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setTargetTopic(note.topic_name);
    setTargetSubject(note.subject_name);
    setNoteContent(note.note_text);
    setIsAddModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;

    if (editingNoteId) {
      // Update existing note
      try {
        await fetch(`http://localhost:8000/progress/notes/${editingNoteId}?note_text=${encodeURIComponent(noteContent)}`, {
          method: 'PUT'
        });
      } catch {}

      const updated = notes.map(n => n.id === editingNoteId ? { ...n, note_text: noteContent, updated_at: new Date().toISOString() } : n);
      saveLocalNotes(updated);
    } else {
      // Create new note
      const newNote: NoteItem = {
        id: Date.now(),
        topic_name: targetTopic,
        subject_name: targetSubject,
        note_text: noteContent,
        updated_at: new Date().toISOString()
      };

      try {
        const res = await fetch(`http://localhost:8000/progress/notes?topic_name=${encodeURIComponent(targetTopic)}&subject_name=${encodeURIComponent(targetSubject)}&note_text=${encodeURIComponent(noteContent)}`, {
          method: 'POST'
        });
        if (res.ok) {
          const created = await res.json();
          newNote.id = created.id;
        }
      } catch {}

      saveLocalNotes([newNote, ...notes]);
    }

    setIsAddModalOpen(false);
    setNoteContent('');
    setEditingNoteId(null);
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/progress/notes/${id}`, { method: 'DELETE' });
    } catch {}
    const updated = notes.filter(n => n.id !== id);
    saveLocalNotes(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Over Time (Line Chart) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Learning Progress Over Time
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">Weekly Assessment</span>
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
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#0f172a'
                  }}
                />
                <Line type="monotone" dataKey="Mathematics" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Physics" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Chemistry" stroke="#d97706" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Mastery Performance (Bar Chart) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Subject Accuracy Mastery
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">Average Score %</span>
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
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weak Topics & Working Notes Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Identified Learning Gaps & Action Notes</h3>
          </div>
          <button
            onClick={() => handleOpenAddModal(weakTopics[0]?.topic || 'Database Normalization', weakTopics[0]?.subject || 'DBMS')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Study Note</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakTopics.map((item, idx) => {
            const topicNotes = notes.filter(n => n.topic_name === item.topic || n.subject_name === item.subject);
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">{item.subject}</span>
                    <h4 className="text-sm font-bold text-slate-900">{item.topic}</h4>
                    <p className="text-xs font-semibold text-rose-600 mt-0.5">Accuracy: {item.score}% (Needs Review)</p>
                  </div>

                  <button
                    onClick={() => handleOpenAddModal(item.topic, item.subject)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                    <span>Add Note</span>
                  </button>
                </div>

                {/* Display Notes for this topic */}
                {topicNotes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600" /> Saved Notes:
                    </p>
                    {topicNotes.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{n.note_text}</p>
                          <div className="flex items-center space-x-1 shrink-0 ml-2">
                            <button onClick={() => handleOpenEditModal(n)} className="p-1 hover:text-blue-600 text-slate-400">
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDeleteNote(n.id)} className="p-1 hover:text-red-600 text-slate-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Notes List */}
        {notes.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">All Saved Learning Gap Notes ({notes.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notes.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{n.subject_name}</span>
                      <h5 className="text-xs font-bold text-slate-900">{n.topic_name}</h5>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => handleOpenEditModal(n)} className="p-1 hover:text-blue-600 text-slate-400">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteNote(n.id)} className="p-1 hover:text-red-600 text-slate-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">{n.note_text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 border border-slate-200 max-w-md w-full space-y-4 shadow-lg">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingNoteId ? 'Edit Learning Gap Note' : 'Add Note to Learning Gap'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject & Topic:</label>
                <input
                  type="text"
                  disabled
                  value={`${targetSubject} — ${targetTopic}`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Study Note Content:</label>
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter study note or struggle clarification details..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

