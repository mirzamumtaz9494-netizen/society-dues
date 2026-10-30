import { sanitizeWhatsAppPhone, formatINR, formatMonthYear } from './format';
import { generateUpiUrl } from './upi';

export interface WhatsAppReminderParams {
  societyName: string;
  flatNumber: string;
  residentName: string;
  phone: string;
  monthYear: string;
  amount: number;
  dueDate: string;
  upiId: string;
}

export interface WhatsAppReceiptParams {
  societyName: string;
  flatNumber: string;
  residentName: string;
  phone: string;
  monthYear: string;
  amount: number;
  receiptNo: string;
  paymentMode: string;
  upiRefNo?: string | null;
  paidDate?: string;
  receiptUrl?: string;
}

/**
 * Generates an executive, warm, and professional WhatsApp reminder message.
 */
export function buildDuesReminderMessage({
  societyName,
  flatNumber,
  residentName,
  monthYear,
  amount,
  dueDate,
  upiId,
}: Omit<WhatsAppReminderParams, 'phone'>): string {
  const formattedAmount = formatINR(amount);
  const formattedMonth = formatMonthYear(monthYear);
  const upiIntentUri = generateUpiUrl({
    upiId,
    payeeName: societyName,
    amount,
    transactionNote: `Maint Flat ${flatNumber} ${monthYear}`,
  });

  return (
    `*${societyName.toUpperCase()}*\n` +
    `🏢 *Monthly Maintenance Reminder*\n\n` +
    `Dear ${residentName} (Flat ${flatNumber}),\n\n` +
    `This is a gentle reminder that your society maintenance for *${formattedMonth}* of *${formattedAmount}* is due on or before *${dueDate}*.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💳 *Quick UPI Payment:*\n` +
    `• UPI ID: \`${upiId}\`\n` +
    `• Amount: *${formattedAmount}*\n` +
    `• Direct UPI Link: ${upiIntentUri}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Kindly share the transaction screenshot or UPI reference number once paid so we can issue your official receipt.\n\n` +
    `Thank you for your prompt cooperation!\n` +
    `— *Management Committee / Hon. Treasurer*`
  );
}

/**
 * Builds standard WhatsApp direct web URL.
 */
export function createWhatsAppLink(phone: string, message: string): string {
  const sanitizedPhone = sanitizeWhatsAppPhone(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${sanitizedPhone}?text=${encodedMessage}`;
}

/**
 * Generates official payment confirmation and receipt message for WhatsApp.
 */
export function buildReceiptConfirmationMessage({
  societyName,
  flatNumber,
  residentName,
  monthYear,
  amount,
  receiptNo,
  paymentMode,
  upiRefNo,
  paidDate,
  receiptUrl,
}: WhatsAppReceiptParams): string {
  const formattedAmount = formatINR(amount);
  const formattedMonth = formatMonthYear(monthYear);
  const dateStr = paidDate ? new Date(paidDate).toLocaleDateString('en-IN') : 'Today';

  let msg =
    `*${societyName.toUpperCase()}*\n` +
    `✅ *Maintenance Payment Receipt*\n\n` +
    `Dear ${residentName} (Flat ${flatNumber}),\n` +
    `We have successfully received your maintenance payment. Thank you!\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📄 *Receipt No:* ${receiptNo}\n` +
    `🗓️ *For Month:* ${formattedMonth}\n` +
    `💰 *Amount Paid:* ${formattedAmount}\n` +
    `💳 *Payment Mode:* ${paymentMode}\n`;

  if (upiRefNo) {
    msg += `🔖 *Ref/UTR No:* ${upiRefNo}\n`;
  }

  msg +=
    `📅 *Date Received:* ${dateStr}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Your official society maintenance receipt has been digitally generated.\n`;

  if (receiptUrl) {
    msg += `📥 *Download Official Receipt:* ${receiptUrl}\n\n`;
  }

  msg += `Warm regards,\n— *Society Managing Committee*`;

  return msg;
}
