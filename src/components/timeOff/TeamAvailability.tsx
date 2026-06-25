'use client';
import { teamMembers } from '@/data/mockData';
import clsx from 'clsx';

export default function TeamAvailability() {
  const onLeaveToday = teamMembers.filter(m => m.onLeave && m.leaveType !== 'Work From Home');
  const wfhToday    = teamMembers.filter(m => m.onLeave && m.leaveType === 'Work From Home');
  const inOffice    = teamMembers.filter(m => !m.onLeave);
  const availPct    = Math.round((inOffice.length / teamMembers.length) * 100);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="section-title">Team Availability</h2>
          <p className="section-subtitle">Engineering · Today, {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-slate-800">{availPct}%</p>
          <p className="text-2xs text-slate-400">dept. available</p>
        </div>
      </div>

      {/* Availability bar */}
      <div className="px-4 py-2 border-b border-slate-100">
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
          <div className="bg-emerald-400 transition-all" style={{ width: `${(inOffice.length / teamMembers.length) * 100}%` }} />
          <div className="bg-amber-400 transition-all" style={{ width: `${(wfhToday.length / teamMembers.length) * 100}%` }} />
          <div className="bg-red-300 transition-all" style={{ width: `${(onLeaveToday.length / teamMembers.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-4 mt-1.5">
          {[
            { color: 'bg-emerald-400', label: 'In Office', count: inOffice.length },
            { color: 'bg-amber-400',   label: 'WFH',       count: wfhToday.length },
            { color: 'bg-red-300',     label: 'On Leave',  count: onLeaveToday.length },
          ].map(({ color, label, count }) => (
            <div key={label} className="flex items-center gap-1">
              <span className={clsx('w-2 h-2 rounded-sm', color)} />
              <span className="text-2xs text-slate-500">{label}</span>
              <span className="text-2xs font-semibold text-slate-700 ml-0.5">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Member list */}
      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
        {teamMembers.map(m => (
          <div key={m.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-25 transition-colors">
            <div className="relative flex-shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-2xs font-semibold"
                style={{ backgroundColor: m.color }}
              >
                {m.initials}
              </div>
              <span className={clsx(
                'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                !m.onLeave ? 'bg-emerald-500'
                : m.leaveType === 'Work From Home' ? 'bg-amber-400'
                : 'bg-red-400'
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate">{m.name}</p>
              <p className="text-2xs text-slate-400 truncate">{m.role}</p>
            </div>
            <div className="text-right flex-shrink-0">
              {m.onLeave ? (
                <>
                  <span className={clsx(
                    'badge text-2xs',
                    m.leaveType === 'Work From Home' ? 'badge-yellow' : 'badge-red'
                  )}>
                    {m.leaveType === 'Work From Home' ? 'WFH' : 'On Leave'}
                  </span>
                  {m.leaveUntil && (
                    <p className="text-2xs text-slate-400 mt-0.5">Until {m.leaveUntil}</p>
                  )}
                </>
              ) : (
                <span className="badge badge-green">Available</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-25">
        <button className="text-2xs text-brand-600 hover:underline">View full team calendar →</button>
      </div>
    </div>
  );
}
