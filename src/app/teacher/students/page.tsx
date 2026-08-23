"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AlertTriangle, Plus, FileText, Check, Edit2, Trash2 } from 'lucide-react';

function TeacherStudentsContent() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Ananya Sharma',
      class: 'Class 12 STEM Science',
      weakTopic: 'Probability & Bayes Theorem',
      gapReason: 'Struggling with conditional probability formula application in multi-step word problems.',
      lastSession: 'Aug 23, 2026',
      notes: ['Requires extra practice on tree diagrams for conditional probability.']
    },
    {
      id: 2,
      name: 'Student Account',
      class: 'Class 12 Computer Science',
      weakTopic: 'DBMS Normalization (2NF & 3NF)',
      gapReason: 'Struggling with functional dependencies decomposition rules.',
      lastSession: 'Aug 23, 2026',
      notes: ['Recommended reviewing 2NF candidate key rules before next session.']
    }
  ]);

  const [activeStudentId, setActiveStudentId] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (studentId: number) => {
    setActiveStudentId(studentId);
    setNoteInput('');
    setIsModalOpen(true);
  };

  const handleAddNote = () => {
    if (!noteInput.trim() || activeStudentId === null) return;
    setStudents(prev => prev.map(s => {
      if (s.id === activeStudentId) {
        return { ...s, notes: [...s.notes, noteInput.trim()] };
      }
      return s;
    }));
    setNoteInput('');
    setIsModalOpen(false);
  };

  const handleDeleteNote = (studentId: number, noteIdx: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updated = [...s.notes];
        updated.splice(noteIdx, 1);
        return { ...s, notes: updated };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h1 className="text-xl font-bold text-slate-900">Assigned Students & Learning Gaps</h1>
            <p className="text-xs text-slate-500 mt-1">Review student performance metrics, identified weak topics, and add custom pedagogical session notes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{s.class}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-1">
                  <span className="font-bold text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Identified Learning Gap:
                  </span>
                  <p className="text-slate-900 font-bold">{s.weakTopic}</p>
                  <p className="text-slate-700 text-[11px] leading-relaxed mt-1">{s.gapReason}</p>
                </div>

                {/* Notes List */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600" /> Tutor Session Notes ({s.notes.length})
                    </span>
                    <button
                      onClick={() => handleOpenModal(s.id)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Note
                    </button>
                  </div>

                  {s.notes.length > 0 ? (
                    <div className="space-y-1.5">
                      {s.notes.map((note, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex justify-between items-start">
                          <p className="font-medium leading-relaxed">{note}</p>
                          <button
                            onClick={() => handleDeleteNote(s.id, idx)}
                            className="p-1 text-slate-400 hover:text-red-600 shrink-0 ml-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span>Last Session: {s.lastSession}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 border border-slate-200 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Pedagogical Note</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Note Details:</label>
                <textarea
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Enter observation or study instruction for student..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Check className="w-4 h-4" /> Save Note
                </button>
              </div>
            </div>
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

