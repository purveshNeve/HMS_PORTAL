'use client';
import { useEffect, useState, useCallback } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

const colorMap: Record<string, { bar: string; text: string; bg: string }> = {
  blue:   { bar: 'bg-blue-500',   text: 'text-blue-700',   bg: 'bg-blue-50' },
  green:  { bar: 'bg-emerald-500',text: 'text-emerald-700',bg: 'bg-emerald-50' },
  violet: { bar: 'bg-violet-500', text: 'text-violet-700', bg: 'bg-violet-50' },
  amber:  { bar: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50' },
  teal:   { bar: 'bg-teal-500',   text: 'text-teal-700',   bg: 'bg-teal-50' },
  indigo: { bar: 'bg-indigo-500', text: 'text-indigo-700', bg: 'bg-indigo-50' },
  orange: { bar: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
  slate:  { bar: 'bg-slate-400',  text: 'text-slate-600',  bg: 'bg-slate-100' },
};

interface SummaryCard {
  label: string;
  value: number | string;
  unit: string;
  color: keyof typeof colorMap;
  trend: number;
  pct: number | null;
}

interface LeaveRequestSummary {
  requestId: string;
  leaveType: string;
  status: string;
  startDate: string;
  endDate: string;
  comments?: string;
  updatedAt : string
}

function getDurationDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);
}

export default function SummaryStrip() {
  const { user } = useAuth();
  const employeeId = user?.userId;
  const [cards, setCards] = useState<SummaryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = useCallback(async () => {
    if (!employeeId) {
      setCards([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/timeOff/leave-requests?employeeId=${encodeURIComponent(employeeId)}&status=APPROVED,PENDING,REJECTED`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to load summary');
      }

      const requests = (await res.json()) as LeaveRequestSummary[];
      const thisYear = new Date().getFullYear();
      const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
      const approvedThisYear = requests.filter(r => r.status === 'APPROVED' && new Date(r.startDate).getFullYear() === thisYear).length;
      const rejectedThisYear = requests.filter(r => r.status === 'REJECTED' && new Date(r.updatedAt || r.endDate).getFullYear() === thisYear).length;
      const commentsCount = requests.filter(r => r.comments && r.comments.trim()).length;
      const types = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Optional Holiday', 'Comp Off', 'Work From Home'] as const;
      const typeStats = types.map(type => {
        const value = requests
          .filter(r => r.status === 'APPROVED' && r.leaveType === type)
          .reduce((sum, r) => sum + getDurationDays(r.startDate, r.endDate), 0);
        return value;
      });

      setCards([
        { label: 'Pending Requests', value: pendingRequests, unit: 'awaiting approval', color: 'orange', trend: 0, pct: null },
        { label: 'Approved This Year', value: approvedThisYear, unit: 'requests', color: 'slate', trend: 0, pct: null },
        { label: 'Rejected This Year', value: rejectedThisYear, unit: 'requests', color: 'red', trend: 0, pct: null },
        { label: 'Manager Comments', value: commentsCount, unit: 'received', color: 'teal', trend: 0, pct: null },
        { label: 'Annual Leave Taken', value: typeStats[0], unit: 'days', color: 'blue', trend: 0, pct: null },
        { label: 'Sick Leave Taken', value: typeStats[1], unit: 'days', color: 'green', trend: 0, pct: null },
        { label: 'Comp Off Taken', value: typeStats[4], unit: 'days', color: 'teal', trend: 0, pct: null },
        { label: 'WFH Days Taken', value: typeStats[5], unit: 'days', color: 'indigo', trend: 0, pct: null },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load summary');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchSummary();

    const handleRefresh = () => {
      fetchSummary();
    };

    window.addEventListener('leave-request-updated', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    return () => {
      window.removeEventListener('leave-request-updated', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [fetchSummary]);

  if (loading) {
    return <div className="card p-5 text-center text-slate-500">Loading summary...</div>;
  }

  if (error) {
    return <div className="card p-5 text-center text-rose-600">{error}</div>;
  }

  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
        {cards.map((card) => {
          const c = colorMap[card.color] ?? colorMap.slate;
          return (
            <div key={card.label} className="bg-white px-3 py-3 hover:bg-slate-25 transition-colors cursor-default group">
              <p className="text-2xs text-slate-500 font-medium leading-tight truncate">{card.label}</p>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className={clsx('text-2xl font-semibold leading-none', c.text)}>{card.value}</span>
                {card.trend !== 0 && (
                  <span className={clsx(
                    'flex items-center text-2xs font-medium',
                    card.trend < 0 ? 'text-slate-400' : 'text-emerald-600'
                  )}>
                    {card.trend > 0
                      ? <TrendingUp size={9} />
                      : card.trend < 0
                      ? <TrendingDown size={9} />
                      : <Minus size={9} />
                    }
                    <span className="ml-0.5">{Math.abs(card.trend)}</span>
                  </span>
                )}
              </div>
              <p className="text-2xs text-slate-400 mt-0.5 leading-tight">{card.unit}</p>
              {card.pct !== null && (
                <div className="mt-2">
                  <div className="progress-bar">
                    <div
                      className={clsx('progress-fill', c.bar)}
                      style={{ width: `${card.pct}%` }}
                    />
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">{card.pct}% remaining</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
