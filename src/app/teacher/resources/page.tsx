"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BookOpen, Plus, Edit2, Trash2, Check, ExternalLink, FileText } from 'lucide-react';

interface TutorResource {
  id: number;
  title: string;
  description: string;
  subject: string;
  topic: string;
  url: string;
  created_at: string;
}

function TeacherResourcesContent() {
  const [resources, setResources] = useState<TutorResource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('Calculus');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('tutor_education_resources');
    if (saved) {
      try {
        setResources(JSON.parse(saved));
      } catch (e) {
        setResources([]);
      }
    } else {
      // Default initial resources
      const initial: TutorResource[] = [
        {
          id: 1,
          title: "MIT OpenCourseWare: Calculus I Reference Guide",
          description: "Comprehensive step-by-step problem sets covering differentiation, integration, and boundary conditions.",
          subject: "Mathematics",
          topic: "Calculus & Derivatives",
          url: "https://ocw.mit.edu",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "DBMS Normalization (1NF to 3NF) Visual Cheatsheet",
          description: "Diagrammatic breakdown of candidate keys, functional dependencies, and BCNF conversion rules.",
          subject: "Computer Science / DBMS",
          topic: "Database Normalization (2NF & 3NF)",
          url: "https://openstax.org",
          created_at: new Date().toISOString()
        }
      ];
      setResources(initial);
      localStorage.setItem('tutor_education_resources', JSON.stringify(initial));
    }
  }, []);

  const saveResourcesToStorage = (updated: TutorResource[]) => {
    setResources(updated);
    localStorage.setItem('tutor_education_resources', JSON.stringify(updated));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setSubject('Mathematics');
    setTopic('Calculus');
    setUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (res: TutorResource) => {
    setEditingId(res.id);
    setTitle(res.title);
    setDescription(res.description);
    setSubject(res.subject);
    setTopic(res.topic);
    setUrl(res.url);
    setIsModalOpen(true);
  };

  const handleSaveResource = () => {
    if (!title.trim()) return;

    if (editingId) {
      const updated = resources.map(r => r.id === editingId ? {
        ...r,
        title,
        description,
        subject,
        topic,
        url
      } : r);
      saveResourcesToStorage(updated);
    } else {
      const newRes: TutorResource = {
        id: Date.now(),
        title,
        description,
        subject,
        topic,
        url: url || 'https://openstax.org',
        created_at: new Date().toISOString()
      };
      saveResourcesToStorage([newRes, ...resources]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteResource = (id: number) => {
    const updated = resources.filter(r => r.id !== id);
    saveResourcesToStorage(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Pedagogical Content Repository</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">Education Resources Manager</h1>
              <p className="text-xs text-slate-500 mt-0.5">Publish study guides, textbook links, and reference materials for your students.</p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Resource
            </button>
          </div>

          {/* Resources List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <div key={res.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                        {res.subject} • {res.topic}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug mt-0.5">{res.title}</h3>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-2">
                      <button
                        onClick={() => handleOpenEditModal(res)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                        title="Edit Resource"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                        title="Remove Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Added by Tutor</span>
                  {res.url && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition-all border border-blue-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Resource Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 border border-slate-200 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? 'Edit Educational Resource' : 'Add New Educational Resource'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Resource Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wave Optics Fundamentals Cheatsheet"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter summary of resource content and concepts covered..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject:</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science / DBMS">Computer Science / DBMS</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Topic / Concept:</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Wave Optics"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Resource Link / URL:</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveResource}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Check className="w-4 h-4" /> Save Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeacherResourcesPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherResourcesContent />
    </ProtectedRoute>
  );
}
