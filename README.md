# SocietyDues (Apartment Maintenance & RWA Tracker)

**SocietyDues** is a modern, mobile-first Web Application built specifically for standalone residential apartments (10 to 50 flats) in India. It empowers Society Treasurers, Secretaries, and Managing Committees to collect monthly maintenance without the WhatsApp chaos.

---

## 🌟 Key Features

1. **Multi-Tenant & Society Profile Setup (`/setup`, `/login`)**
   - Society name, address, default monthly flat maintenance fee (₹), and Treasurer Bank UPI ID (e.g. `treasurer@okhdfcbank`).
   - Role-Based Access: Society Admin (Treasurer) vs. Resident (View-Only).
   - Seamless demo fallback mode with pre-seeded flats, dues, and vouchers.

2. **Flat & Resident Directory (`/dashboard/flats`)**
   - Flat listing: Flat No, Floor, Owner Name, WhatsApp Number, Occupancy (Owner vs. Tenant).
   - 1-by-1 addition form (`AddFlatModal`) + Bulk CSV/Excel batch upload (`CsvUploadModal`) with sample template download.
   - 1-click direct WhatsApp chat link to resident.

3. **Monthly Dues & Billing Engine (`/dashboard/dues`)**
   - Month/Year selector dropdown (defaults to current month).
   - Prominent **"Generate Monthly Dues"** button (auto-generates dues for all flats with 1 click).
   - Status tracking: `Unpaid`, `Paid`, `Overdue`.
   - **Pay with UPI Modal**: Generates dynamic NPCI-compliant UPI QR scannable on Google Pay, PhonePe, Paytm, and BHIM (`upi://pay?pa={upi_id}&pn={society_name}&am={amount}&cu=INR`).
   - **1-Click WhatsApp Reminder**: Opens `wa.me/91{phone}?text={message}` with pre-composed cordial reminder, due amount, month, and direct UPI pay link.
   - **Mark as Paid Action**: Verifies payment mode (UPI / Cash / Cheque / Bank Transfer), records reference number/UTR, and auto-generates official Receipt No (`REC-YYYYMM-FLAT`).

4. **Instant PDF Receipt Generator (`/api/receipt/[id]`)**
   - Branded official PDF receipt built using `@react-pdf/renderer`.
   - Displays Society Header, Receipt Number, Date, Flat No, Resident Name, Billing Period, Amount Paid (₹), Payment Mode, UPI Reference, and digital verification seal.
   - 1-click **"Download PDF"**, **"Print"**, and **"Share on WhatsApp"**.

5. **Society Expense & Petty Cash Tracker (`/dashboard/expenses`)**
   - Log outgoing costs: Watchman Salary, Lift AMC, Borewell repairs, Common electricity, Cleaning supplies.
   - Attach vendor bill photo or document link.
   - Real-time balance cards: Total Income vs Total Expenses vs Net Reserve Balance.

6. **Monthly Financial Statement / Transparency Report (`/dashboard/reports`)**
   - Visual breakdown of Income vs Expenses and collection rate.
   - 1-Click **"Export Monthly RWA Financial Statement (PDF)"** for Society General Body Meetings (AGM/EGM).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🗄️ Supabase Database Schema

The database migration script is located at:
`supabase/migrations/20261030_initial_schema.sql`

To apply this to your live Supabase project:
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Paste the contents of `supabase/migrations/20261030_initial_schema.sql` and run.
3. In your project root, add `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
*(Note: If no Supabase credentials are configured, the app runs in full offline/demo mode with browser persistence).*
