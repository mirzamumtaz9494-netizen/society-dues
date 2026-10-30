'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  Settings,
  QrCode,
} from 'lucide-react';
import { useSociety } from '@/context/SocietyContext';

export function Sidebar() {
  const pathname = usePathname();
  const { society } = useSociety();

  const links = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Monthly Dues & UPI',
      href: '/dashboard/dues',
      icon: CreditCard,
    },
    {
      name: 'Flats & Residents',
      href: '/dashboard/flats',
      icon: Users,
    },
    {
      name: 'Expenses & Petty Cash',
      href: '/dashboard/expenses',
      icon: Receipt,
    },
    {
      name: 'Transparency Report',
      href: '/dashboard/reports',
      icon: FileSpreadsheet,
    },
    {
      name: 'Society Profile & UPI',
      href: '/setup',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4rem)] hidden md:flex">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                  }`}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* UPI Quick Badge Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-sm border border-indigo-800/40">
        <div className="flex items-center gap-2 mb-1.5">
          <QrCode className="w-4 h-4 text-indigo-300" />
          <span className="text-xs font-semibold text-indigo-200">RWA UPI Account</span>
        </div>
        <p className="text-xs font-mono text-slate-300 truncate" title={society.upi_id}>
          {society.upi_id}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Default: ₹{society.default_maintenance}/month
        </p>
      </div>
    </aside>
  );
}
