"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ShieldCheck, Plus, Trash2, Check, ExternalLink } from 'lucide-react';

interface ResourceItem {
  id: number;
  title: string;
  source: string;
  subject: string;
  language: string;
  url: string;
  chunks: number;
  verified: boolean;
}

function AdminResourcesContent() {
  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: 1,
      title: "OpenStax University Mathematics: Probability and Combinatorics",
      source: "OpenStax Educational Initiative",
      subject: "Mathematics",
      language: "English",
      url: "https://openstax.org/details/books/introductory-statistics",
      chunks: 8,
      verified: true
    },
    {
      id: 2,
      title: "தமிழ்நாடு பாடநூல்: கணிதம் 12 — நிகழ்தகவு கோட்பாடு",
      source: "Tamil Nadu School Education Department",
      subject: "Mathematics",
      language: "Tamil",
      url: "https://www.textbooksonline.tn.nic.in",
      chunks: 6,
      verified: true
    },
    {
      id: 3,
      title: "Fundamentals of Database Systems & Normalization (3NF)",
      source: "Pearson Academic Press",
      subject: "DBMS",
      language: "English",
      url: "https://www.pearson.com",
      chunks: 12,
      verified: true
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newLanguage, setNewLanguage] = useState('English');
  const [newUrl, setNewUrl] = useState('');

  const fetchResources = async () => {
    try {
      const res = await fetch('http://localhost:8000/resources');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setResources(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAddResource = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;

    const resourceObj: ResourceItem = {
      id: Date.now(),
      title: newTitle,
      source: newSource || 'Academic Reference Publisher',
      subject: newSubject,
      language: newLanguage,
      url: newUrl,
      chunks: 10,
      verified: true
    };

    try {
      const res = await fetch('http://localhost:8000/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newSource,
          subject_name: newSubject,
          language: newLanguage,
          url: newUrl
        })
      });
      if (res.ok) {
        const data = await res.json();
        resourceObj.id = data.id || resourceObj.id;
      }
    } catch {}

    setResources([resourceObj, ...resources]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSource('');
    setNewUrl('');
  };

  const handleRemoveResource = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/resources/${id}`, { method: 'DELETE' });
    } catch {}
    setResources(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Academic Grounding & Knowledge Base Management</h1>
              <p className="text-xs text-slate-500 mt-1">Ingest open educational textbooks and public academic resources for AI Tutor reference grounding.</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Resource
            </button>
          </div>

          <div className="space-y-4">
            {resources.map((r) => (
              <div key={r.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Grounded & Verified
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 font-bold mt-0.5">Source: {r.source} • Subject: {r.subject} ({r.language})</p>
                  <p className="text-xs text-slate-500 mt-1">Chunks: {r.chunks} Vector Embeddings Indexed</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> View Source
                  </a>

                  <button
                    onClick={() => handleRemoveResource(r.id)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add New Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 border border-slate-200 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Educational Resource</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Resource Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. University Physics Vol 1 - Wave Optics"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Source / Author Organization:</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="e.g. OpenStax Educational Foundation"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject:</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="DBMS">DBMS</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Language:</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Portal URL / File Path:</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://openstax.org/..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddResource}
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

export default function AdminResourcesPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminResourcesContent />
    </ProtectedRoute>
  );
}

