'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Flat } from '@/lib/types';
import { Building, Phone, User, Home } from 'lucide-react';

interface AddFlatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (flat: Omit<Flat, 'id' | 'society_id'>) => void;
}

export function AddFlatModal({ isOpen, onClose, onAdd }: AddFlatModalProps) {
  const [flatNumber, setFlatNumber] = useState('');
  const [floorNumber, setFloorNumber] = useState('1');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [isRented, setIsRented] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNumber.trim() || !ownerName.trim() || !phone.trim()) {
      return;
    }

    onAdd({
      flat_number: flatNumber.trim(),
      floor_number: parseInt(floorNumber) || 1,
      owner_name: ownerName.trim(),
      phone: phone.trim(),
      is_rented: isRented,
      tenant_name: isRented ? tenantName.trim() || null : null,
      tenant_phone: isRented ? tenantPhone.trim() || null : null,
    });

    // Reset form
    setFlatNumber('');
    setOwnerName('');
    setPhone('');
    setIsRented(false);
    setTenantName('');
    setTenantPhone('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Flat to Directory"
      subtitle="Register a new apartment unit and resident contact"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Flat No and Floor */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Flat Number *
            </label>
            <div className="relative">
              <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. 101, 202-A"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Floor Number
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                min="0"
                max="50"
                value={floorNumber}
                onChange={(e) => setFloorNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Owner Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* WhatsApp Mobile */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            WhatsApp Phone Number *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
              +91
            </div>
            <input
              type="tel"
              required
              placeholder="10-digit WhatsApp number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-11 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Used for 1-click WhatsApp dues reminders & official receipts.
          </p>
        </div>

        {/* Occupancy Status Checkbox */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isRented}
              onChange={(e) => setIsRented(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Flat is currently rented out to a Tenant
            </span>
          </label>
        </div>

        {/* Tenant Details if Rented */}
        {isRented && (
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Tenant Information
            </h4>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Tenant Name
              </label>
              <input
                type="text"
                placeholder="e.g. Amit Verma"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Tenant WhatsApp Phone
              </label>
              <input
                type="tel"
                placeholder="10-digit number"
                value={tenantPhone}
                onChange={(e) => setTenantPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2.5 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Save Flat
          </Button>
        </div>
      </form>
    </Modal>
  );
}
