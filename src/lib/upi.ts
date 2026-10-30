export interface GenerateUpiParams {
  upiId: string;
  payeeName: string;
  amount: number;
  transactionNote?: string;
  transactionRef?: string;
}

/**
 * Generate standard National Payments Corporation of India (NPCI) UPI Intent URI.
 * Works seamlessly with Google Pay, PhonePe, Paytm, BHIM, Cred, and mobile camera QR scanners.
 * Format: upi://pay?pa=treasurer@upi&pn=SocietyName&am=2500&cu=INR&tn=Maint_Flat101_Nov2026
 */
export function generateUpiUrl({
  upiId,
  payeeName,
  amount,
  transactionNote,
  transactionRef,
}: GenerateUpiParams): string {
  const cleanUpiId = (upiId || '').trim();
  const cleanName = (payeeName || 'Society Maintenance').trim();
  const cleanAmount = Number(amount || 0).toFixed(2);

  const params = new URLSearchParams({
    pa: cleanUpiId,
    pn: cleanName,
    am: cleanAmount,
    cu: 'INR',
  });

  if (transactionNote) {
    params.set('tn', transactionNote.trim());
  }

  if (transactionRef) {
    params.set('tr', transactionRef.trim());
  }

  return `upi://pay?${params.toString()}`;
}

/**
 * Validates whether a given string resembles a valid VPA / UPI ID.
 * Standard format: string@bank (e.g. treasurer@okhdfcbank, rwa@icici)
 */
export function isValidUpiId(upiId: string): boolean {
  if (!upiId) return false;
  const upiRegex = /^[\w.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(upiId.trim());
}
