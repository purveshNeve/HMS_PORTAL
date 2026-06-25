'use client';
import {
  Plus, X, Download, CalendarDays, RefreshCw,
  Laptop, Mail, FileText, Clock,
} from 'lucide-react';

const actions = [
  { icon: Plus,         label: 'Apply Leave',             desc: 'Submit a new leave request',       color: 'text-brand-600',  bg: 'bg-brand-50',   border: 'border-brand-200' },
  { icon: X,           label: 'Cancel Leave',             desc: 'Withdraw a pending request',        color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200'   },
  { icon: Download,    label: 'Leave Statement',           desc: 'Download your leave record',        color: 'text-slate-600',  bg: 'bg-slate-50',   border: 'border-slate-200' },
  { icon: CalendarDays,label: 'Holiday Calendar',          desc: 'Export the 2025 holiday list',      color: 'text-teal-600',   bg: 'bg-teal-50',    border: 'border-teal-200'  },
  { icon: Clock,       label: 'Request Comp Off',          desc: 'Log a compensatory off request',    color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200' },
  { icon: Laptop,      label: 'Work From Home',            desc: 'Apply for remote work days',        color: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-200'},
  { icon: Mail,        label: 'Contact HR',                desc: 'Raise a query or HR ticket',        color: 'text-violet-600', bg: 'bg-violet-50',  border: 'border-violet-200'},
  { icon: FileText,    label: 'Leave Policies',            desc: 'Read company leave rules',          color: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-200'},
];

export default function QuickActions() {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="section-title">Quick Actions</h2>
        <p className="section-subtitle">Common tasks and shortcuts</p>
      </div>
      <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map(({ icon: Icon, label, desc, color, bg, border }) => (
          <button
            key={label}
            className={`flex items-center gap-2.5 p-2.5 rounded border ${border} ${bg} hover:opacity-80 transition-opacity text-left`}
          >
            <div className={`w-7 h-7 flex items-center justify-center rounded ${bg} border ${border}`}>
              <Icon size={13} className={color} />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-medium leading-tight ${color}`}>{label}</p>
              <p className="text-2xs text-slate-400 mt-0.5 leading-tight line-clamp-1">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
