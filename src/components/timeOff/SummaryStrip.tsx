'use client';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { summaryCards } from '@/data/mockData';
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

export default function SummaryStrip() {
  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
        {summaryCards.map((card) => {
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
