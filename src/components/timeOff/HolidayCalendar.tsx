'use client';
import { useState } from 'react';
import { Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { holidays } from '@/data/mockData';
import type { Holiday } from '@/types/indexOriginal';
import clsx from 'clsx';

const typeBadge: Record<Holiday['type'], string> = {
  Public:   'badge-blue',
  Company:  'badge-purple',
  Regional: 'badge-green',
  Optional: 'badge-yellow',
  Shutdown: 'badge-red',
};

const typeLabel: Record<Holiday['type'], string> = {
  Public:   'National',
  Company:  'Company',
  Regional: 'Regional',
  Optional: 'Optional',
  Shutdown: 'Shutdown',
};

type HolidayType = Holiday['type'] | 'All';

const allTypes: HolidayType[] = ['All', 'Public', 'Company', 'Regional', 'Optional', 'Shutdown'];

export default function HolidayCalendar() {
  const [view, setView] = useState<'list' | 'year'>('list');
  const [typeFilter, setTypeFilter] = useState<HolidayType>('All');

  const filtered = typeFilter === 'All' ? holidays : holidays.filter(h => h.type === typeFilter);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="section-title">Company Holiday Calendar</h2>
          <p className="section-subtitle">FY 2025 · India · All locations</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center border border-slate-200 rounded overflow-hidden">
            {(['list', 'year'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={clsx(
                  'px-3 py-1.5 text-2xs font-medium capitalize transition-colors',
                  view === v ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                )}
              >
                {v === 'list' ? 'List View' : 'Year View'}
              </button>
            ))}
          </div>
          <button className="btn-secondary">
            <Download size={11} />
            Export
          </button>
        </div>
      </div>

      {/* Type filter */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
        <Filter size={11} className="text-slate-400 flex-shrink-0" />
        {allTypes.map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={clsx(
              'px-2.5 py-0.5 text-2xs rounded-full border font-medium transition-colors whitespace-nowrap',
              typeFilter === t
                ? 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            )}
          >
            {t === 'All' ? 'All Types' : typeLabel[t as Holiday['type']]}
          </button>
        ))}
        <span className="ml-auto text-2xs text-slate-400 whitespace-nowrap">{filtered.length} holidays</span>
      </div>

      {view === 'list' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['#','Holiday','Date','Day','Type','Locations'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((h, i) => (
                <tr key={h.id} className="hover-row">
                  <td className="table-td text-slate-400 w-8">{i + 1}</td>
                  <td className="table-td font-medium text-slate-800 whitespace-nowrap">{h.name}</td>
                  <td className="table-td text-slate-600 whitespace-nowrap">{h.date}</td>
                  <td className="table-td text-slate-500">{h.day}</td>
                  <td className="table-td">
                    <span className={clsx('badge', typeBadge[h.type])}>{typeLabel[h.type]}</span>
                  </td>
                  <td className="table-td text-slate-500 text-2xs">
                    {h.locations.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <YearView holidays={filtered} />
      )}

      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-25">
        <div className="flex items-center gap-4 flex-wrap">
          {(['Public','Company','Regional','Optional','Shutdown'] as const).map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <span className={clsx('badge text-2xs', typeBadge[t])}>{typeLabel[t]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function YearView({ holidays }: { holidays: Holiday[] }) {
  const [year, setYear] = useState(2025);
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
  const monthNums: Record<string,number> = {
    Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,
    Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12,
  };
  const getMonthHolidays = (mIdx: number) =>
    holidays.filter(h => {
      const parts = h.date.split(' ');
      return parseInt(parts[2]) === year && monthNums[parts[1]] === mIdx + 1;
    });

  const typeDot: Record<Holiday['type'], string> = {
    Public:   'bg-blue-500',
    Company:  'bg-violet-500',
    Regional: 'bg-emerald-500',
    Optional: 'bg-amber-500',
    Shutdown: 'bg-red-500',
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setYear(y => y - 1)} className="btn-ghost">
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-semibold text-slate-800">{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="btn-ghost">
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {months.map((month, i) => {
          const mHolidays = getMonthHolidays(i);
          return (
            <div key={month} className="border border-slate-200 rounded p-2.5 bg-slate-25">
              <p className="text-2xs font-semibold text-slate-700 mb-2">{month}</p>
              {mHolidays.length === 0 ? (
                <p className="text-2xs text-slate-300 italic">No holidays</p>
              ) : (
                <div className="space-y-1">
                  {mHolidays.map(h => (
                    <div key={h.id} className="flex items-start gap-1.5">
                      <span className={clsx('mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0', typeDot[h.type])} />
                      <div>
                        <p className="text-2xs text-slate-700 leading-tight">{h.name}</p>
                        <p className="text-2xs text-slate-400">{h.date.split(' ').slice(0,2).join(' ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
