export type PaymentMode = 'UPI' | 'Cash' | 'Cheque' | 'Bank Transfer';

export type DueStatus = 'unpaid' | 'paid' | 'overdue';

export type ExpenseCategory =
  | 'Maintenance'
  | 'Salary'
  | 'Electricity'
  | 'Water Tanker'
  | 'Repairs'
  | 'Cleaning Supplies'
  | 'Misc';

export interface Society {
  id: string;
  name: string;
  address: string;
  upi_id: string; // e.g. treasurer@okhdfcbank
  default_maintenance: number;
  treasurer_name?: string;
  contact_phone?: string;
  currency?: string;
  total_flats?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Flat {
  id: string;
  society_id: string;
  flat_number: string; // e.g. "101", "202"
  floor_number?: number;
  owner_name: string;
  phone: string; // WhatsApp number
  is_rented: boolean;
  tenant_name?: string | null;
  tenant_phone?: string | null;
  created_at?: string;
}

export interface Due {
  id: string;
  flat_id: string;
  society_id: string;
  month_year: string; // Format: "YYYY-MM" e.g. "2026-11"
  amount: number;
  status: DueStatus;
  due_date: string; // ISO date string "YYYY-MM-DD"
  notes?: string | null;
  created_at?: string;
  flat?: Flat;
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  due_id: string;
  receipt_no: string; // e.g. "REC-202611-302"
  amount_paid: number;
  payment_mode: PaymentMode;
  upi_ref_no?: string | null;
  paid_date: string;
  remarks?: string | null;
  created_at?: string;
}

export interface Expense {
  id: string;
  society_id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  bill_url?: string | null;
  paid_to?: string | null;
  expense_date: string; // "YYYY-MM-DD"
  created_at?: string;
}

export interface FinancialSummary {
  monthYear: string;
  totalDuesExpected: number;
  totalCollected: number;
  totalPending: number;
  totalExpenses: number;
  netSurplus: number;
  collectionRate: number; // percentage
  paidCount: number;
  unpaidCount: number;
  overdueCount: number;
}
