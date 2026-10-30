import { Society, Flat, Due, Payment, Expense, FinancialSummary } from './types';
import { generateReceiptNumber } from './format';

export const INITIAL_SOCIETY: Society = {
  id: 'soc-krishna-residency-01',
  name: 'Shri Krishna Residency RWA',
  address: 'Plot 42, 4th Main, Indiranagar, Bengaluru - 560038',
  upi_id: 'treasurer@okhdfcbank',
  default_maintenance: 2500,
  treasurer_name: 'S. K. Sharma (Hon. Treasurer)',
  contact_phone: '+91 98450 12345',
  currency: 'INR',
  total_flats: 8,
};

export const INITIAL_FLATS: Flat[] = [
  {
    id: 'flat-101',
    society_id: 'soc-krishna-residency-01',
    flat_number: '101',
    floor_number: 1,
    owner_name: 'Ramesh Gupta',
    phone: '9845012345',
    is_rented: false,
    tenant_name: null,
    tenant_phone: null,
  },
  {
    id: 'flat-102',
    society_id: 'soc-krishna-residency-01',
    flat_number: '102',
    floor_number: 1,
    owner_name: 'Priya Sundaram',
    phone: '9845023456',
    is_rented: true,
    tenant_name: 'Amit Verma',
    tenant_phone: '9811122334',
  },
  {
    id: 'flat-201',
    society_id: 'soc-krishna-residency-01',
    flat_number: '201',
    floor_number: 2,
    owner_name: 'K. V. Narayan',
    phone: '9845034567',
    is_rented: false,
    tenant_name: null,
    tenant_phone: null,
  },
  {
    id: 'flat-202',
    society_id: 'soc-krishna-residency-01',
    flat_number: '202',
    floor_number: 2,
    owner_name: 'Deepa Deshmukh',
    phone: '9845045678',
    is_rented: false,
    tenant_name: null,
    tenant_phone: null,
  },
  {
    id: 'flat-301',
    society_id: 'soc-krishna-residency-01',
    flat_number: '301',
    floor_number: 3,
    owner_name: 'Sunil Joshi',
    phone: '9845056789',
    is_rented: false,
    tenant_name: null,
    tenant_phone: null,
  },
  {
    id: 'flat-302',
    society_id: 'soc-krishna-residency-01',
    flat_number: '302',
    floor_number: 3,
    owner_name: 'Vikram Malhotra',
    phone: '9845067890',
    is_rented: true,
    tenant_name: 'Rohit Roy',
    tenant_phone: '9988776655',
  },
  {
    id: 'flat-401',
    society_id: 'soc-krishna-residency-01',
    flat_number: '401',
    floor_number: 4,
    owner_name: 'Ananya Roy',
    phone: '9845078901',
    is_rented: false,
    tenant_name: null,
    tenant_phone: null,
  },
  {
    id: 'flat-402',
    society_id: 'soc-krishna-residency-01',
    flat_number: '402',
    floor_number: 4,
    owner_name: 'Col. Rajesh Bakshi',
    phone: '9845089012',
    is_rented: false,
    tenant_name: null,
    tenant_phone: null,
  },
];

export const INITIAL_DUES: Due[] = [
  {
    id: 'due-101-2026-11',
    flat_id: 'flat-101',
    society_id: 'soc-krishna-residency-01',
    month_year: '2026-11',
    amount: 2500,
    status: 'paid',
    due_date: '2026-11-10',
    payment: {
      id: 'pay-101-2026-11',
      due_id: 'due-101-2026-11',
      receipt_no: 'REC-202611-101',
      amount_paid: 2500,
      payment_mode: 'UPI',
      upi_ref_no: 'UPI/234190823901/HDFC',
      paid_date: '2026-10-28T14:30:00.000Z',
      remarks: 'Google Pay via QR code',
    },
  },
  {
    id: 'due-102-2026-11',
    flat_id: 'flat-102',
    society_id: 'soc-krishna-residency-01',
    month_year: '2026-11',
    amount: 2500,
    status: 'paid',
    due_date: '2026-11-10',
    payment: {
      id: 'pay-102-2026-11',
      due_id: 'due-102-2026-11',
      receipt_no: 'REC-202611-102',
      amount_paid: 2500,
      payment_mode: 'Bank Transfer',
      upi_ref_no: 'NEFT-AXIS-901824',
      paid_date: '2026-10-29T10:15:00.000Z',
      remarks: 'NEFT by tenant Amit Verma',
    },
  },
  {
    id: 'due-201-2026-11',
    flat_id: 'flat-201',
    society_id: 'soc-krishna-residency-01',
    month_year: '2026-11',
    amount: 2500,
    status: 'unpaid',
    due_date: '2026-11-10',
    payment: null,
  },
  {
    id: 'due-202-2026-11',
    flat_id: 'flat-202',
    society_id: 'soc-krishna-residency-01',
    month_year: '2026-11',
    amount: 2500,
    status: 'overdue',
    due_date: '2026-11-05',
    payment: null,
  },
  {
    id: 'due-301-2026-11',
    flat_id: 'flat-301',
    society_id: 'soc-krishna-residency-01',
    month_year: '2026-11',
    amount: 2500,
    status: 'unpaid',
    due_date: '2026-11-10',
    payment: null,
  },
  {
    id: 'due-302-2026-11',
    flat_id: 'flat-302',
    society_id: 'soc-krishna-residency-01',
    month_year: '2026-11',
    amount: 2500,
    status: 'unpaid',
    due_date: '2026-11-10',
    payment: null,
  },
  {
    id: 'due-401-2026-11',
    flat_id: 'flat-401',
    society_id: 'soc-krishna-residency-01',
    month_year: '2026-11',
    amount: 2500,
    status: 'paid',
    due_date: '2026-11-10',
    payment: {
      id: 'pay-401-2026-11',
      due_id: 'due-401-2026-11',
      receipt_no: 'REC-202611-401',
      amount_paid: 2500,
      payment_mode: 'UPI',
      upi_ref_no: 'UPI/98127391823/ICICI',
      paid_date: '2026-10-30T09:00:00.000Z',
      remarks: 'PhonePe payment',
    },
  },
  {
    id: 'due-402-2026-11',
    flat_id: 'flat-402',
    society_id: 'soc-krishna-residency-01',
    month_year: '2026-11',
    amount: 2500,
    status: 'overdue',
    due_date: '2026-11-05',
    payment: null,
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-01',
    society_id: 'soc-krishna-residency-01',
    title: 'Security Guard Salary (2 Guards)',
    category: 'Salary',
    amount: 14000,
    paid_to: 'Ramu Security Agency',
    expense_date: '2026-10-25',
    bill_url: null,
  },
  {
    id: 'exp-02',
    society_id: 'soc-krishna-residency-01',
    title: 'Johnson Lifts Quarterly AMC & Inspection',
    category: 'Maintenance',
    amount: 4500,
    paid_to: 'Johnson Lifts Pvt Ltd',
    expense_date: '2026-10-22',
    bill_url: null,
  },
  {
    id: 'exp-03',
    society_id: 'soc-krishna-residency-01',
    title: 'BESCOM Common Area Electricity Bill',
    category: 'Electricity',
    amount: 3200,
    paid_to: 'BESCOM Bangalore',
    expense_date: '2026-10-26',
    bill_url: null,
  },
  {
    id: 'exp-04',
    society_id: 'soc-krishna-residency-01',
    title: 'Emergency Cauvery Water Tanker (3 Loads)',
    category: 'Water Tanker',
    amount: 2700,
    paid_to: 'Sri Balaji Water Suppliers',
    expense_date: '2026-10-28',
    bill_url: null,
  },
  {
    id: 'exp-05',
    society_id: 'soc-krishna-residency-01',
    title: 'Common Area Cleaning Supplies, Phenyl, Brooms',
    category: 'Cleaning Supplies',
    amount: 850,
    paid_to: 'Metro Cash & Carry',
    expense_date: '2026-10-29',
    bill_url: null,
  },
];

const STORAGE_KEYS = {
  SOCIETY: 'society_dues_society_v1',
  FLATS: 'society_dues_flats_v1',
  DUES: 'society_dues_dues_v1',
  EXPENSES: 'society_dues_expenses_v1',
};

export class SocietyStore {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  static getSociety(): Society {
    if (!this.isBrowser()) return INITIAL_SOCIETY;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOCIETY);
      return saved ? JSON.parse(saved) : INITIAL_SOCIETY;
    } catch {
      return INITIAL_SOCIETY;
    }
  }

  static saveSociety(society: Society): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.SOCIETY, JSON.stringify(society));
  }

  static getFlats(): Flat[] {
    if (!this.isBrowser()) return INITIAL_FLATS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLATS);
      return saved ? JSON.parse(saved) : INITIAL_FLATS;
    } catch {
      return INITIAL_FLATS;
    }
  }

  static saveFlats(flats: Flat[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.FLATS, JSON.stringify(flats));
  }

  static addFlat(flat: Omit<Flat, 'id' | 'society_id'>): Flat {
    const flats = this.getFlats();
    const society = this.getSociety();
    const newFlat: Flat = {
      ...flat,
      id: `flat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      society_id: society.id,
      created_at: new Date().toISOString(),
    };
    const updated = [...flats, newFlat];
    this.saveFlats(updated);
    return newFlat;
  }

  static bulkAddFlats(newFlats: Array<Omit<Flat, 'id' | 'society_id'>>): Flat[] {
    const flats = this.getFlats();
    const society = this.getSociety();
    const createdList: Flat[] = newFlats.map((f, idx) => ({
      ...f,
      id: `flat-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      society_id: society.id,
      created_at: new Date().toISOString(),
    }));
    const updated = [...flats, ...createdList];
    this.saveFlats(updated);
    return createdList;
  }

  static deleteFlat(id: string): void {
    const flats = this.getFlats().filter((f) => f.id !== id);
    this.saveFlats(flats);
  }

  static getDues(monthYear?: string): Due[] {
    let dues: Due[] = [];
    if (!this.isBrowser()) {
      dues = INITIAL_DUES;
    } else {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.DUES);
        dues = saved ? JSON.parse(saved) : INITIAL_DUES;
      } catch {
        dues = INITIAL_DUES;
      }
    }

    const flats = this.getFlats();
    const flatsMap = new Map(flats.map((f) => [f.id, f]));

    // Hydrate flat info on dues
    dues = dues.map((due) => ({
      ...due,
      flat: flatsMap.get(due.flat_id) || due.flat,
    }));

    if (monthYear) {
      return dues.filter((d) => d.month_year === monthYear);
    }
    return dues;
  }

  static saveDues(dues: Due[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.DUES, JSON.stringify(dues));
  }

  static generateDuesForMonth(monthYear: string, dueDate: string, amountOverride?: number): { created: number; existing: number } {
    const flats = this.getFlats();
    const society = this.getSociety();
    const allDues = this.getDues();
    const existingForMonth = new Set(
      allDues.filter((d) => d.month_year === monthYear).map((d) => d.flat_id)
    );

    let createdCount = 0;
    const newDues: Due[] = [];

    for (const flat of flats) {
      if (existingForMonth.has(flat.id)) continue;

      const newDue: Due = {
        id: `due-${flat.id}-${monthYear}`,
        flat_id: flat.id,
        society_id: society.id,
        month_year: monthYear,
        amount: amountOverride || society.default_maintenance,
        status: 'unpaid',
        due_date: dueDate,
        payment: null,
        created_at: new Date().toISOString(),
        flat,
      };
      newDues.push(newDue);
      createdCount++;
    }

    if (newDues.length > 0) {
      this.saveDues([...allDues, ...newDues]);
    }

    return { created: createdCount, existing: flats.length - createdCount };
  }

  static markDueAsPaid({
    dueId,
    paymentMode,
    upiRefNo,
    remarks,
  }: {
    dueId: string;
    paymentMode: 'UPI' | 'Cash' | 'Cheque' | 'Bank Transfer';
    upiRefNo?: string;
    remarks?: string;
  }): Payment {
    const dues = this.getDues();
    const dueIndex = dues.findIndex((d) => d.id === dueId);
    if (dueIndex === -1) {
      throw new Error('Due record not found');
    }

    const due = dues[dueIndex];
    const flatNumber = due.flat?.flat_number || 'UNKNOWN';
    const receiptNo = generateReceiptNumber(due.month_year, flatNumber);

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      due_id: due.id,
      receipt_no: receiptNo,
      amount_paid: due.amount,
      payment_mode: paymentMode,
      upi_ref_no: upiRefNo || null,
      paid_date: new Date().toISOString(),
      remarks: remarks || null,
    };

    dues[dueIndex] = {
      ...due,
      status: 'paid',
      payment,
    };

    this.saveDues(dues);
    return payment;
  }

  static getExpenses(): Expense[] {
    if (!this.isBrowser()) return INITIAL_EXPENSES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  }

  static saveExpenses(expenses: Expense[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  static addExpense(expense: Omit<Expense, 'id' | 'society_id'>): Expense {
    const expenses = this.getExpenses();
    const society = this.getSociety();
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      society_id: society.id,
      created_at: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses];
    this.saveExpenses(updated);
    return newExpense;
  }

  static deleteExpense(id: string): void {
    const expenses = this.getExpenses().filter((e) => e.id !== id);
    this.saveExpenses(expenses);
  }

  static getFinancialSummary(monthYear: string): FinancialSummary {
    const dues = this.getDues(monthYear);
    const expenses = this.getExpenses().filter((e) => e.expense_date.startsWith(monthYear));

    let totalDuesExpected = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    let overdueCount = 0;

    for (const due of dues) {
      totalDuesExpected += Number(due.amount || 0);
      if (due.status === 'paid') {
        totalCollected += Number(due.payment?.amount_paid || due.amount);
        paidCount++;
      } else if (due.status === 'overdue') {
        totalPending += Number(due.amount);
        overdueCount++;
      } else {
        totalPending += Number(due.amount);
        unpaidCount++;
      }
    }

    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const netSurplus = totalCollected - totalExpenses;
    const collectionRate =
      totalDuesExpected > 0 ? Math.round((totalCollected / totalDuesExpected) * 100) : 0;

    return {
      monthYear,
      totalDuesExpected,
      totalCollected,
      totalPending,
      totalExpenses,
      netSurplus,
      collectionRate,
      paidCount,
      unpaidCount,
      overdueCount,
    };
  }

  static resetToDemo(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.SOCIETY, JSON.stringify(INITIAL_SOCIETY));
    localStorage.setItem(STORAGE_KEYS.FLATS, JSON.stringify(INITIAL_FLATS));
    localStorage.setItem(STORAGE_KEYS.DUES, JSON.stringify(INITIAL_DUES));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
  }
}
