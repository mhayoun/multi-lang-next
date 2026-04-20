// app/page.jsx
'use client'; // Required because we use state (logic)

import React from 'react';
import { LANGUAGES } from '@/lib/data';
import { useMenuManager } from '@/lib/useMenuManager';
import Navbar from '@/components/Navbar';
import AdminInterface from '@/components/AdminInterface';
import UserInterface from '@/components/UserInterface';

export default function Home() {
  const logic = useMenuManager();

  // --- ADD THIS BLOCK HERE ---
  // If the component hasn't "mounted" yet, we don't know the localStorage data.
  // Returning null (or a loading spinner) prevents Hydration errors.
  if (!logic.mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }
  // ---------------------------

  const uiText = LANGUAGES[logic.lang];

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300"
      dir={uiText.dir}
    >
      {/* Navbar stays at the top */}
      <Navbar logic={logic} uiText={uiText} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Toggle between Admin and User based on state */}
        {logic.view === 'admin' ? (
          <AdminInterface logic={logic} currentLang={logic.lang} />
        ) : (
          <UserInterface logic={logic} uiText={uiText} />
        )}
      </main>
    </div>
  );
}