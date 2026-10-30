'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Due, Society } from '@/lib/types';
import { formatINR, formatMonthYear, formatDate } from '@/lib/format';
import { buildReceiptConfirmationMessage, createWhatsAppLink } from '@/lib/whatsapp';
import { Download, Share2, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { pdf } from '@react-pdf/renderer';
import { ReceiptDocument } from './ReceiptDocument';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  due: Due | null;
  society: Society;
}

export function ReceiptModal({
  isOpen,
  onClose,
  due,
  society,
}: ReceiptModalProps) {
  const { showToast } = useToast();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!due || due.status !== 'paid') return null;

  const payment = due.payment;
  const receiptNo = payment?.receipt_no || `REC-${due.month_year.replace('-', '')}-${due.flat?.flat_number || '000'}`;
  const residentName = due.flat?.owner_name || 'Resident';
  const phone = due.flat?.phone || '';

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = <ReceiptDocument society={society} due={due} /> as any;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${receiptNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast({
        type: 'success',
        title: 'Receipt Downloaded',
        message: `${receiptNo}.pdf saved to your device.`,
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback to window print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = buildReceiptConfirmationMessage({
      societyName: society.name,
      flatNumber: due.flat?.flat_number || '',
      residentName,
      phone,
      monthYear: due.month_year,
      amount: due.amount,
      receiptNo,
      paymentMode: payment?.payment_mode || 'UPI',
      upiRefNo: payment?.upi_ref_no,
      paidDate: payment?.paid_date,
    });

    const url = createWhatsAppLink(phone, text);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Maintenance Receipt"
      subtitle={`Receipt #${receiptNo}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Printable Official Receipt Body */}
        <div
          id="receipt-print-section"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm print:border-none print:shadow-none print:p-0"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-indigo-600">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {society.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
                {society.address}
              </p>
              {society.contact_phone && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Helpline: {society.contact_phone}
                </p>
              )}
            </div>
            <div className="text-right sm:self-start">
              <span className="inline-block bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                OFFICIAL RECEIPT
              </span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {receiptNo}
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl my-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold block">
                Date Issued
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(payment?.paid_date || new Date().toISOString())}
              </span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold block">
                Billing Period
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatMonthYear(due.month_year)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold block">
                Status
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                PAID
              </span>
            </div>
          </div>

          {/* Resident Details */}
          <div className="bg-slate-50/60 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-500">Flat / Unit Number:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                Flat No. {due.flat?.flat_number} (Floor {due.flat?.floor_number || 1})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Resident / Owner:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {due.flat?.owner_name}
              </span>
            </div>
            {due.flat?.is_rented && due.flat.tenant_name && (
              <div className="flex justify-between">
                <span className="text-slate-500">Tenant Name:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {due.flat.tenant_name}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Contact WhatsApp:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                +91 {due.flat?.phone}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-4 text-xs">
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Monthly Maintenance Charges
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Security, Lift AMC, Water & Common Electricity
                </p>
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {formatINR(due.amount)}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 flex justify-between items-center">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Total Paid
              </span>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {formatINR(due.amount)}
              </span>
            </div>
          </div>

          {/* Payment Mode Note */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3 text-xs mb-4">
            <div className="flex justify-between text-emerald-800 dark:text-emerald-300">
              <span className="font-semibold">Payment Mode: {payment?.payment_mode || 'UPI'}</span>
              <span>UPI: {society.upi_id}</span>
            </div>
            {payment?.upi_ref_no && (
              <p className="text-emerald-700 dark:text-emerald-400 mt-1 font-mono text-[11px]">
                Ref / UTR: {payment.upi_ref_no}
              </p>
            )}
          </div>

          {/* Seal & Sign Footer */}
          <div className="flex justify-between items-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="border-2 border-indigo-600 rounded-xl p-2.5 text-center text-[10px] w-36">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Digitally Verified
              </div>
              <div className="text-slate-500 text-[9px] mt-0.5">
                {society.name}
              </div>
            </div>

            <div className="text-center w-40">
              <div className="w-full border-b border-slate-400 mb-1" />
              <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                {society.treasurer_name || 'Hon. Treasurer'}
              </p>
              <p className="text-[10px] text-slate-500">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>

          <Button
            variant="outline"
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-initial text-emerald-600 hover:text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          >
            <Share2 className="w-4 h-4" />
            Send on WhatsApp
          </Button>

          <Button
            variant="primary"
            onClick={handleDownloadPdf}
            isLoading={isGeneratingPdf}
            className="flex-1 sm:flex-initial"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}
