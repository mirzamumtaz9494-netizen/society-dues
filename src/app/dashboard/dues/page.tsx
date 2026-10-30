'use client';

import React, { useState } from 'react';
import { useSociety } from '@/context/SocietyContext';
import { formatINR, formatMonthYear, formatDate } from '@/lib/format';
import { Due, PaymentMode } from '@/lib/types';
import {
  CreditCard,
  QrCode,
  Send,
  CheckCircle2,
  Download,
  Filter,
  Search,
  Sparkles,
  Calendar,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { UpiQrModal } from '@/components/dues/UpiQrModal';
import { WhatsAppReminderModal } from '@/components/dues/WhatsAppReminderModal';
import { MarkPaidModal } from '@/components/dues/MarkPaidModal';
import { ReceiptModal } from '@/components/receipt/ReceiptModal';

export default function DuesPage() {
  const {
    society,
    dues,
    flats,
    currentMonthYear,
    setCurrentMonthYear,
    generateDues,
    markAsPaid,
    userRole,
  } = useSociety();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'paid' | 'overdue'>('all');

  // Modal States
  const [activeQrDue, setActiveQrDue] = useState<Due | null>(null);
  const [activeWhatsAppDue, setActiveWhatsAppDue] = useState<Due | null>(null);
  const [activeMarkPaidDue, setActiveMarkPaidDue] = useState<Due | null>(null);
  const [activeReceiptDue, setActiveReceiptDue] = useState<Due | null>(null);

  // Filter dues
  const filteredDues = dues.filter((due) => {
    const flatNo = due.flat?.flat_number?.toLowerCase() || '';
    const ownerName = due.flat?.owner_name?.toLowerCase() || '';
    const phone = due.flat?.phone || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      flatNo.includes(query) || ownerName.includes(query) || phone.includes(query);

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return due.status === statusFilter;
  });

  const handleGenerateDuesClick = () => {
    // Generates dues with default due date of the 10th of the selected month
    const dueDate = `${currentMonthYear}-10`;
    generateDues(dueDate);
  };

  const handleConfirmPayment = (params: {
    dueId: string;
    paymentMode: PaymentMode;
    upiRefNo?: string;
    remarks?: string;
  }) => {
    const payment = markAsPaid(params);
    // Open receipt modal immediately
    const updatedDue = dues.find((d) => d.id === params.dueId);
    if (updatedDue) {
      setActiveReceiptDue({
        ...updatedDue,
        status: 'paid',
        payment,
      });
    }
  };

  const paidCount = dues.filter((d) => d.status === 'paid').length;
  const unpaidCount = dues.filter((d) => d.status === 'unpaid').length;
  const overdueCount = dues.filter((d) => d.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Header & Generate Dues Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Monthly Dues & UPI Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Billing & collections for {formatMonthYear(currentMonthYear)} • Default: ₹
            {society.default_maintenance}/flat
          </p>
        </div>

        {userRole === 'admin' && (
          <Button
            variant="primary"
            onClick={handleGenerateDuesClick}
            className="w-full sm:w-auto shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Generate Dues for {formatMonthYear(currentMonthYear)}
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Flat number, Owner name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({dues.length})
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                statusFilter === 'paid'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Paid ({paidCount})
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                statusFilter === 'unpaid'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Unpaid ({unpaidCount})
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                statusFilter === 'overdue'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Overdue ({overdueCount})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Dues List / Responsive Table */}
      {filteredDues.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-3">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Dues Records Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {dues.length === 0
              ? `No maintenance dues have been billed yet for ${formatMonthYear(
                  currentMonthYear
                )}. Click "Generate Dues" above to bill all registered flats.`
              : 'No flats match your filter criteria.'}
          </p>
          {dues.length === 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateDuesClick}
              className="mt-4"
            >
              Generate Dues Now
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Flat No</th>
                  <th className="py-3 px-4">Resident / Owner</th>
                  <th className="py-3 px-4">WhatsApp Phone</th>
                  <th className="py-3 px-4">Due Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDues.map((due) => (
                  <tr
                    key={due.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                      Flat {due.flat?.flat_number}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {due.flat?.owner_name}
                      </div>
                      {due.flat?.is_rented && due.flat.tenant_name && (
                        <div className="text-[11px] text-amber-600 font-medium">
                          Tenant: {due.flat.tenant_name}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                      +91 {due.flat?.phone}
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                      {formatINR(due.amount)}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={due.status} />
                      {due.payment?.receipt_no && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          #{due.payment.receipt_no}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Action 1: UPI QR Modal */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveQrDue(due)}
                          title="Generate UPI QR Code"
                          className="text-xs"
                        >
                          <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="hidden xl:inline">UPI QR</span>
                        </Button>

                        {/* Action 2: WhatsApp Reminder */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveWhatsAppDue(due)}
                          title="Send WhatsApp Reminder"
                          className="text-xs text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden xl:inline">WhatsApp</span>
                        </Button>

                        {/* Action 3: Mark as Paid or View Receipt */}
                        {due.status === 'paid' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setActiveReceiptDue(due)}
                            className="text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                          >
                            <Download className="w-3.5 h-3.5 mr-1" />
                            Receipt
                          </Button>
                        ) : userRole === 'admin' ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => setActiveMarkPaidDue(due)}
                            className="text-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                            Mark Paid
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Friendly Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-3">
            {filteredDues.map((due) => (
              <Card key={due.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      Flat {due.flat?.flat_number}
                    </span>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {due.flat?.owner_name}
                    </p>
                    {due.flat?.is_rented && due.flat.tenant_name && (
                      <p className="text-[11px] text-amber-600">
                        Tenant: {due.flat.tenant_name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 dark:text-white block">
                      {formatINR(due.amount)}
                    </span>
                    <StatusBadge status={due.status} />
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  WhatsApp: +91 {due.flat?.phone}
                </div>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveQrDue(due)}
                    className="text-xs"
                  >
                    <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                    UPI
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveWhatsAppDue(due)}
                    className="text-xs text-emerald-700 border-emerald-200"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    WA
                  </Button>

                  {due.status === 'paid' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveReceiptDue(due)}
                      className="text-xs text-indigo-700 bg-indigo-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => setActiveMarkPaidDue(due)}
                      className="text-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Paid
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <UpiQrModal
        isOpen={!!activeQrDue}
        onClose={() => setActiveQrDue(null)}
        due={activeQrDue}
        society={society}
        onMarkPaidClick={(due) => setActiveMarkPaidDue(due)}
      />

      <WhatsAppReminderModal
        isOpen={!!activeWhatsAppDue}
        onClose={() => setActiveWhatsAppDue(null)}
        due={activeWhatsAppDue}
        society={society}
      />

      <MarkPaidModal
        isOpen={!!activeMarkPaidDue}
        onClose={() => setActiveMarkPaidDue(null)}
        due={activeMarkPaidDue}
        onConfirm={handleConfirmPayment}
      />

      <ReceiptModal
        isOpen={!!activeReceiptDue}
        onClose={() => setActiveReceiptDue(null)}
        due={activeReceiptDue}
        society={society}
      />
    </div>
  );
}
