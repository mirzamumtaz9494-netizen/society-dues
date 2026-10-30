'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSociety } from '@/context/SocietyContext';
import { formatINR, formatMonthYear, formatDate } from '@/lib/format';
import {
  CreditCard,
  Receipt,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Send,
  QrCode,
  CheckCircle2,
  Download,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { UpiQrModal } from '@/components/dues/UpiQrModal';
import { WhatsAppReminderModal } from '@/components/dues/WhatsAppReminderModal';
import { ReceiptModal } from '@/components/receipt/ReceiptModal';
import { Due } from '@/lib/types';

export default function DashboardOverviewPage() {
  const {
    society,
    dues,
    expenses,
    currentMonthYear,
    financialSummary,
    userRole,
  } = useSociety();

  const [selectedDueForQr, setSelectedDueForQr] = useState<Due | null>(null);
  const [selectedDueForWhatsApp, setSelectedDueForWhatsApp] = useState<Due | null>(null);
  const [selectedDueForReceipt, setSelectedDueForReceipt] = useState<Due | null>(null);

  const overdueDues = dues.filter((d) => d.status === 'overdue' || d.status === 'unpaid');
  const paidDues = dues.filter((d) => d.status === 'paid');

  return (
    <div className="space-y-6">
      {/* Top Welcome & Society Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
            {formatMonthYear(currentMonthYear)} • Financial Dashboard
          </span>
          <h1 className="text-2xl font-black mt-1">{society.name}</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {society.address} • UPI ID:{' '}
            <span className="font-mono font-semibold text-indigo-200">
              {society.upi_id}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/dues">
            <Button
              variant="success"
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
            >
              <QrCode className="w-4 h-4 mr-1.5" />
              Collect Dues
            </Button>
          </Link>
          <Link href="/dashboard/reports">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 bg-white/10 hover:bg-white/20 text-white"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Monthly PDF
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Financial Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Expected Collection */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Expected Dues</span>
            <CreditCard className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatINR(financialSummary.totalDuesExpected)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {dues.length} total billed flats
          </div>
        </Card>

        {/* Card 2: Total Collected */}
        <Card className="p-4 sm:p-5 border-emerald-200/80 bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Collected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {formatINR(financialSummary.totalCollected)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${financialSummary.collectionRate}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-emerald-700">
              {financialSummary.collectionRate}%
            </span>
          </div>
        </Card>

        {/* Card 3: Total Expenses */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Spent</span>
            <Receipt className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatINR(financialSummary.totalExpenses)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {expenses.length} expense vouchers logged
          </div>
        </Card>

        {/* Card 4: Net Surplus / Balance */}
        <Card
          className={`p-4 sm:p-5 ${
            financialSummary.netSurplus >= 0
              ? 'border-indigo-200 bg-indigo-50/20'
              : 'border-rose-200 bg-rose-50/20'
          }`}
        >
          <div className="flex items-center justify-between text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Net Monthly Surplus</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div
            className={`text-xl sm:text-2xl font-black ${
              financialSummary.netSurplus >= 0
                ? 'text-indigo-700 dark:text-indigo-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatINR(financialSummary.netSurplus)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Reserve fund balance delta
          </div>
        </Card>
      </div>

      {/* Two Column Section: Pending Reminders & Recent Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending & Overdue Dues */}
        <Card className="flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Pending Collections ({overdueDues.length})
              </h2>
            </div>
            <Link
              href="/dashboard/dues"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CardContent className="p-0 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
            {overdueDues.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                🎉 All flats have cleared maintenance for this month!
              </div>
            ) : (
              overdueDues.slice(0, 5).map((due) => (
                <div
                  key={due.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Flat {due.flat?.flat_number}
                      </span>
                      <StatusBadge status={due.status} />
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {due.flat?.owner_name} • {formatINR(due.amount)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setSelectedDueForQr(due)}
                      title="Show UPI QR Code"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <QrCode className="w-4 h-4 text-indigo-600" />
                      <span className="hidden sm:inline">QR</span>
                    </button>

                    <button
                      onClick={() => setSelectedDueForWhatsApp(due)}
                      title="Remind via WhatsApp"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Send className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right: Recent Cleared Payments & Receipts */}
        <Card className="flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Recent Cleared Receipts ({paidDues.length})
              </h2>
            </div>
            <Link
              href="/dashboard/dues"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CardContent className="p-0 flex-1 divide-y divide-slate-100 dark:border-slate-800">
            {paidDues.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No payments recorded yet for this month.
              </div>
            ) : (
              paidDues.slice(0, 5).map((due) => (
                <div
                  key={due.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Flat {due.flat?.flat_number}
                      </span>
                      <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                        {due.payment?.receipt_no}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {due.flat?.owner_name} • {formatINR(due.payment?.amount_paid || due.amount)} via{' '}
                      {due.payment?.payment_mode}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDueForReceipt(due)}
                    className="text-xs shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Receipt
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <UpiQrModal
        isOpen={!!selectedDueForQr}
        onClose={() => setSelectedDueForQr(null)}
        due={selectedDueForQr}
        society={society}
      />

      <WhatsAppReminderModal
        isOpen={!!selectedDueForWhatsApp}
        onClose={() => setSelectedDueForWhatsApp(null)}
        due={selectedDueForWhatsApp}
        society={society}
      />

      <ReceiptModal
        isOpen={!!selectedDueForReceipt}
        onClose={() => setSelectedDueForReceipt(null)}
        due={selectedDueForReceipt}
        society={society}
      />
    </div>
  );
}
