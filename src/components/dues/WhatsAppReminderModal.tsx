'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Due, Society } from '@/lib/types';
import { buildDuesReminderMessage, createWhatsAppLink } from '@/lib/whatsapp';
import { formatDate } from '@/lib/format';
import { MessageSquare, Copy, Check, Send } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  due: Due | null;
  society: Society;
}

export function WhatsAppReminderModal({
  isOpen,
  onClose,
  due,
  society,
}: WhatsAppReminderModalProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!due) return null;

  const residentName =
    due.flat?.is_rented && due.flat.tenant_name
      ? `${due.flat.tenant_name} (Tenant) / ${due.flat.owner_name}`
      : due.flat?.owner_name || 'Resident';

  const phone =
    due.flat?.is_rented && due.flat.tenant_phone
      ? due.flat.tenant_phone
      : due.flat?.phone || '';

  const messageText = buildDuesReminderMessage({
    societyName: society.name,
    flatNumber: due.flat?.flat_number || '',
    residentName,
    monthYear: due.month_year,
    amount: due.amount,
    dueDate: formatDate(due.due_date),
    upiId: society.upi_id,
  });

  const whatsappUrl = createWhatsAppLink(phone, messageText);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    showToast({
      type: 'success',
      title: 'Message Copied',
      message: 'WhatsApp text copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="1-Click WhatsApp Reminder"
      subtitle={`Send reminder to Flat ${due.flat?.flat_number} (${phone})`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Recipient summary badge */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
              Recipient: {residentName}
            </span>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
              WhatsApp: +91 {phone}
            </p>
          </div>
          <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
            Direct Send
          </span>
        </div>

        {/* Message preview block formatted like WhatsApp chat */}
        <div className="bg-[#e5ddd5]/30 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed shadow-inner">
          {messageText}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            variant="outline"
            onClick={handleCopyMessage}
            className="flex-1"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            Copy Text
          </Button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center font-medium rounded-xl text-sm px-4 py-2.5 gap-2 bg-[#25D366] hover:bg-[#1ebc57] text-white shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            Send on WhatsApp
          </a>
        </div>
      </div>
    </Modal>
  );
}
