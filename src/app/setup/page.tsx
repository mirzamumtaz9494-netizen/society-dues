'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSociety } from '@/context/SocietyContext';
import { isValidUpiId } from '@/lib/upi';
import {
  Building2,
  QrCode,
  MapPin,
  IndianRupee,
  Phone,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export default function SetupPage() {
  const router = useRouter();
  const { society, updateSociety, userRole, setUserRole } = useSociety();

  const [name, setName] = useState(society.name);
  const [address, setAddress] = useState(society.address);
  const [upiId, setUpiId] = useState(society.upi_id);
  const [defaultMaintenance, setDefaultMaintenance] = useState(
    society.default_maintenance.toString()
  );
  const [treasurerName, setTreasurerName] = useState(
    society.treasurer_name || ''
  );
  const [contactPhone, setContactPhone] = useState(
    society.contact_phone || ''
  );

  const [upiValid, setUpiValid] = useState(true);

  const handleUpiChange = (val: string) => {
    setUpiId(val);
    setUpiValid(isValidUpiId(val));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !upiId.trim() || !defaultMaintenance) {
      return;
    }

    updateSociety({
      name: name.trim(),
      address: address.trim(),
      upi_id: upiId.trim(),
      default_maintenance: parseFloat(defaultMaintenance) || 2000,
      treasurer_name: treasurerName.trim() || undefined,
      contact_phone: contactPhone.trim() || undefined,
    });

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>

          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
            Society Profile & UPI Configuration
          </span>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Apartment & Treasurer Setup
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure your society name, default billing amount, and bank UPI handle
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Society Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Apartment / Society Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shri Krishna Residency RWA"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Society Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Building Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plot 42, 4th Main, Indiranagar, Bengaluru - 560038"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* UPI ID & Default Maintenance Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Treasurer Bank UPI ID *
                  </label>
                  <div className="relative">
                    <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. treasurer@okhdfcbank"
                      value={upiId}
                      onChange={(e) => handleUpiChange(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 font-mono text-sm rounded-xl border ${
                        upiValid ? 'border-slate-300' : 'border-rose-400 bg-rose-50/30'
                      } bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  {!upiValid ? (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Enter a valid UPI handle (e.g. name@bank)
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Used for generating QR codes & payment deep-links.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Default Monthly Maintenance (₹) *
                  </label>
                  <div className="relative">
                    <span className="font-bold text-slate-400 absolute left-3 top-2.5 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="100"
                      step="50"
                      value={defaultMaintenance}
                      onChange={(e) => setDefaultMaintenance(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 text-sm font-bold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Auto-filled when generating monthly dues for all flats.
                  </p>
                </div>
              </div>

              {/* Treasurer Name & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hon. Treasurer / Secretary Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. S. K. Sharma"
                      value={treasurerName}
                      onChange={(e) => setTreasurerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Helpline / WhatsApp Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98450 12345"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Role Toggle Information */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">
                  Role-Based Permissions
                </span>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={userRole === 'admin'}
                      onChange={() => setUserRole('admin')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">
                      Society Admin / Treasurer (Full Control)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={userRole === 'resident'}
                      onChange={() => setUserRole('resident')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">
                      Resident (View-Only Mode)
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg" className="w-full shadow-lg shadow-indigo-600/25">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Save Settings & Enter Dashboard
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
