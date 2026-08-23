"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Users, AlertTriangle, FileText, Plus, Edit2, Trash2, X } from 'lucide-react';

interface TutorStudentNote {
  id: number;
  studentId: number;
  title: string;
  note: string;
  date: string;
}

function TeacherStudentsContent() {
  const [students] = useState([
    {
      id: 1,
      name: 'Ananya Sharma',
      class: 'Class 12 STEM Science',
      weakTopic: 'Probability (42% accuracy)',
      gapReason: 'Struggling with conditional probability formula application in multi-step word problems.',
      lastSession: 'Aug 23, 2026'
    },
    {
      id: 2,
      name: 'Demo Student',
      class: 'Class 12 Science',
      weakTopic: 'DBMS Normalization (Needs Review)',
      gapReason: 'Struggling with functional dependencies (2NF/3NF).',
      lastSession: 'Aug 23, 2026'
    }
  ]);

  const [tutorNotes, setTutorNotes] = useState<TutorStudentNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStudentId, setActiveStudentId] = useState<number | null>(null);
  const [editingNote, setEditingNote] = useState<TutorStudentNote | null>(null);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('tutor_student_learning_gap_notes');
    if (saved) {
      try {
        setTutorNotes(JSON.parse(saved));
      } catch {
        setTutorNotes([]);
      }
    } else {
      setTutorNotes([
        {
          id: 1,
          studentId: 1,
          title: "Focus on Bayes Theorem",
          note: "Assigned 5 practice problems on Bayes Theorem. Recommend reviewing tree diagrams.",
          date: "Aug 23, 2026"
        }
      ]);
    }
  }, []);

  const saveNotes = (updated: TutorStudentNote[]) => {
    setTutorNotes(updated);
    localStorage.setItem('tutor_student_learning_gap_notes', JSON.stringify(updated));
  };

  const handleOpenAdd = (studentId: number) => {
    setActiveStudentId(studentId);
    setEditingNote(null);
    setNoteTitle('');
    setNoteBody('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: TutorStudentNote) => {
    setActiveStudentId(note.studentId);
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteBody(note.note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteBody.trim() || activeStudentId === null) return;

    if (editingNote) {
      const updated = tutorNotes.map(n => n.id === editingNote.id ? {
        ...n,
        title: noteTitle,
        note: noteBody
      } : n);
      saveNotes(updated);
    } else {
      const newNote: TutorStudentNote = {
        id: Date.now(),
        studentId: activeStudentId,
        title: noteTitle,
        note: noteBody,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      saveNotes([newNote, ...tutorNotes]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteNote = (id: number) => {
    const updated = tutorNotes.filter(n => n.id !== id);
    saveNotes(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white shadow-sm">
            <h1 className="text-xl font-extrabold text-slate-900">Assigned Students & Learning Gaps</h1>
            <p className="text-xs text-slate-500 mt-1">Review student performance metrics, identified weak topics, and add custom pedagogical session notes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((s) => {
              const studentSpecificNotes = tutorNotes.filter(n => n.studentId === s.id);
              return (
                <div key={s.id} className="glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-extrabold text-white">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{s.class}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                      <span className="font-bold text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Detected Learning Gap:
                      </span>
                      <p className="text-slate-900 font-bold">{s.weakTopic}</p>
                      <p className="text-slate-600 text-[11px] leading-relaxed mt-1 font-medium">{s.gapReason}</p>
                    </div>

                    {/* Tutor Notes for this student */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase text-slate-700 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" /> Tutor Pedagogical Notes ({studentSpecificNotes.length}):
                        </span>
                        <button
                          onClick={() => handleOpenAdd(s.id)}
                          className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Note
                        </button>
                      </div>

                      {studentSpecificNotes.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">No notes added for this student yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {studentSpecificNotes.map((n) => (
                            <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <h5 className="font-bold text-slate-900">{n.title}</h5>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => handleOpenEdit(n)}
                                    className="text-slate-400 hover:text-indigo-600 p-0.5"
                                    title="Edit Note"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNote(n.id)}
                                    className="text-slate-400 hover:text-rose-600 p-0.5"
                                    title="Delete Note"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{n.note}</p>
                              <span className="text-[10px] text-slate-400 block text-right">{n.date}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Last Session: {s.lastSession}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingNote ? 'Edit Pedagogical Note' : 'Add Pedagogical Note for Student'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Note Heading:</label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Focus area for next practice quiz"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Note Details & Homework Recommendation:</label>
                <textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  rows={3}
                  placeholder="Enter custom tutor note or learning plan..."
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
}

export default function TeacherStudentsPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherStudentsContent />
    </ProtectedRoute>
  );
}

