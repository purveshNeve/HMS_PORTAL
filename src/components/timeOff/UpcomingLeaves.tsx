'use client';
import { useEffect, useState, useCallback } from 'react';
import { CalendarDays, Clock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface EmployeeLeaveRequest {
  requestId: string;
  leaveType: string;
  status: string;
  startDate: string;
  endDate: string;
  managerName: string;
  isHalfDay: boolean;
  session?: string;
  duration?: number;
}

function daysUntil(dateStr: string) {
  const date = new Date(dateStr);
  const diff = Math.ceil((date.getTime() - Date.now()) / 86400000);
  return diff;
}

const typeColors: Record<string, string> = {
  'Annual Leave':  'bg-blue-100 text-blue-700',
  'Sick Leave':    'bg-red-100 text-red-700',
  'Casual Leave':  'bg-violet-100 text-violet-700',
  'Comp Off':      'bg-teal-100 text-teal-700',
  'Work From Home':'bg-indigo-100 text-indigo-700',
  'Optional Holiday':'bg-amber-100 text-amber-700',
};

export default function UpcomingLeaves() {
  const { user } = useAuth();
  const employeeId = user?.userId;
  const [leaves, setLeaves] = useState<EmployeeLeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLeaves = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/timeOff/leave-requests?employeeId=${encodeURIComponent(employeeId)}&status=APPROVED,PENDING`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to load upcoming leaves');
      }
      const data = (await res.json()) as EmployeeLeaveRequest[];
      setLeaves(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load leaves');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId) return;
    fetchLeaves();

    const interval = window.setInterval(fetchLeaves, 30000);
    const onFocus = () => fetchLeaves();
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [employeeId, fetchLeaves]);

  const upcomingLeaves = leaves
    .filter(leave => ['APPROVED', 'PENDING'].includes(leave.status))
    .filter(leave => {
      const start = new Date(leave.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return leave.status === 'PENDING' || start >= today;
    })
    .slice(0, 4);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="section-title">Upcoming Approved Leaves</h2>
          <p className="section-subtitle">Confirmed and pending requests for future dates</p>
        </div>
        <div className="flex items-center gap-3 text-2xs text-slate-500">
          <button onClick={fetchLeaves} className="font-medium text-brand-600 hover:underline">Refresh</button>
          {lastUpdated ? <span>Last updated {lastUpdated.toLocaleTimeString()}</span> : <span>Loading...</span>}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading upcoming leaves...</div>
      ) : error ? (
        <div className="p-8 text-center text-rose-600">{error}</div>
      ) : upcomingLeaves.length === 0 ? (
        <div className="p-8 text-center">
          <CalendarDays size={24} className="text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No upcoming leaves scheduled</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {upcomingLeaves.map(leave => {
            const countdown = daysUntil(leave.startDate);
            const colorClass = typeColors[leave.leaveType] ?? 'bg-slate-100 text-slate-600';
            const duration = leave.duration ?? Math.max(1, Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / 86400000) + 1);
            return (
              <div key={leave.requestId} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-25 transition-colors">
                <div className={`flex-shrink-0 px-2 py-1 rounded text-2xs font-semibold ${colorClass}`}>
                  {leave.leaveType.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-800">{leave.leaveType}</span>
                    <span className={`badge ${leave.status === 'APPROVED' ? 'badge-green' : 'badge-yellow'}`}>
                      {leave.status === 'APPROVED' ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-2xs text-slate-500">
                      <CalendarDays size={10} />
                      {new Date(leave.startDate).toLocaleDateString()} – {new Date(leave.endDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-2xs text-slate-500">
                      <Clock size={10} />
                      {duration} {duration === 1 ? 'day' : 'days'}
                    </span>
                    <span className="flex items-center gap-1 text-2xs text-slate-500">
                      <User size={10} />
                      {leave.managerName}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  {countdown > 0 ? (
                    <>
                      <p className="text-sm font-semibold text-slate-800">{countdown}</p>
                      <p className="text-2xs text-slate-400 leading-tight">days away</p>
                    </>
                  ) : countdown === 0 ? (
                    <span className="badge badge-blue">Today</span>
                  ) : (
                    <span className="text-2xs text-slate-400">Past</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-25">
        <button className="text-2xs text-brand-600 hover:underline">View full calendar →</button>
      </div>
    </div>
  );
}
