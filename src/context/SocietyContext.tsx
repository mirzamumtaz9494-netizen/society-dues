'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Society, Flat, Due, Expense, FinancialSummary, Payment } from '@/lib/types';
import { SocietyStore } from '@/lib/store';
import { useToast } from './ToastContext';

interface SocietyContextType {
  society: Society;
  flats: Flat[];
  dues: Due[];
  expenses: Expense[];
  currentMonthYear: string;
  setCurrentMonthYear: (month: string) => void;
  userRole: 'admin' | 'resident';
  setUserRole: (role: 'admin' | 'resident') => void;
  isLoading: boolean;
  financialSummary: FinancialSummary;
  refreshData: () => void;
  updateSociety: (updates: Partial<Society>) => void;
  addFlat: (flat: Omit<Flat, 'id' | 'society_id'>) => Flat;
  bulkAddFlats: (flats: Array<Omit<Flat, 'id' | 'society_id'>>) => Flat[];
  deleteFlat: (id: string) => void;
  generateDues: (dueDate: string, amountOverride?: number) => { created: number; existing: number };
  markAsPaid: (params: {
    dueId: string;
    paymentMode: 'UPI' | 'Cash' | 'Cheque' | 'Bank Transfer';
    upiRefNo?: string;
    remarks?: string;
  }) => Payment;
  addExpense: (expense: Omit<Expense, 'id' | 'society_id'>) => Expense;
  deleteExpense: (id: string) => void;
  resetDemoData: () => void;
}

const SocietyContext = createContext<SocietyContextType | undefined>(undefined);

export function SocietyProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [society, setSociety] = useState<Society>(SocietyStore.getSociety());
  const [flats, setFlats] = useState<Flat[]>([]);
  const [dues, setDues] = useState<Due[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentMonthYear, setCurrentMonthYear] = useState<string>('2026-11');
  const [userRole, setUserRole] = useState<'admin' | 'resident'>('admin');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(() => {
    try {
      const soc = SocietyStore.getSociety();
      const flt = SocietyStore.getFlats();
      const ds = SocietyStore.getDues(currentMonthYear);
      const exps = SocietyStore.getExpenses();

      setSociety(soc);
      setFlats(flt);
      setDues(ds);
      setExpenses(exps);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonthYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  const updateSociety = (updates: Partial<Society>) => {
    const updated = { ...society, ...updates };
    SocietyStore.saveSociety(updated);
    setSociety(updated);
    showToast({
      type: 'success',
      title: 'Society Profile Updated',
      message: 'Your society settings and UPI details have been saved.',
    });
  };

  const addFlat = (flat: Omit<Flat, 'id' | 'society_id'>) => {
    const created = SocietyStore.addFlat(flat);
    refreshData();
    showToast({
      type: 'success',
      title: 'Flat Added',
      message: `Flat ${created.flat_number} (${created.owner_name}) successfully registered.`,
    });
    return created;
  };

  const bulkAddFlats = (newFlats: Array<Omit<Flat, 'id' | 'society_id'>>) => {
    const created = SocietyStore.bulkAddFlats(newFlats);
    refreshData();
    showToast({
      type: 'success',
      title: 'Bulk Import Completed',
      message: `${created.length} flats imported successfully.`,
    });
    return created;
  };

  const deleteFlat = (id: string) => {
    SocietyStore.deleteFlat(id);
    refreshData();
    showToast({
      type: 'info',
      title: 'Flat Removed',
      message: 'The flat has been removed from the directory.',
    });
  };

  const generateDues = (dueDate: string, amountOverride?: number) => {
    const result = SocietyStore.generateDuesForMonth(currentMonthYear, dueDate, amountOverride);
    refreshData();
    if (result.created > 0) {
      showToast({
        type: 'success',
        title: 'Monthly Dues Generated',
        message: `Created dues for ${result.created} flats for ${currentMonthYear}.`,
      });
    } else {
      showToast({
        type: 'info',
        title: 'All Dues Already Generated',
        message: `All ${result.existing} flats already have dues billed for ${currentMonthYear}.`,
      });
    }
    return result;
  };

  const markAsPaid = (params: {
    dueId: string;
    paymentMode: 'UPI' | 'Cash' | 'Cheque' | 'Bank Transfer';
    upiRefNo?: string;
    remarks?: string;
  }) => {
    const payment = SocietyStore.markDueAsPaid(params);
    refreshData();
    showToast({
      type: 'success',
      title: 'Payment Recorded!',
      message: `Receipt #${payment.receipt_no} generated for ₹${payment.amount_paid}.`,
    });
    return payment;
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'society_id'>) => {
    const created = SocietyStore.addExpense(expense);
    refreshData();
    showToast({
      type: 'success',
      title: 'Expense Logged',
      message: `₹${created.amount} recorded under ${created.category}.`,
    });
    return created;
  };

  const deleteExpense = (id: string) => {
    SocietyStore.deleteExpense(id);
    refreshData();
    showToast({
      type: 'info',
      title: 'Expense Deleted',
      message: 'The expense item has been removed.',
    });
  };

  const resetDemoData = () => {
    SocietyStore.resetToDemo();
    refreshData();
    showToast({
      type: 'info',
      title: 'Demo Data Restored',
      message: 'Reset flats, dues, and sample expenses to defaults.',
    });
  };

  const financialSummary = SocietyStore.getFinancialSummary(currentMonthYear);

  return (
    <SocietyContext.Provider
      value={{
        society,
        flats,
        dues,
        expenses,
        currentMonthYear,
        setCurrentMonthYear,
        userRole,
        setUserRole,
        isLoading,
        financialSummary,
        refreshData,
        updateSociety,
        addFlat,
        bulkAddFlats,
        deleteFlat,
        generateDues,
        markAsPaid,
        addExpense,
        deleteExpense,
        resetDemoData,
      }}
    >
      {children}
    </SocietyContext.Provider>
  );
}

export function useSociety() {
  const context = useContext(SocietyContext);
  if (!context) {
    throw new Error('useSociety must be used within SocietyProvider');
  }
  return context;
}
