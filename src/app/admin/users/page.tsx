"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Users, ShieldCheck, UserCheck, GraduationCap, Edit2, Trash2, X, Search } from 'lucide-react';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  account_status?: string;
}

function AdminUsersContent() {
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 1, name: 'Ananya Sharma', email: 'student@edubridge.ai', role: 'student', status: 'Active' },
    { id: 2, name: 'Demo Student', email: 'student.demo@edubridge.local', role: 'student', status: 'Active' },
    { id: 3, name: 'Dr. Rajesh Kumar', email: 'tutor.rajesh@edubridge.ai', role: 'teacher', status: 'Verified Tutor' },
    { id: 4, name: 'Prof. Lakshmi Priya', email: 'tutor.lakshmi@edubridge.ai', role: 'teacher', status: 'Verified Tutor' },
    { id: 5, name: 'EduBridge Admin', email: 'admin@edubridge.ai', role: 'admin', status: 'Super Admin' },
  ]);

  const [activeTab, setActiveTab] = useState<'All' | 'student' | 'teacher' | 'admin'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Edit & Remove
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('student');
  const [editStatus, setEditStatus] = useState('Active');

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [removingUser, setRemovingUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:8000/admin/users');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setUsers(data.map((u: any) => ({
              ...u,
              status: u.account_status || (u.role === 'teacher' ? 'Verified Tutor' : u.role === 'admin' ? 'Super Admin' : 'Active')
            })));
          }
        }
      } catch {
        // Fallback to local default state
      }
    };
    fetchUsers();
  }, []);

  const handleOpenEdit = (userRec: UserRecord) => {
    setEditingUser(userRec);
    setEditName(userRec.name);
    setEditEmail(userRec.email);
    setEditRole(userRec.role);
    setEditStatus(userRec.status || 'Active');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await fetch(`http://localhost:8000/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          account_status: editStatus
        })
      });
    } catch {
      // Local state fallback
    } finally {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u,
        name: editName,
        email: editEmail,
        role: editRole,
        status: editStatus
      } : u));
      setIsEditModalOpen(false);
    }
  };

  const handleOpenRemove = (userRec: UserRecord) => {
    setRemovingUser(userRec);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!removingUser) return;

    try {
      await fetch(`http://localhost:8000/admin/users/${removingUser.id}`, {
        method: 'DELETE'
      });
    } catch {
      // Local state fallback
    } finally {
      setUsers(prev => prev.filter(u => u.id !== removingUser.id));
      setIsRemoveModalOpen(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesTab = activeTab === 'All' || u.role === activeTab;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">User & Tutor Credential Management</h1>
              <p className="text-xs text-slate-500 mt-1">Manage user accounts, verify roles, update details, and oversee platform access.</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              Total Managed Users: {users.length}
            </div>
          </div>

          {/* Role Filter Tabs & Search Bar */}
          <div className="glass-card rounded-2xl p-4 border border-slate-200 bg-white space-y-3 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              {/* Role Tabs */}
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('All')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'All' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Users ({users.length})
                </button>
                <button
                  onClick={() => setActiveTab('student')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'student' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Students ({users.filter(u => u.role === 'student').length})
                </button>
                <button
                  onClick={() => setActiveTab('teacher')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'teacher' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tutors ({users.filter(u => u.role === 'teacher').length})
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admins ({users.filter(u => u.role === 'admin').length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search user by name or email..."
                  className="bg-transparent text-slate-900 font-medium focus:outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-3 shadow-sm">
            {filteredUsers.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No matching user records found.</p>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-extrabold text-white shrink-0">
                      {u.role === 'student' ? <GraduationCap className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                      <p className="text-slate-500 font-medium">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                      {u.role}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {u.status || 'Active'}
                    </span>

                    <div className="flex items-center space-x-1 pl-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold"
                        title="Edit User Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenRemove(u)}
                        className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold"
                        title="Remove User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Edit User Account #{editingUser.id}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address:</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Role:</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Tutor (Teacher)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Account Status Label:</label>
                <input
                  type="text"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  placeholder="e.g. Active, Verified Tutor"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove User Confirmation Modal */}
      {isRemoveModalOpen && removingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">Remove User Account</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Are you sure you want to permanently delete <strong>{removingUser.name}</strong> ({removingUser.email})?
            </p>

            <div className="flex items-center justify-center space-x-2 pt-2 text-xs">
              <button
                onClick={() => setIsRemoveModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminUsersContent />
    </ProtectedRoute>
  );
}

