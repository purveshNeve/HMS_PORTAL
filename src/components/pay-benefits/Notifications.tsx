"use client";
import { notifications } from "@/data/payBenefitsData";
import { CheckCircle2, Info, Bell } from "lucide-react";

const iconMap = {
  success: { icon: CheckCircle2, cls: "text-green-600 bg-green-100" },
  info: { icon: Info, cls: "text-blue-600 bg-blue-100" },
};

export default function Notifications() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-slate-600 to-slate-400" />
        <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
        <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
          {notifications.length} new
        </span>
      </div>
      <div className="space-y-3">
        {notifications.map((n) => {
          const cfg = iconMap[n.type as keyof typeof iconMap];
          const Icon = cfg.icon;
          return (
            <div key={n.id} className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 p-4 hover:shadow-md transition-shadow">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.cls}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0 pt-0.5">{n.time}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
