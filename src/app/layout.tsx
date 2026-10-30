import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { SocietyProvider } from '@/context/SocietyContext';

export const metadata: Metadata = {
  title: 'SocietyDues - Society & Apartment Maintenance Tracker',
  description:
    'Simple, modern maintenance tracker with 1-click WhatsApp reminders, instant UPI QR payments, and digital PDF receipts for standalone residential apartments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <ToastProvider>
          <SocietyProvider>{children}</SocietyProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
