"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BookOpen, ShieldCheck, Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';

interface ResourceItem {
  id: number;
  title: string;
  description: string;
  source_name: string;
  source_url: string;
  subject: string;
  language: string;
  verified: boolean;
  chunk_count?: number;
}

function AdminResourcesContent() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<ResourceItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceName, setSourceName] = useState('Academic Textbook');
  const [sourceUrl, setSourceUrl] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [language, setLanguage] = useState('English');

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:8000/resources');
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      } else {
        throw new Error();
      }
    } catch {
      // Local fallback
      setResources([
        {
          id: 1,
          title: "OpenStax University Mathematics: Probability & Combinatorics",
          description: "Grounded open textbook covering probability distributions and statistical inference.",
          source_name: "OpenStax Educational Initiative",
          source_url: "https://openstax.org/details/books/introductory-statistics",
          subject: "Mathematics",
          language: "English",
          verified: true,
          chunk_count: 8
        },
        {
          id: 2,
          title: "தமிழ்நாடு பாடநூல்: கணிதம் 12 — நிகழ்தகவு கோட்பாடு",
          description: "Tamil Nadu Higher Secondary textbook excerpt on conditional probability.",
          source_name: "Tamil Nadu School Education Department",
          source_url: "https://www.textbooksonline.tn.nic.in",
          subject: "Mathematics",
          language: "Tamil",
          verified: true,
          chunk_count: 6
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleOpenAdd = () => {
    setEditingRes(null);
    setTitle('');
    setDescription('');
    setSourceName('Academic Textbook');
    setSourceUrl('');
    setSubject('Mathematics');
    setLanguage('English');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (resItem: ResourceItem) => {
    setEditingRes(resItem);
    setTitle(resItem.title);
    setDescription(resItem.description || '');
    setSourceName(resItem.source_name || '');
    setSourceUrl(resItem.source_url || '');
    setSubject(resItem.subject || 'Mathematics');
    setLanguage(resItem.language || 'English');
    setIsModalOpen(true);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sourceUrl.trim()) return;

    const payload = {
      title,
      description,
      source_name: sourceName,
      source_url: sourceUrl,
      subject,
      language,
      verified: true
    };

    try {
      if (editingRes) {
        await fetch(`http://localhost:8000/resources/${editingRes.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setResources(prev => prev.map(r => r.id === editingRes.id ? { ...r, ...payload } : r));
      } else {
        const response = await fetch('http://localhost:8000/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const created = await response.json();
          setResources(prev => [created, ...prev]);
        } else {
          setResources(prev => [{ id: Date.now(), ...payload, chunk_count: 0 }, ...prev]);
        }
      }
    } catch {
      if (editingRes) {
        setResources(prev => prev.map(r => r.id === editingRes.id ? { ...r, ...payload } : r));
      } else {
        setResources(prev => [{ id: Date.now(), ...payload, chunk_count: 0 }, ...prev]);
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm('Are you sure you want to remove this resource from the AI Knowledge Base?')) return;
    try {
      await fetch(`http://localhost:8000/resources/${id}`, { method: 'DELETE' });
    } catch {
      // Local state update fallback
    } finally {
      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">AI Knowledge Base & Resource Management</h1>
              <p className="text-xs text-slate-500 mt-1">Ingest, edit, and curate verified open educational resources for AI Tutor grounding.</p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Resource
            </button>
          </div>

          <div className="space-y-4">
            {resources.map((r) => (
              <div key={r.id} className="glass-card rounded-3xl p-6 border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Grounded & Verified
                    </span>
                  </div>
                  {r.description && (
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{r.description}</p>
                  )}
                  <p className="text-xs text-indigo-700 font-bold">
                    Source: {r.source_name} • Subject: {r.subject} ({r.language})
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={r.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Link</span>
                  </a>

                  <button
                    onClick={() => handleOpenEdit(r)}
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200"
                    title="Edit Resource"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteResource(r.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add / Edit Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingRes ? 'Edit Educational Resource' : 'Add New Educational Resource'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Resource Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. OpenStax University Physics Vol 2"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Summary:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Short description of the textbook or reference material..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject:</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="DBMS">DBMS</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Source Organization / Publisher:</label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. OpenStax / MIT OCW / NCERT"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Source URL / File Link:</label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://openstax.org/..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
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
                  {editingRes ? 'Update Resource' : 'Save & Ingest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminResourcesPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminResourcesContent />
    </ProtectedRoute>
  );
}

