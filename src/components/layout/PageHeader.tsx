'use client';
import { Download, Plus, RefreshCw } from 'lucide-react';

export default function PageHeader() {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">My Time Off</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage leave balances, requests, holidays and attendance-related activities.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          <span className="text-2xs text-slate-400 hidden sm:inline">Last updated: Today, 09:14 AM</span>
          <button className="btn-ghost text-slate-400">
            <RefreshCw size={11} />
          </button>
          <button className="btn-secondary">
            <Download size={11} />
            Statement
          </button>
          <button className="btn-primary">
            <Plus size={11} />
            Apply Leave
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 mt-1.5">
        {/* <span className="text-2xs text-slate-400">Home</span>
        <span className="text-2xs text-slate-300">/</span>
        <span className="text-2xs text-slate-400">Employee Self-Service</span>
        <span className="text-2xs text-slate-300">/</span>
        <span className="text-2xs text-brand-600 font-medium">Time Off</span> */}
      </div>
    </div>
  );
}
