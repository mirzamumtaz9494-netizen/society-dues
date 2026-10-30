'use client';

import React, { useState } from 'react';
import { useSociety } from '@/context/SocietyContext';
import { Flat } from '@/lib/types';
import { sanitizeWhatsAppPhone } from '@/lib/format';
import {
  Users,
  PlusCircle,
  FileSpreadsheet,
  Search,
  Building,
  Home,
  MessageCircle,
  Trash2,
  Phone,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AddFlatModal } from '@/components/flats/AddFlatModal';
import { CsvUploadModal } from '@/components/flats/CsvUploadModal';

export default function FlatsPage() {
  const { flats, society, addFlat, bulkAddFlats, deleteFlat, userRole } = useSociety();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'owner' | 'rented'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const filteredFlats = flats.filter((flat) => {
    const flatNo = flat.flat_number.toLowerCase();
    const owner = flat.owner_name.toLowerCase();
    const phone = flat.phone;
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      flatNo.includes(query) || owner.includes(query) || phone.includes(query);

    if (!matchesSearch) return false;
    if (filterType === 'owner') return !flat.is_rented;
    if (filterType === 'rented') return flat.is_rented;
    return true;
  });

  const handleOpenWhatsApp = (phone: string, flatNo: string, name: string) => {
    const cleanPhone = sanitizeWhatsAppPhone(phone);
    const msg = encodeURIComponent(
      `Hello ${name} (Flat ${flatNo}), regarding ${society.name}:`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const rentedCount = flats.filter((f) => f.is_rented).length;
  const ownerCount = flats.length - rentedCount;

  return (
    <div className="space-y-6">
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Flat & Resident Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {flats.length} total apartment units registered • {ownerCount} Owner-Occupied • {rentedCount} Rented
          </p>
        </div>

        {userRole === 'admin' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsCsvModalOpen(true)}
              className="flex-1 sm:flex-initial"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
              Bulk CSV Import
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-initial shadow-md shadow-indigo-600/20"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Flat
            </Button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search flats by number (e.g. 101), resident name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Flats ({flats.length})
            </button>
            <button
              onClick={() => setFilterType('owner')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filterType === 'owner'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Owner Occupied ({ownerCount})
            </button>
            <button
              onClick={() => setFilterType('rented')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filterType === 'rented'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Rented ({rentedCount})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Flats List */}
      {filteredFlats.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Home className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Flats Found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or add new flats.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Flat No</th>
                  <th className="py-3 px-4">Floor</th>
                  <th className="py-3 px-4">Owner Name</th>
                  <th className="py-3 px-4">WhatsApp Contact</th>
                  <th className="py-3 px-4">Occupancy</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFlats.map((flat) => (
                  <tr
                    key={flat.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                      Flat {flat.flat_number}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      Floor {flat.floor_number || 1}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {flat.owner_name}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                      +91 {flat.phone}
                    </td>

                    <td className="py-3.5 px-4">
                      {flat.is_rented ? (
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Tenant: {flat.tenant_name || 'Rented'}
                          </span>
                          {flat.tenant_phone && (
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              +91 {flat.tenant_phone}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          Owner Occupied
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleOpenWhatsApp(flat.phone, flat.flat_number, flat.owner_name)
                          }
                          title="Open WhatsApp Chat"
                          className="text-xs text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </Button>

                        {userRole === 'admin' && (
                          <button
                            onClick={() => deleteFlat(flat.id)}
                            title="Remove Flat"
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-3">
            {filteredFlats.map((flat) => (
              <Card key={flat.id} className="p-4 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      Flat {flat.flat_number}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      (Floor {flat.floor_number || 1})
                    </span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {flat.owner_name}
                    </p>
                  </div>
                  <div>
                    {flat.is_rented ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Rented
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                        Owner
                      </span>
                    )}
                  </div>
                </div>

                {flat.is_rented && flat.tenant_name && (
                  <div className="text-xs bg-amber-50/50 p-2 rounded-lg text-amber-800">
                    Tenant: <span className="font-semibold">{flat.tenant_name}</span>
                    {flat.tenant_phone && ` (+91 ${flat.tenant_phone})`}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="font-mono">+91 {flat.phone}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleOpenWhatsApp(flat.phone, flat.flat_number, flat.owner_name)
                      }
                      className="text-xs text-emerald-700 border-emerald-200 py-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                      Chat
                    </Button>
                    {userRole === 'admin' && (
                      <button
                        onClick={() => deleteFlat(flat.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddFlatModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addFlat}
      />

      <CsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onBulkAdd={bulkAddFlats}
      />
    </div>
  );
}
