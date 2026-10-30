'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Due, Society } from '@/lib/types';
import { generateUpiUrl } from '@/lib/upi';
import { formatINR, formatMonthYear } from '@/lib/format';
import { Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface UpiQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  due: Due | null;
  society: Society;
  onMarkPaidClick?: (due: Due) => void;
}

export function UpiQrModal({
  isOpen,
  onClose,
  due,
  society,
  onMarkPaidClick,
}: UpiQrModalProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!due) return null;

  const upiIntentUri = generateUpiUrl({
    upiId: society.upi_id,
    payeeName: society.name,
    amount: due.amount,
    transactionNote: `Maintenance Flat ${due.flat?.flat_number || ''} ${due.month_year}`,
  });

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(society.upi_id);
    setCopied(true);
    showToast({
      type: 'success',
      title: 'UPI ID Copied',
      message: `${society.upi_id} copied to clipboard.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pay ₹${due.amount} via UPI`}
      subtitle={`Flat ${due.flat?.flat_number} (${due.flat?.owner_name}) • ${formatMonthYear(
        due.month_year
      )}`}
      maxWidth="md"
    >
      <div className="flex flex-col items-center text-center">
        {/* QR Code Container with nice framing */}
        <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-md mb-4 relative">
          <QRCodeSVG
            value={upiIntentUri}
            size={220}
            level="H"
            includeMargin={true}
          />
          <div className="absolute inset-x-0 -bottom-3 flex justify-center">
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              Zero Transaction Fee UPI
            </span>
          </div>
        </div>

        {/* Amount & Instruction */}
        <div className="mt-2 mb-4">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatINR(due.amount)}
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Scan with any UPI app: Google Pay, PhonePe, Paytm, BHIM, Cred
          </p>
        </div>

        {/* UPI Details Box */}
        <div className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 mb-5 border border-slate-200 dark:border-slate-700/60 text-left text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Payee Name:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {society.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Society UPI ID:</span>
            <div className="flex items-center gap-1.5 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
              <span>{society.upi_id}</span>
              <button
                onClick={handleCopyUpiId}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                title="Copy UPI ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Remarks:</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">
              Maint Flat {due.flat?.flat_number} {due.month_year}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-2.5">
          {/* Direct deep-link click for phones */}
          <a
            href={upiIntentUri}
            className="flex-1 inline-flex items-center justify-center font-medium rounded-xl text-sm px-4 py-2.5 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Open in UPI App
          </a>

          {onMarkPaidClick && (
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onMarkPaidClick(due);
              }}
              className="flex-1"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
