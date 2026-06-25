'use client';
import { compOffRecords } from '@/data/mockData';
import { Plus, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const statusMap = {
  Available: 'badge-green',
  Used:      'badge-gray',
  Expired:   'badge-red',
};

function daysUntilExpiry(dateStr: string) {
  const parts = dateStr.split(' ');
  const months: Record<string,number> = {
    Jan:0,Feb:1,Mar:2,Apr:3,May:4,May:4,Jun:5,
    Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11,
  };
  const d = new Date(parseInt(parts[2]), months[parts[1]], parseInt(parts[0]));
  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
  return diff;
}

export default function CompOffManagement() {
  const available = compOffRecords.filter(r => r.status === 'Available');
  const totalAvail = available.reduce((s, r) => s + r.days, 0);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="section-title">Compensatory Off</h2>
          <p className="section-subtitle">Earned comp off balance and usage history</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-slate-800">{totalAvail} <span className="text-sm font-normal text-slate-500">day{totalAvail !== 1 ? 's' : ''}</span></p>
          <p className="text-2xs text-slate-400">available</p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {compOffRecords.map(rec => {
          const countdown = daysUntilExpiry(rec.expiry);
          return (
            <div key={rec.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-25 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-slate-800">{rec.reason}</span>
                  <span className={clsx('badge', statusMap[rec.status])}>{rec.status}</span>
                </div>
                <p className="text-2xs text-slate-400 mt-0.5">
                  Earned: {rec.earnedOn} · Expires: {rec.expiry}
                  {rec.status === 'Available' && countdown > 0 && countdown <= 30 && (
                    <span className="ml-1.5 text-amber-600 font-medium">· {countdown} days left</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-semibold text-slate-700">{rec.days}d</span>
                {rec.status === 'Available' && (
                  <button className="btn-ghost px-2 py-1 text-2xs text-brand-600">
                    Use <ArrowRight size={10} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2 bg-slate-25">
        <button className="btn-primary">
          <Plus size={11} />
          Request Comp Off
        </button>
        <button className="btn-secondary">Convert to Leave</button>
      </div>
    </div>
  );
}
