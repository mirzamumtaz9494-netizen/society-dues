'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  CreditCard,
  QrCode,
  Receipt,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Society<span className="text-indigo-600">Dues</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                For Standalone Apartments (10–50 Flats)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                Open Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" /> Zero Friction • No Complex Accounting • Instant WhatsApp & UPI
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-3xl leading-[1.15]">
          Manage Society Maintenance Without the WhatsApp Chaos.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Built specifically for residential apartment treasurers in India.
          Track monthly dues, generate dynamic UPI payment QRs, dispatch 1-click WhatsApp reminders, and issue instant PDF receipts.
        </p>

        {/* Primary CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-base shadow-lg shadow-indigo-600/25">
              Launch Live App Demo <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          </Link>
          <Link href="/setup">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-3 text-base">
              Setup Your Society UPI
            </Button>
          </Link>
        </div>

        {/* 6 Core Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 text-left w-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">1-Click WhatsApp Reminders</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Pre-filled cordial reminder with flat number, due amount, month, and direct UPI link dispatched with one tap.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant NPCI UPI QR</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Standard QR code scannable on GPay, PhonePe, Paytm, and BHIM with exact maintenance amount and zero transaction fees.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 mb-4">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Official PDF Receipts</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              One-click digital receipt generation with Society Header, Flat No, Receipt #, Payment mode, and Treasurer signature.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Monthly Dues Engine</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              On the 1st of every month, auto-generate billing for all active flats. Track Unpaid, Paid, and Overdue statuses instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Expense & Petty Cash Log</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Track Watchman salary, Lift AMC, Borewell repairs, common electricity, and attach vendor bills for complete transparency.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Export RWA Balance Sheet</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              1-Click PDF financial statement showing collections vs expenses vs net surplus to print or share at general body meetings.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>SocietyDues • The Modern Apartment Maintenance & Transparency Suite</p>
      </footer>
    </div>
  );
}
