"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Users, UserCheck, GraduationCap, ShieldAlert, Trash2, Search, Filter } from 'lucide-react';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

function AdminUsersContent() {
  const [users, setUsers] = useState<UserItem[]>([
    { id: 1, name: 'Ananya Sharma', email: 'student@edubridge.ai', role: 'student', status: 'Active' },
    { id: 2, name: 'Student Account', email: 'student.demo@edubridge.local', role: 'student', status: 'Active' },
    { id: 3, name: 'Dr. Rajesh Kumar', email: 'tutor.rajesh@edubridge.ai', role: 'teacher', status: 'Verified Tutor' },
    { id: 4, name: 'Prof. Lakshmi Priya', email: 'tutor.demo@edubridge.local', role: 'teacher', status: 'Verified Tutor' },
    { id: 5, name: 'EduBridge Admin', email: 'admin@edubridge.ai', role: 'admin', status: 'Super Admin' },
  ]);

  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setUsers(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await fetch(`http://localhost:8000/admin/users/${userToDelete.id}`, { method: 'DELETE' });
    } catch {}

    setUsers(prev => {
      const updated = prev.filter(u => u.id !== userToDelete.id);
      try {
        localStorage.setItem('edubridge_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">User Account & Role Management</h1>
              <p className="text-xs text-slate-500 mt-1">Manage platform users across Student, Tutor, and Admin roles, monitor access credentials, and revoke user accounts.</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 font-bold">
              Total Users: {users.length}
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 px-3 py-2 rounded-lg flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email address..."
                className="bg-transparent text-slate-900 focus:outline-none w-full font-medium"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-600 font-bold">Role Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none font-semibold"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Tutor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="space-y-3">
              {filteredUsers.map((u) => (
                <div key={u.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                      {u.role === 'student' ? <GraduationCap className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                      <p className="text-slate-500 font-medium">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {u.role}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {u.status}
                    </span>

                    <button
                      onClick={() => setUserToDelete(u)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center gap-1 transition-all"
                      title="Remove User Account"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal for Removing User */}
      {userToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 border border-slate-200 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center space-x-3 text-rose-600 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Confirm User Removal</h3>
            </div>

            <p className="text-slate-600 leading-relaxed font-medium">
              Are you sure you want to permanently remove <strong className="text-slate-900">{userToDelete.name}</strong> ({userToDelete.email}) from EduBridge AI? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-2xs"
              >
                Confirm & Delete User
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

