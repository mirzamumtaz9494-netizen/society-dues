/**
 * Format numbers as Indian Rupee (INR) currency.
 * e.g. 2500 -> ₹2,500, 150000 -> ₹1,50,000
 */
export function formatINR(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }
  const numeric = Math.round(Number(amount));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric);
}

/**
 * Format month-year string ("YYYY-MM") into readable human format.
 * e.g. "2026-11" -> "November 2026"
 */
export function formatMonthYear(monthYearStr: string): string {
  if (!monthYearStr) return '';
  const [year, month] = monthYearStr.split('-');
  if (!year || !month) return monthYearStr;
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

/**
 * Format an ISO date or "YYYY-MM-DD" into a standard Indian format.
 * e.g. "2026-11-10" -> "10 Nov 2026"
 */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Sanitize and clean an Indian phone number for WhatsApp wa.me links.
 * Accepts "9845012345", "+91 98450 12345", "09845012345", etc.
 * Returns clean digits starting with "91" (e.g. "919845012345").
 */
export function sanitizeWhatsAppPhone(phone: string): string {
  if (!phone) return '';
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return `91${digitsOnly.substring(1)}`;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly;
  }
  return digitsOnly;
}

/**
 * Generate unique receipt number: REC-YYYYMM-FLAT
 */
export function generateReceiptNumber(monthYear: string, flatNumber: string): string {
  const cleanMonthYear = monthYear.replace('-', '');
  const cleanFlat = flatNumber.replace(/[^a-zA-Z0-9]/g, '');
  return `REC-${cleanMonthYear}-${cleanFlat}`;
}
