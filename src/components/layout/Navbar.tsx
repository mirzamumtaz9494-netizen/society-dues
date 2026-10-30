'use client';

import React from 'react';
import Link from 'next/link';
import { useSociety } from '@/context/SocietyContext';
import { Building2, Calendar, ShieldCheck, UserCheck, RotateCcw } from 'lucide-react';

export function Navbar() {
  const {
    society,
    currentMonthYear,
    setCurrentMonthYear,
    userRole,
    setUserRole,
    resetDemoData,
  } = useSociety();

  const months = [
    { value: '2026-10', label: 'Oct 2026' },
    { value: '2026-11', label: 'Nov 2026 (Current)' },
    { value: '2026-12', label: 'Dec 2026' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Society Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 dark:text-white truncate leading-tight">
                {society.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                SocietyDues • Standalone Apartment Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Active Billing Month Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs sm:text-sm">
            <Calendar className="w-4 h-4 text-slate-500 ml-1.5 hidden sm:inline" />
            <select
              aria-label="Select billing month"
              value={currentMonthYear}
              onChange={(e) => setCurrentMonthYear(e.target.value)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-200 px-2 py-1 outline-none cursor-pointer"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value} className="bg-white dark:bg-slate-900">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role Toggle Switch: Admin (Treasurer) vs Resident (View-Only) */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setUserRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                userRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Treasurer
            </button>
            <button
              onClick={() => setUserRole('resident')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                userRole === 'resident'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Resident View
            </button>
          </div>

          {/* Quick Demo Reset */}
          <button
            onClick={resetDemoData}
            title="Reset to Initial Demo State"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hidden sm:block"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
