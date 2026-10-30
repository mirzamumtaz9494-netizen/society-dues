'use client';

import React, { useState } from 'react';
import { useSociety } from '@/context/SocietyContext';
import { formatINR, formatDate, formatMonthYear } from '@/lib/format';
import { ExpenseCategory } from '@/lib/types';
import {
  Receipt,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Wallet,
  Calendar,
  Trash2,
  ExternalLink,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AddExpenseModal } from '@/components/expenses/AddExpenseModal';

export default function ExpensesPage() {
  const {
    expenses,
    financialSummary,
    currentMonthYear,
    addExpense,
    deleteExpense,
    userRole,
  } = useSociety();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter((exp) => {
    const titleMatch = exp.title.toLowerCase().includes(searchQuery.toLowerCase());
    const paidToMatch = (exp.paid_to || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesSearch = titleMatch || paidToMatch;
    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    return exp.category === selectedCategory;
  });

  const categories = [
    'all',
    'Salary',
    'Maintenance',
    'Electricity',
    'Water Tanker',
    'Repairs',
    'Cleaning Supplies',
    'Misc',
  ];

  return (
    <div className="space-y-6">
      {/* Header & Log Expense Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Expense & Petty Cash Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track vendor bills, maintenance costs, and utility disbursements for{' '}
            {formatMonthYear(currentMonthYear)}
          </p>
        </div>

        {userRole === 'admin' && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Log New Expense
          </Button>
        )}
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-emerald-200/80 bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Maintenance Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {formatINR(financialSummary.totalCollected)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Collected this billing cycle
          </div>
        </Card>

        <Card className="p-5 border-rose-200/80 bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatINR(financialSummary.totalExpenses)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {expenses.length} outgoing vouchers
          </div>
        </Card>

        <Card
          className={`p-5 ${
            financialSummary.netSurplus >= 0
              ? 'border-indigo-200 bg-indigo-50/20'
              : 'border-rose-200 bg-rose-50/20'
          }`}
        >
          <div className="flex items-center justify-between text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Net Reserve Surplus</span>
            <Wallet className="w-4 h-4 text-indigo-600" />
          </div>
          <div
            className={`text-2xl font-black ${
              financialSummary.netSurplus >= 0
                ? 'text-indigo-700 dark:text-indigo-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatINR(financialSummary.netSurplus)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Surplus saved to Reserve Fund
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by expense title or vendor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all capitalize shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Expenses Logged
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            No expenses found matching the selected filter.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Expense Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Paid To</th>
                  <th className="py-3 px-4">Bill Photo</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  {userRole === 'admin' && <th className="py-3 px-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">
                      {formatDate(exp.expense_date)}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {exp.title}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {exp.paid_to || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      {exp.bill_url ? (
                        <a
                          href={exp.bill_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Bill
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-rose-600 dark:text-rose-400">
                      {formatINR(exp.amount)}
                    </td>

                    {userRole === 'admin' && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-3">
            {filteredExpenses.map((exp) => (
              <Card key={exp.id} className="p-4 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                      {exp.title}
                    </h3>
                  </div>
                  <span className="text-base font-black text-rose-600 dark:text-rose-400">
                    {formatINR(exp.amount)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(exp.expense_date)}
                  </span>
                  <span>{exp.paid_to ? `To: ${exp.paid_to}` : ''}</span>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addExpense}
      />
    </div>
  );
}
