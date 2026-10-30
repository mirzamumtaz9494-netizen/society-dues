'use client';

import React, { useState } from 'react';
import { useSociety } from '@/context/SocietyContext';
import { formatINR, formatMonthYear } from '@/lib/format';
import {
  FileSpreadsheet,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { pdf } from '@react-pdf/renderer';
import { FinancialStatementPDF } from '@/components/reports/FinancialStatementPDF';
import { useToast } from '@/context/ToastContext';

export default function ReportsPage() {
  const {
    society,
    dues,
    expenses,
    currentMonthYear,
    financialSummary,
  } = useSociety();

  const { showToast } = useToast();
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  for (const exp of expenses) {
    expensesByCategory[exp.category] =
      (expensesByCategory[exp.category] || 0) + Number(exp.amount || 0);
  }

  const categoryEntries = Object.entries(expensesByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const doc = (
        <FinancialStatementPDF
          society={society}
          monthYear={currentMonthYear}
          dues={dues}
          expenses={expenses}
          summary={financialSummary}
        />
      ) as any;
      const blob = await pdf(doc).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RWA_Financial_Statement_${currentMonthYear}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast({
        type: 'success',
        title: 'Balance Sheet PDF Exported',
        message: `Saved RWA_Financial_Statement_${currentMonthYear}.pdf to your device.`,
      });
    } catch (err) {
      console.error('Error generating balance sheet PDF:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Monthly Transparency Balance Sheet
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            General Body Meeting statement for {formatMonthYear(currentMonthYear)}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Print
          </Button>

          <Button
            variant="primary"
            onClick={handleExportPdf}
            isLoading={isExportingPdf}
            className="flex-1 sm:flex-initial shadow-md shadow-indigo-600/20"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Monthly Balance Sheet (PDF)
          </Button>
        </div>
      </div>

      {/* 3 Large KPI Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-emerald-200 bg-emerald-50/30">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Total Maintenance Collected
          </span>
          <div className="text-3xl font-black text-emerald-700 mt-2">
            {formatINR(financialSummary.totalCollected)}
          </div>
          <p className="text-xs text-emerald-800/80 mt-1">
            {financialSummary.paidCount} of {dues.length} flats cleared ({financialSummary.collectionRate}%)
          </p>
        </Card>

        <Card className="p-5 border-rose-200 bg-rose-50/30">
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
            Total Disbursed Expenses
          </span>
          <div className="text-3xl font-black text-rose-700 mt-2">
            {formatINR(financialSummary.totalExpenses)}
          </div>
          <p className="text-xs text-rose-800/80 mt-1">
            {expenses.length} vendor & utility payments
          </p>
        </Card>

        <Card
          className={`p-5 ${
            financialSummary.netSurplus >= 0
              ? 'border-indigo-200 bg-indigo-50/30'
              : 'border-rose-200 bg-rose-50/30'
          }`}
        >
          <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">
            Net Monthly Surplus / Balance
          </span>
          <div
            className={`text-3xl font-black mt-2 ${
              financialSummary.netSurplus >= 0 ? 'text-indigo-700' : 'text-rose-700'
            }`}
          >
            {formatINR(financialSummary.netSurplus)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Added to Society Reserve & Sinking Fund
          </p>
        </Card>
      </div>

      {/* Visual Comparison: Income vs Expenses Bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Income vs Outflow Visual Ratio
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Financial health ratio for {formatMonthYear(currentMonthYear)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-6 w-full bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
            <div
              style={{
                width: `${
                  financialSummary.totalCollected + financialSummary.totalExpenses > 0
                    ? (financialSummary.totalCollected /
                        (financialSummary.totalCollected + financialSummary.totalExpenses)) *
                      100
                    : 50
                }%`,
              }}
              className="bg-emerald-500 flex items-center justify-center text-[11px] font-bold text-white px-2"
            >
              Income {formatINR(financialSummary.totalCollected)}
            </div>
            <div
              style={{
                width: `${
                  financialSummary.totalCollected + financialSummary.totalExpenses > 0
                    ? (financialSummary.totalExpenses /
                        (financialSummary.totalCollected + financialSummary.totalExpenses)) *
                      100
                    : 50
                }%`,
              }}
              className="bg-rose-500 flex items-center justify-center text-[11px] font-bold text-white px-2"
            >
              Expense {formatINR(financialSummary.totalExpenses)}
            </div>
          </div>

          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Collections: {formatINR(financialSummary.totalCollected)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              Disbursements: {formatINR(financialSummary.totalExpenses)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outgoing Expense Categories */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Outgoing Cost Distribution by Category
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryEntries.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No expenses logged this month.
              </p>
            ) : (
              categoryEntries.map(([cat, amt]) => {
                const percentage =
                  financialSummary.totalExpenses > 0
                    ? Math.round((amt / financialSummary.totalExpenses) * 100)
                    : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {cat}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatINR(amt)} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Collection Status Summary */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Flat Maintenance Collection Health
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-900">
                  Paid Flats ({financialSummary.paidCount})
                </span>
              </div>
              <span className="font-extrabold text-emerald-700">
                {formatINR(financialSummary.totalCollected)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span className="font-semibold text-rose-900">
                  Pending / Overdue Flats ({financialSummary.unpaidCount + financialSummary.overdueCount})
                </span>
              </div>
              <span className="font-extrabold text-rose-700">
                {formatINR(financialSummary.totalPending)}
              </span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Overall Collection Rate</span>
                <span>{financialSummary.collectionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${financialSummary.collectionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
