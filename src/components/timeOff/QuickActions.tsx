'use client';
import {
  Plus, X, Download, CalendarDays, RefreshCw,
  Laptop, Mail, FileText, Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import EmployeePortalChatModal from '@/components/chat/EmployeePortalChatModal';

export default function QuickActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleContactHR = () => {
    setIsChatOpen(true);
  };

  const actions = [
    { icon: Plus, label: 'Apply Leave', desc: 'Submit a new leave request', color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200', link: "/employee/timeOff/leave" },
    { icon: Download, label: 'Leave Statement', desc: 'Download your leave record', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', link: "/employee/timeOff/statement" },
    { icon: CalendarDays, label: 'Holiday Calendar', desc: 'Export the 2025 holiday list', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', link: "/employee/timeOff/calender" },
    { icon: Clock, label: 'Request Comp Off', desc: 'Log a compensatory off request', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', link: "/employee/timeOff/compoff" },
    { icon: Laptop, label: 'Work From Home', desc: 'Apply for remote work days', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', link: "/employee/timeOff/compoff" },
    { icon: Mail, label: 'Contact HR', desc: 'Raise a query or HR ticket', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', onClick: handleContactHR },
    { icon: FileText, label: 'Leave Policies', desc: 'Read company leave rules', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', link: "/employee/timeOff/policies" },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="section-title">Quick Actions</h2>
        <p className="section-subtitle">Common tasks and shortcuts</p>
      </div>
      <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map(({ icon: Icon, label, desc, color, bg, border, link, onClick }) => {
          const handleClick = onClick || (label === 'Contact HR' ? handleContactHR : undefined);
          const content = (
            <>
              <div className={`w-7 h-7 flex items-center justify-center rounded ${bg} border ${border}`}>
                <Icon size={13} className={color} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-medium leading-tight ${color}`}>{label}</p>
                <p className="text-2xs text-slate-400 mt-0.5 leading-tight line-clamp-1">{desc}</p>
              </div>
            </>
          );

          const className = `flex items-center gap-2.5 p-2.5 rounded border ${border} ${bg} hover:opacity-80 transition-opacity text-left`;

          if (link) {
            return (
              <Link key={label} href={link} className={className}>
                {content}
              </Link>
            );
          }

          if (handleClick) {
            return (
              <button key={label} className={className} onClick={handleClick}>
                {content}
              </button>
            );
          }

          return (
            <div key={label} className={className}>
              {content}
            </div>
          );
        })}
      </div>
      <EmployeePortalChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
