-- ==============================================================================
-- SocietyDues: Supabase PostgreSQL Database Schema
-- Multi-Tenant Society & Apartment Maintenance Tracker
-- ==============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. SOCIETIES TABLE
create table if not exists societies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  upi_id text not null, -- e.g. treasurer@okhdfcbank or society@icici
  default_maintenance numeric not null default 2000,
  treasurer_name text default 'Hon. Treasurer',
  contact_phone text,
  currency text default 'INR',
  total_flats integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. FLATS TABLE
create table if not exists flats (
  id uuid primary key default gen_random_uuid(),
  society_id uuid not null references societies(id) on delete cascade,
  flat_number text not null, -- e.g. "101", "302-A"
  floor_number integer,
  owner_name text not null,
  phone text not null, -- WhatsApp contact number with country code or 10-digit
  is_rented boolean default false,
  tenant_name text,
  tenant_phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint unique_society_flat unique (society_id, flat_number)
);

-- 3. MONTHLY DUES TABLE
create table if not exists dues (
  id uuid primary key default gen_random_uuid(),
  flat_id uuid not null references flats(id) on delete cascade,
  society_id uuid not null references societies(id) on delete cascade,
  month_year text not null, -- Format: YYYY-MM e.g. "2026-11"
  amount numeric not null check (amount >= 0),
  status text not null check (status in ('unpaid', 'paid', 'overdue')) default 'unpaid',
  due_date date not null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint unique_flat_month unique (flat_id, month_year)
);

-- 4. PAYMENTS & RECEIPTS TABLE
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  due_id uuid not null unique references dues(id) on delete cascade,
  receipt_no text unique not null, -- e.g. "REC-202611-302"
  amount_paid numeric not null check (amount_paid >= 0),
  payment_mode text not null default 'UPI' check (payment_mode in ('UPI', 'Cash', 'Cheque', 'Bank Transfer')),
  upi_ref_no text, -- UPI Reference / UTR / Cheque number
  paid_date timestamp with time zone default now(),
  remarks text,
  created_at timestamp with time zone default now()
);

-- 5. SOCIETY EXPENSES TABLE
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  society_id uuid not null references societies(id) on delete cascade,
  title text not null, -- e.g. "Lift Maintenance AMC"
  category text not null check (category in ('Maintenance', 'Salary', 'Electricity', 'Water Tanker', 'Repairs', 'Cleaning Supplies', 'Misc')),
  amount numeric not null check (amount > 0),
  bill_url text, -- Supabase Storage URL / Document link
  paid_to text, -- Vendor / Service provider name
  expense_date date not null default current_date,
  created_at timestamp with time zone default now()
);

-- ==============================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ==============================================================================
create index if not exists idx_flats_society on flats(society_id);
create index if not exists idx_dues_society_month on dues(society_id, month_year);
create index if not exists idx_dues_flat on dues(flat_id);
create index if not exists idx_dues_status on dues(status);
create index if not exists idx_payments_due on payments(due_id);
create index if not exists idx_expenses_society_date on expenses(society_id, expense_date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table societies enable row level security;
alter table flats enable row level security;
alter table dues enable row level security;
alter table payments enable row level security;
alter table expenses enable row level security;

-- Permissive policy for authenticated users & anon demo access
create policy "Allow all actions for authenticated users on societies"
  on societies for all using (true) with check (true);

create policy "Allow all actions for authenticated users on flats"
  on flats for all using (true) with check (true);

create policy "Allow all actions for authenticated users on dues"
  on dues for all using (true) with check (true);

create policy "Allow all actions for authenticated users on payments"
  on payments for all using (true) with check (true);

create policy "Allow all actions for authenticated users on expenses"
  on expenses for all using (true) with check (true);

-- ==============================================================================
-- SEED DATA FOR DEMO & TESTING
-- ==============================================================================
DO $$
DECLARE
  soc_id uuid := 'a1000000-0000-0000-0000-000000000001'::uuid;
  f101 uuid; f102 uuid; f201 uuid; f202 uuid; f301 uuid; f302 uuid;
  due1 uuid; due2 uuid; due3 uuid; due4 uuid;
BEGIN
  -- Insert Demo Society
  insert into societies (id, name, address, upi_id, default_maintenance, treasurer_name, contact_phone, total_flats)
  values (
    soc_id,
    'Shri Krishna Residency RWA',
    'Plot 42, 4th Main, Indiranagar, Bengaluru - 560038',
    'treasurer@okhdfcbank',
    2500,
    'S. K. Sharma (Treasurer)',
    '+919876543210',
    6
  ) on conflict (id) do nothing;

  -- Insert Flats
  insert into flats (society_id, flat_number, floor_number, owner_name, phone, is_rented, tenant_name, tenant_phone)
  values
    (soc_id, '101', 1, 'Ramesh Gupta', '9845012345', false, null, null)
    returning id into f101;

  insert into flats (society_id, flat_number, floor_number, owner_name, phone, is_rented, tenant_name, tenant_phone)
  values
    (soc_id, '102', 1, 'Priya Sundaram', '9845023456', true, 'Amit Verma', '9811122334')
    returning id into f102;

  insert into flats (society_id, flat_number, floor_number, owner_name, phone, is_rented, tenant_name, tenant_phone)
  values
    (soc_id, '201', 2, 'K. V. Narayan', '9845034567', false, null, null)
    returning id into f201;

  insert into flats (society_id, flat_number, floor_number, owner_name, phone, is_rented, tenant_name, tenant_phone)
  values
    (soc_id, '202', 2, 'Deepa Deshmukh', '9845045678', false, null, null)
    returning id into f202;

  insert into flats (society_id, flat_number, floor_number, owner_name, phone, is_rented, tenant_name, tenant_phone)
  values
    (soc_id, '301', 3, 'Sunil Joshi', '9845056789', false, null, null)
    returning id into f301;

  insert into flats (society_id, flat_number, floor_number, owner_name, phone, is_rented, tenant_name, tenant_phone)
  values
    (soc_id, '302', 3, 'Vikram Malhotra', '9845067890', true, 'Rohit Roy', '9988776655')
    returning id into f302;

  -- Insert Dues for Current Month (2026-11)
  insert into dues (flat_id, society_id, month_year, amount, status, due_date)
  values (f101, soc_id, '2026-11', 2500, 'paid', '2026-11-10') returning id into due1;

  insert into dues (flat_id, society_id, month_year, amount, status, due_date)
  values (f102, soc_id, '2026-11', 2500, 'paid', '2026-11-10') returning id into due2;

  insert into dues (flat_id, society_id, month_year, amount, status, due_date)
  values (f201, soc_id, '2026-11', 2500, 'unpaid', '2026-11-10') returning id into due3;

  insert into dues (flat_id, society_id, month_year, amount, status, due_date)
  values (f202, soc_id, '2026-11', 2500, 'overdue', '2026-11-05') returning id into due4;

  insert into dues (flat_id, society_id, month_year, amount, status, due_date)
  values (f301, soc_id, '2026-11', 2500, 'unpaid', '2026-11-10');

  insert into dues (flat_id, society_id, month_year, amount, status, due_date)
  values (f302, soc_id, '2026-11', 2500, 'unpaid', '2026-11-10');

  -- Insert Payments for Paid Dues
  insert into payments (due_id, receipt_no, amount_paid, payment_mode, upi_ref_no, paid_date, remarks)
  values (due1, 'REC-202611-101', 2500, 'UPI', 'UPI/234190823901/HDFC', now() - interval '2 days', 'Google Pay via UPI QR');

  insert into payments (due_id, receipt_no, amount_paid, payment_mode, upi_ref_no, paid_date, remarks)
  values (due2, 'REC-202611-102', 2500, 'Bank Transfer', 'NEFT-AXIS-901824', now() - interval '1 day', 'Direct NEFT by tenant');

  -- Insert Society Expenses
  insert into expenses (society_id, title, category, amount, paid_to, expense_date)
  values
    (soc_id, 'Security Guard Salary - October', 'Salary', 12000, 'Ramu Security Agency', current_date - 12),
    (soc_id, 'Johnson Lifts Quarterly AMC', 'Maintenance', 4500, 'Johnson Lifts Pvt Ltd', current_date - 8),
    (soc_id, 'BESCOM Common Electricity Bill', 'Electricity', 3200, 'BESCOM Bangalore', current_date - 5),
    (soc_id, 'Emergency Cauvery Water Tanker (3 Loads)', 'Water Tanker', 2700, 'Sri Balaji Water Suppliers', current_date - 3),
    (soc_id, 'Common Area Cleaning Supplies & Phenyl', 'Cleaning Supplies', 850, 'Metro Cash & Carry', current_date - 1);

END $$;
