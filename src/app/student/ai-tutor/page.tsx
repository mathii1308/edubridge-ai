"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatInterface } from '@/components/ai/ChatInterface';

function AITutorContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}

export default function AITutorPage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <AITutorContent />
    </ProtectedRoute>
  );
}

