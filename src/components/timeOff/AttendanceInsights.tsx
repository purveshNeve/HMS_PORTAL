'use client';
import { attendanceStats } from '@/data/mockData';
import clsx from 'clsx';

interface StatRowProps {
  label: string;
  value: string | number;
  sub?: string;
  pct?: number;
  barColor?: string;
  badge?: { text: string; cls: string };
}

function StatRow({ label, value, sub, pct, barColor = 'bg-brand-500', badge }: StatRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-700">{label}</span>
          {badge && <span className={clsx('badge', badge.cls)}>{badge.text}</span>}
        </div>
        {sub && <p className="text-2xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {pct !== undefined && (
          <div className="w-24 progress-bar hidden sm:block">
            <div className={clsx('progress-fill', barColor)} style={{ width: `${pct}%` }} />
          </div>
        )}
        <span className="text-sm font-semibold text-slate-800 w-12 text-right">{value}</span>
      </div>
    </div>
  );
}

// Minimal bar chart for monthly leave
const monthlyData = [0.5, 1, 0, 2, 1.5, 1, 0, 0, 0, 0, 0, 0];
const monthLabels = ['J','F','M','A','M','J','J','A','S','O','N','D'];

export default function AttendanceInsights() {
  const max = Math.max(...monthlyData, 1);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="section-title">Attendance Insights</h2>
        <p className="section-subtitle">Jan – Dec 2025 · Based on HR records</p>
      </div>

      <div className="px-4 py-1">
        <StatRow
          label="Attendance Rate"
          value={`${attendanceStats.attendancePct}%`}
          sub="Based on scheduled working days"
          pct={attendanceStats.attendancePct}
          barColor="bg-emerald-500"
          badge={attendanceStats.attendancePct >= 90 ? { text: 'Good Standing', cls: 'badge-green' } : undefined}
        />
        <StatRow
          label="Leave Utilisation"
          value={`${attendanceStats.leaveUtilizationPct}%`}
          sub="Of total annual entitlement used"
          pct={attendanceStats.leaveUtilizationPct}
          barColor="bg-blue-500"
        />
        <StatRow
          label="Avg. Monthly Leave"
          value={`${attendanceStats.avgMonthlyDays}d`}
          sub="Average per calendar month this year"
        />
        <StatRow
          label="Late Arrivals"
          value={attendanceStats.lateArrivals}
          sub="Count of days with late check-in"
          badge={attendanceStats.lateArrivals > 5 ? { text: 'Review needed', cls: 'badge-yellow' } : undefined}
        />
        <StatRow
          label="Early Departures"
          value={attendanceStats.earlyDepartures}
          sub="Count of days with early check-out"
        />
        <StatRow
          label="WFH Days Used"
          value={`${attendanceStats.wfhDaysUsed} / ${attendanceStats.wfhDaysTotal}`}
          sub="Remote working days this year"
          pct={Math.round((attendanceStats.wfhDaysUsed / attendanceStats.wfhDaysTotal) * 100)}
          barColor="bg-indigo-500"
        />
      </div>

      {/* Monthly leave bar chart */}
      <div className="px-4 pt-3 pb-4 border-t border-slate-100 mt-1">
        <p className="text-2xs font-semibold text-slate-600 mb-3">Monthly Leave Usage (days)</p>
        <div className="flex items-end gap-1 h-16">
          {monthlyData.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex flex-col justify-end h-12">
                {v > 0 && (
                  <div
                    className="w-full bg-brand-200 rounded-sm transition-all"
                    style={{ height: `${(v / max) * 100}%` }}
                    title={`${v} days`}
                  />
                )}
              </div>
              <span className="text-2xs text-slate-400">{monthLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
