"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { quickAccessItems, type QuickAccessItem } from "@/lib/mock/dashboard";
import { quickAccessIconMap } from "@/lib/icon-map";

export function QuickAccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800">
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-9">
            {quickAccessItems.map((item: QuickAccessItem) => {
              const Icon = quickAccessIconMap[item.icon as QuickAccessItem['icon']];
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-3 text-center transition-all duration-300 hover:scale-[1.02] hover:border-indigo-100 hover:bg-indigo-50/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{item.label}</span>
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
