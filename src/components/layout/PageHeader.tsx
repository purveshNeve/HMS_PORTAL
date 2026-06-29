'use client';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PageHeader() {
  const [lastUpdated, setLastUpdated] = useState<string>('Today');

  const refreshData = () => {
    setLastUpdated(new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }));
    window.dispatchEvent(new Event('leave-request-updated'));
  };

  useEffect(() => {
    const handleRefresh = () => refreshData();
    window.addEventListener('leave-request-updated', handleRefresh);
    return () => window.removeEventListener('leave-request-updated', handleRefresh);
  }, []);

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
          <span className="text-2xs text-slate-400 hidden sm:inline">Last updated: {lastUpdated}</span>
          <button
            type="button"
            onClick={refreshData}
            className="btn-ghost text-slate-400 hover:text-slate-600"
            aria-label="Refresh time-off data"
          >
            <RefreshCw size={11} />
          </button>
          {/* <button className="btn-secondary">
            <Download size={11} />
            Statement
          </button> */}
          {/* <button className="btn-primary">
            <Plus size={11} />
            Apply Leave
          </button> */}
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
