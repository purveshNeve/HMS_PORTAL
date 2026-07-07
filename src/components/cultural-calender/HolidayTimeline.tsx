"use client";

import { motion } from "framer-motion";
import { Holiday } from "@/types/calendar";
import { formatFriendlyDate } from "@/lib/date-utils";

const tagColors = ["#3730E0", "#E8A33D", "#F0665A", "#4C8B62", "#5B7FDB", "#1E9E8C", "#E0578A", "#34406B"];

export default function HolidayTimeline({ holidays }: { holidays: Holiday[] }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">Company Holidays</h2>
      <div className="relative rounded-xl2 border border-line bg-card p-5 shadow-soft sm:p-6">
        <div className="absolute bottom-6 left-[26px] top-6 w-px bg-line sm:left-[30px]" />
        <ul className="space-y-5">
          {holidays.map((h, i) => (
            <motion.li
              key={h.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="relative flex items-start gap-4 pl-1"
            >
              <span
                className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base shadow-soft sm:h-10 sm:w-10"
                style={{ backgroundColor: `${tagColors[i % tagColors.length]}22` }}
              >
                {h.icon}
              </span>
              <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line/60 pb-4">
                <div>
                  <div className="text-sm font-semibold text-ink">{h.name}</div>
                  <div className="text-xs text-muted">{h.description}</div>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    backgroundColor: `${tagColors[i % tagColors.length]}1A`,
                    color: tagColors[i % tagColors.length],
                  }}
                >
                  {formatFriendlyDate(h.date)}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
