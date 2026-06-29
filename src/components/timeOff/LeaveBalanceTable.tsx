'use client';
import { useCallback, useEffect, useState } from 'react';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import type { LeaveBalance } from '@/types/indexOriginal';

const LEAVE_ENTITLEMENTS: Array<LeaveBalance> = [
  { type: 'Annual Leave', total: 21, used: 0, remaining: 21, expiry: '31 Dec 2025', carryForward: true, status: 'Active', unit: 'days' },
  { type: 'Casual Leave', total: 8, used: 0, remaining: 8, expiry: '31 Mar 2025', carryForward: false, status: 'Active', unit: 'days' },
  { type: 'Sick Leave', total: 12, used: 0, remaining: 12, expiry: '31 Dec 2025', carryForward: false, status: 'Active', unit: 'days' },
  { type: 'Maternity Leave', total: 182, used: 0, remaining: 182, expiry: 'N/A', carryForward: false, status: 'N/A', unit: 'days' },
  { type: 'Paternity Leave', total: 15, used: 0, remaining: 15, expiry: 'N/A', carryForward: false, status: 'Active', unit: 'days' },
  { type: 'Bereavement Leave', total: 5, used: 0, remaining: 5, expiry: 'N/A', carryForward: false, status: 'Active', unit: 'days' },
  { type: 'Optional Holiday', total: 2, used: 0, remaining: 2, expiry: '31 Dec 2025', carryForward: false, status: 'Active', unit: 'days' },
  { type: 'Comp Off', total: 3, used: 0, remaining: 3, expiry: '30 Jun 2025', carryForward: false, status: 'Active', unit: 'days' },
  { type: 'Work From Home', total: 52, used: 0, remaining: 52, expiry: '31 Dec 2025', carryForward: false, status: 'Active', unit: 'quota' },
  { type: 'Unpaid Leave', total: 0, used: 0, remaining: 0, expiry: 'N/A', carryForward: false, status: 'N/A', unit: 'days' },
];

function calculateRequestDuration(request: BackendLeaveRequest) {
  if (!request.startDate || !request.endDate) return 0;
  if (request.isHalfDay) return 0.5;

  const start = new Date(request.startDate);
  const end = new Date(request.endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.round((end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) / msPerDay) + 1;
  return Math.max(1, days);
}

function getUtilization(total: number, used: number) {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
}

function getLeaveBalanceStatus(total: number, remaining: number): LeaveBalance['status'] {
  if (total === 0) return 'N/A';
  return remaining === 0 ? 'Exhausted' : 'Active';
}

interface BackendLeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  isHalfDay?: boolean;
}

function PctBar({ used, total }: { used: number; total: number }) {
  if (total === 0) return <span className="text-slate-300">—</span>;
  const pct = getUtilization(total, used);
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
  const { userId } = useAuth();
  const [balances, setBalances] = useState<LeaveBalance[]>(LEAVE_ENTITLEMENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshBalances = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/timeOff/leave-requests?employeeId=${encodeURIComponent(userId)}&status=APPROVED`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Unable to fetch leave request history');
      }
      const requests = (await res.json()) as BackendLeaveRequest[];
      const usedByType = requests.reduce<Record<string, number>>((acc, request) => {
        const duration = calculateRequestDuration(request);
        acc[request.leaveType] = (acc[request.leaveType] || 0) + duration;
        return acc;
      }, {});

      const updated = LEAVE_ENTITLEMENTS.map((entitlement) => {
        const used = usedByType[entitlement.type] ?? 0;
        const remaining = Math.max(0, entitlement.total - used);
        return {
          ...entitlement,
          used,
          remaining,
          status: getLeaveBalanceStatus(entitlement.total, remaining),
        };
      });

      setBalances(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leave balances');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshBalances();

    const handleRefresh = () => refreshBalances();
    window.addEventListener('leave-request-updated', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    return () => {
      window.removeEventListener('leave-request-updated', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [refreshBalances]);

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
            {balances.map((row) => (
              <tr key={row.type} className="hover-row">
                <td className="table-td font-medium text-slate-800 whitespace-nowrap">{row.type}</td>
                <td className="table-td text-slate-600">
                  {row.total === 0 ? '—' : `${row.total} days`}
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
                    {row.total === 0 ? '—' : row.remaining}
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
            {loading && (
              <tr>
                <td colSpan={8} className="table-td text-center text-slate-500">Loading leave balances…</td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={8} className="table-td text-center text-red-600">{error}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 bg-slate-25 border-t border-slate-100 flex items-center justify-between">
        <p className="text-2xs text-slate-400">Showing {balances.length} leave types · FY Jan–Dec 2025</p>
        <button
          type="button"
          className="text-2xs text-brand-600 hover:underline"
          onClick={refreshBalances}
        >
          Refresh balances
        </button>
      </div>
    </div>
  );
}
