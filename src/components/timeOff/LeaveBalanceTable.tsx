'use client';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { leaveBalances } from '@/data/mockData';
import clsx from 'clsx';

function PctBar({ used, total }: { used: number; total: number }) {
  if (total === 0) return <span className="text-slate-300">—</span>;
  const pct = Math.round((used / total) * 100);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2 min-w-20 justify-center pct-wrapper">
      <div className="flex-1 progress-bar">
        <div className={clsx('progress-fill', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-2xs text-slate-400 w-6 text-right">{pct}</span>
    </div>
  );
}
export default function LeaveBalanceTable() {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="section-title">Leave Balance Overview</h2>
          <p className="section-subtitle">Allocation for the current leave year — Jan to Dec 2025</p>
        </div>
        <span className="text-2xs text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">FY 2025</span>
      </div>

      <div className="overflow-x-auto">
        <table className="timeoff-table">
          <colgroup>
            <col style={{ width: '300px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '140px' }} />
            <col style={{ width: '140px' }} />
            <col style={{ width: '240px' }} />
            <col style={{ width: '180px' }} />
          </colgroup>
          <thead>
            <tr>
              {['Leave Type','Total','Used','Remaining','Expiry','Carry Forward','Utilisation(%)','Status'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaveBalances.map((row, i) => (
              <tr key={i} className="hover-row">
                <td className="table-td font-medium text-slate-800 whitespace-nowrap">{row.type}</td>
                <td className="table-td text-slate-600">
                  {row.total === 0 ? '—' : `${row.total} ${row.unit === 'quota' ? 'days' : 'days'}`}
                </td>
                <td className="table-td text-slate-600">{row.used === 0 ? '0' : row.used}</td>
                <td className="table-td">
                  <span className={clsx(
                    'font-semibold',
                    row.remaining === 0 ? 'text-slate-400'
                    : row.remaining <= 2 ? 'text-red-600'
                    : row.remaining <= 5 ? 'text-amber-600'
                    : 'text-slate-800'
                  )}>
                    {row.remaining === 0 && row.total === 0 ? '—' : row.remaining}
                  </span>
                </td>
                <td className="table-td text-slate-500 whitespace-nowrap">{row.expiry}</td>
                <td className="table-td">
                  {row.carryForward
                    ? <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={11} />Yes</span>
                    : row.status === 'N/A'
                    ? <span className="flex items-center gap-1 text-slate-400"><MinusCircle size={11} />N/A</span>
                    : <span className="flex items-center gap-1 text-slate-500"><XCircle size={11} />No</span>
                  }
                </td>
                <td className="table-td progress-cell">
                  <PctBar used={row.used} total={row.total} />
                </td>
                <td className="table-td status-cell">
                  {row.status === 'N/A' ? (
                    <span className="badge badge-gray">N/A</span>
                  ) : row.status === 'Exhausted' ? (
                    <span className="badge badge-red">Exhausted</span>
                  ) : (
                    <span className="badge badge-green">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 bg-slate-25 border-t border-slate-100 flex items-center justify-between">
        <p className="text-2xs text-slate-400">Showing 10 leave types · FY Jan–Dec 2025</p>
        <button className="text-2xs text-brand-600 hover:underline">Download Leave Statement</button>
      </div>
    </div>
  );
}
