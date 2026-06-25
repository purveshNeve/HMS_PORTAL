'use client';
import { CalendarDays, Clock, User } from 'lucide-react';
import { leaveRequests } from '@/data/mockData';

const upcomingLeaves = leaveRequests
  .filter(r => r.status === 'Approved' || r.status === 'Pending')
  .slice(0, 4);

function daysUntil(dateStr: string) {
  const parts = dateStr.split(' ');
  const months: Record<string, number> = {
    Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,
    Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11,
  };
  const d = new Date(parseInt(parts[2]), months[parts[1]], parseInt(parts[0]));
  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
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
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="section-title">Upcoming Approved Leaves</h2>
        <p className="section-subtitle">Confirmed and pending requests for future dates</p>
      </div>

      {upcomingLeaves.length === 0 ? (
        <div className="p-8 text-center">
          <CalendarDays size={24} className="text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No upcoming leaves scheduled</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {upcomingLeaves.map(leave => {
            const countdown = daysUntil(leave.startDate);
            const colorClass = typeColors[leave.type] ?? 'bg-slate-100 text-slate-600';
            return (
              <div key={leave.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-25 transition-colors">
                {/* Type pill */}
                <div className={`flex-shrink-0 px-2 py-1 rounded text-2xs font-semibold ${colorClass}`}>
                  {leave.type.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-800">{leave.type}</span>
                    <span className={`badge ${leave.status === 'Approved' ? 'badge-green' : 'badge-yellow'}`}>
                      {leave.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-2xs text-slate-500">
                      <CalendarDays size={10} />
                      {leave.startDate} – {leave.endDate}
                    </span>
                    <span className="flex items-center gap-1 text-2xs text-slate-500">
                      <Clock size={10} />
                      {leave.duration} {leave.duration === 1 ? 'day' : 'days'}
                    </span>
                    <span className="flex items-center gap-1 text-2xs text-slate-500">
                      <User size={10} />
                      {leave.approver}
                    </span>
                  </div>
                </div>

                {/* Countdown */}
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
