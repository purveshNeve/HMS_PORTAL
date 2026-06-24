"use client";
import { benefits } from "@/data/payBenefitsData";
import { Heart, Banknote, Laptop, Star, CheckCircle2 } from "lucide-react";

const sections = [
  { key: "health", label: "Health Benefits", icon: Heart, color: "text-rose-600", bg: "bg-rose-50", dot: "bg-rose-500", data: benefits.health },
  { key: "financial", label: "Financial Benefits", icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500", data: benefits.financial },
  { key: "work", label: "Work Benefits", icon: Laptop, color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500", data: benefits.work },
  { key: "additional", label: "Additional Benefits", icon: Star, color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500", data: benefits.additional },
];

export default function Benefits() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-amber-500" />
        <h2 className="text-lg font-semibold text-slate-800">Benefits</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div key={sec.key} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 ${sec.bg}`}>
                <Icon className={`w-4 h-4 ${sec.color}`} />
                <span className={`text-sm font-semibold ${sec.color}`}>{sec.label}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {sec.data.map((b) => (
                  <div key={b.name} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${sec.dot} flex-shrink-0`} />
                          <p className="text-sm font-semibold text-slate-800 truncate">{b.name}</p>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed ml-3.5">{b.description}</p>
                        <p className="text-xs text-slate-400 mt-1.5 ml-3.5">
                          Renewal: <span className="text-slate-600 font-medium">{b.renewalDate}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mb-1.5">
                          <CheckCircle2 className="w-3 h-3" /> {b.status}
                        </span>
                        <p className="text-xs font-bold text-slate-700 text-right whitespace-nowrap">{b.coverage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
