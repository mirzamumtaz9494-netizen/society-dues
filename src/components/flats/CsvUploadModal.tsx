'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Flat } from '@/lib/types';
import { FileSpreadsheet, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkAdd: (flats: Array<Omit<Flat, 'id' | 'society_id'>>) => void;
}

const SAMPLE_CSV = `FlatNo,Floor,OwnerName,Phone,IsRented,TenantName,TenantPhone
101,1,Ramesh Gupta,9845012345,No,,
102,1,Priya Sundaram,9845023456,Yes,Amit Verma,9811122334
201,2,K. V. Narayan,9845034567,No,,
202,2,Deepa Deshmukh,9845045678,No,,
301,3,Sunil Joshi,9845056789,No,,
302,3,Vikram Malhotra,9845067890,Yes,Rohit Roy,9988776655`;

export function CsvUploadModal({ isOpen, onClose, onBulkAdd }: CsvUploadModalProps) {
  const { showToast } = useToast();
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<Array<Omit<Flat, 'id' | 'society_id'>>>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleParseCsv = (rawText: string) => {
    setErrorMsg(null);
    try {
      const lines = rawText.trim().split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        throw new Error('CSV must contain a header row and at least one flat row.');
      }

      // Check header or parse lines
      const rows: Array<Omit<Flat, 'id' | 'society_id'>> = [];
      const dataLines = lines.slice(1);

      for (let i = 0; i < dataLines.length; i++) {
        const parts = dataLines[i].split(',').map((p) => p.trim());
        if (parts.length < 4) continue;

        const [flatNo, floor, ownerName, phone, isRentedStr, tenantName, tenantPhone] = parts;
        if (!flatNo || !ownerName || !phone) continue;

        const isRented =
          isRentedStr?.toLowerCase() === 'yes' ||
          isRentedStr?.toLowerCase() === 'true' ||
          Boolean(tenantName);

        rows.push({
          flat_number: flatNo,
          floor_number: parseInt(floor) || 1,
          owner_name: ownerName,
          phone: phone.replace(/\D/g, ''),
          is_rented: isRented,
          tenant_name: isRented ? tenantName || null : null,
          tenant_phone: isRented ? (tenantPhone ? tenantPhone.replace(/\D/g, '') : null) : null,
        });
      }

      if (rows.length === 0) {
        throw new Error('No valid flat rows found in CSV data.');
      }

      setParsedRows(rows);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse CSV');
      setParsedRows([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      handleParseCsv(text);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setCsvText(SAMPLE_CSV);
    handleParseCsv(SAMPLE_CSV);
  };

  const handleDownloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'society_flats_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFinalImport = () => {
    if (parsedRows.length === 0) return;
    onBulkAdd(parsedRows);
    setCsvText('');
    setParsedRows([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Import Flats (CSV / Excel)"
      subtitle="Upload or paste flat details in batch"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Sample Download Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/60 dark:border-indigo-800 text-xs">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-indigo-900 dark:text-indigo-200 font-medium">
              Need the spreadsheet format template?
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:underline"
            >
              Fill Sample
            </button>
            <span className="text-indigo-300">|</span>
            <button
              onClick={handleDownloadSampleCsv}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download .CSV
            </button>
          </div>
        </div>

        {/* File Upload Input */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <input
            type="file"
            id="csv-file-input"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="csv-file-input"
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Click to browse CSV file
              </span>
              <p className="text-xs text-slate-500 mt-0.5">or paste CSV rows below</p>
            </div>
          </label>
        </div>

        {/* Text Area for manual paste */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            CSV Content (Header: FlatNo, Floor, OwnerName, Phone, IsRented, TenantName, TenantPhone)
          </label>
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              handleParseCsv(e.target.value);
            }}
            placeholder="FlatNo,Floor,OwnerName,Phone,IsRented,TenantName,TenantPhone&#10;101,1,Ramesh Gupta,9845012345,No,,&#10;102,1,Priya Sundaram,9845023456,Yes,Amit,9811122334"
            className="w-full font-mono text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Rows Preview */}
        {parsedRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Ready to Import: {parsedRows.length} Flats
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 sticky top-0">
                  <tr>
                    <th className="p-2">Flat</th>
                    <th className="p-2">Owner</th>
                    <th className="p-2">WhatsApp</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parsedRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2 font-bold">{r.flat_number}</td>
                      <td className="p-2">{r.owner_name}</td>
                      <td className="p-2 font-mono">{r.phone}</td>
                      <td className="p-2">
                        {r.is_rented ? (
                          <span className="text-amber-600 font-medium">Tenant: {r.tenant_name}</span>
                        ) : (
                          <span className="text-slate-500">Owner Occupied</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={parsedRows.length === 0}
            onClick={handleFinalImport}
            className="flex-1"
          >
            Import {parsedRows.length > 0 ? `${parsedRows.length} Flats` : ''}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
