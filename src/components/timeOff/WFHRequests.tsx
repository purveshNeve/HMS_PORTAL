'use client';
import { useState } from 'react';
import { Plus, Laptop, CalendarDays, ChevronDown } from 'lucide-react';
import { attendanceStats } from '@/data/mockData';
import clsx from 'clsx';

const wfhHistory = [
  { week: 'Week of 9 Jun 2025',  days: ['Mon','Tue'],         status: 'Approved' },
  { week: 'Week of 2 Jun 2025',  days: ['Wed','Thu','Fri'],    status: 'Approved' },
  { week: 'Week of 26 May 2025', days: ['Mon'],                status: 'Approved' },
  { week: 'Week of 19 May 2025', days: ['Tue','Wed'],          status: 'Approved' },
];

const upcomingWFH = [
  { date: '16 Jun 2025', day: 'Monday',    status: 'Pending' },
  { date: '17 Jun 2025', day: 'Tuesday',   status: 'Pending' },
];

export default function WFHRequests() {
  const [showForm, setShowForm] = useState(false);
  const pct = Math.round((attendanceStats.wfhDaysUsed / attendanceStats.wfhDaysTotal) * 100);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="section-title">Work From Home</h2>
          <p className="section-subtitle">Remote work requests and quota tracker</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          <Plus size={11} />
          Request WFH
        </button>
      </div>

      {/* Quota strip */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-6">
        <div>
          <p className="text-xs text-slate-500">Days Used</p>
          <p className="text-2xl font-semibold text-slate-800">{attendanceStats.wfhDaysUsed}</p>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xs text-slate-500">Annual quota</span>
            <span className="text-2xs font-medium text-slate-700">{attendanceStats.wfhDaysUsed} / {attendanceStats.wfhDaysTotal} days</span>
          </div>
          <div className="progress-bar h-1.5">
            <div className="progress-fill bg-indigo-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500">Remaining</p>
          <p className="text-2xl font-semibold text-indigo-700">{attendanceStats.wfhDaysTotal - attendanceStats.wfhDaysUsed}</p>
        </div>
      </div>

      {/* Inline WFH request form */}
      {showForm && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-25">
          <p className="text-xs font-semibold text-slate-700 mb-2.5">New WFH Request</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Start Date *</label>
              <input type="date" className="form-input" />
            </div>
            <div>
              <label className="form-label">End Date *</label>
              <input type="date" className="form-input" />
            </div>
            <div className="col-span-2">
              <label className="form-label">Reason</label>
              <input type="text" className="form-input" placeholder="Optional — reason for remote work" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="btn-primary" onClick={() => setShowForm(false)}>Submit</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Pending requests */}
      {upcomingWFH.length > 0 && (
        <div className="px-4 py-2.5 border-b border-slate-100">
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pending Requests</p>
          <div className="space-y-1.5">
            {upcomingWFH.map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <Laptop size={12} className="text-slate-400" />
                <span className="text-xs text-slate-700">{w.day}, {w.date}</span>
                <span className="badge badge-yellow ml-auto">{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="px-4 py-2.5">
        <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent History</p>
        <div className="space-y-2">
          {wfhHistory.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <CalendarDays size={11} className="text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-slate-700">{w.week}</span>
                <div className="flex items-center gap-1 mt-0.5">
                  {w.days.map(d => (
                    <span key={d} className="text-2xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded px-1.5 py-px">{d}</span>
                  ))}
                </div>
              </div>
              <span className="badge badge-green">{w.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-25">
        <button className="text-2xs text-brand-600 hover:underline">View full WFH history →</button>
      </div>
    </div>
  );
}
