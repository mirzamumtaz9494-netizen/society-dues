'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Expense, ExpenseCategory } from '@/lib/types';
import { Receipt, Calendar, User, Upload, IndianRupee } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id' | 'society_id'>) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Salary',
  'Maintenance',
  'Electricity',
  'Water Tanker',
  'Repairs',
  'Cleaning Supplies',
  'Misc',
];

export function AddExpenseModal({
  isOpen,
  onClose,
  onAdd,
}: AddExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Maintenance');
  const [amount, setAmount] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [billUrl, setBillUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    onAdd({
      title: title.trim(),
      category,
      amount: parseFloat(amount),
      paid_to: paidTo.trim() || null,
      expense_date: expenseDate,
      bill_url: billUrl,
    });

    setTitle('');
    setAmount('');
    setPaidTo('');
    setBillUrl(null);
    onClose();
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production with Supabase Storage, upload to bucket
      // Here we create object URL for instant preview
      const objectUrl = URL.createObjectURL(file);
      setBillUrl(objectUrl);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Society Outgoing Expense"
      subtitle="Log petty cash, vendor bills, or utility payments"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Expense Title *
          </label>
          <div className="relative">
            <Receipt className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Lift AMC Q3, Watchman Salary, BESCOM"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Amount (₹) *
            </label>
            <div className="relative">
              <span className="font-bold text-slate-400 absolute left-3 top-2 text-sm">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                placeholder="2500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Paid To & Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Paid To (Vendor / Person)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Ramu Security"
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Expense Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                required
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Bill / Voucher Photo Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Bill Photo / Invoice Receipt (Optional)
          </label>
          <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between text-xs">
            <input
              type="file"
              id="bill-upload"
              accept="image/*,.pdf"
              onChange={handleSimulatedFileUpload}
              className="hidden"
            />
            <label
              htmlFor="bill-upload"
              className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              Attach Receipt Photo / PDF
            </label>
            {billUrl ? (
              <span className="text-emerald-600 font-semibold text-[11px]">
                ✓ File Attached
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">No file chosen</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}
