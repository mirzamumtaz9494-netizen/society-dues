'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Due, PaymentMode } from '@/lib/types';
import { formatINR, formatMonthYear, generateReceiptNumber } from '@/lib/format';
import { CheckCircle2, Receipt, ShieldCheck } from 'lucide-react';

interface MarkPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  due: Due | null;
  onConfirm: (params: {
    dueId: string;
    paymentMode: PaymentMode;
    upiRefNo?: string;
    remarks?: string;
  }) => void;
}

export function MarkPaidModal({
  isOpen,
  onClose,
  due,
  onConfirm,
}: MarkPaidModalProps) {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [upiRefNo, setUpiRefNo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!due) return null;

  const autoReceiptNo = generateReceiptNumber(
    due.month_year,
    due.flat?.flat_number || '000'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      onConfirm({
        dueId: due.id,
        paymentMode,
        upiRefNo: upiRefNo.trim() || undefined,
        remarks: remarks.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify & Mark Payment"
      subtitle={`Flat ${due.flat?.flat_number} (${due.flat?.owner_name}) • ${formatMonthYear(
        due.month_year
      )}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount & Receipt Badge */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Amount to Clear
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatINR(due.amount)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Generated Receipt #
            </span>
            <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-md border border-indigo-200 dark:border-indigo-800 mt-0.5">
              {autoReceiptNo}
            </div>
          </div>
        </div>

        {/* Payment Mode Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Payment Mode *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['UPI', 'Cash', 'Bank Transfer', 'Cheque'] as PaymentMode[]).map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setPaymentMode(mode)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between ${
                  paymentMode === mode
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{mode}</span>
                {paymentMode === mode && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Reference Number (UPI UTR / Cheque No / NEFT Ref) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            {paymentMode === 'UPI'
              ? 'UPI Ref / UTR Number'
              : paymentMode === 'Cheque'
              ? 'Cheque Number & Bank'
              : paymentMode === 'Bank Transfer'
              ? 'NEFT / IMPS Reference'
              : 'Cash Receipt Memo / Note'}
          </label>
          <input
            type="text"
            value={upiRefNo}
            onChange={(e) => setUpiRefNo(e.target.value)}
            placeholder={
              paymentMode === 'UPI'
                ? 'e.g. UPI/349810283901 or 12-digit UTR'
                : paymentMode === 'Cheque'
                ? 'e.g. Chq #004521 - SBI'
                : 'e.g. Handed to watchman'
            }
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Additional Remarks */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Treasurer Notes (Optional)
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Paid on 28th via PhonePe"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex gap-2.5 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            isLoading={isSubmitting}
            className="flex-1"
          >
            <ShieldCheck className="w-4 h-4" />
            Confirm & Issue Receipt
          </Button>
        </div>
      </form>
    </Modal>
  );
}
