"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { Birthday } from "@/types/calendar";
import { formatFriendlyDate } from "@/lib/date-utils";

const avatarPalette = ["#3730E0", "#E8A33D", "#F0665A", "#4C8B62", "#5B7FDB", "#1E9E8C", "#E0578A", "#34406B"];
const confettiEmojis = ["🎉", "🎊", "✨", "🎈"];

export default function BirthdaySection({ birthdays }: { birthdays: Birthday[] }) {
  const [wished, setWished] = useState<Set<string>>(new Set());

  const wish = (id: string) => {
    setWished((prev) => new Set(prev).add(id));
  };

  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">Birthdays This Month</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {birthdays.map((b, i) => {
          const color = avatarPalette[i % avatarPalette.length];
          const hasWished = wished.has(b.id);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-xl border border-line bg-card p-3 text-center shadow-soft"
            >
              <div
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: color }}
              >
                {b.initials}
              </div>
              <div className="mt-2 text-sm font-semibold text-ink leading-tight">{b.name}</div>
              <div className="text-[11px] text-muted leading-tight">{b.department}</div>
              <div className="mt-0.5 text-[10px] text-muted">{formatFriendlyDate(b.date)}</div>

              <button
                onClick={() => wish(b.id)}
                disabled={hasWished}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-pinkrose-light px-2 py-1 text-[10px] font-semibold text-pinkrose transition-colors hover:bg-pinkrose hover:text-white disabled:cursor-default disabled:bg-moss-light disabled:text-moss disabled:hover:bg-moss-light disabled:hover:text-moss"
              >
                <PartyPopper className="h-3 w-3" />
                {hasWished ? "Wished!" : "Send Wishes"}
              </button>

              <AnimatePresence>
                {hasWished && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {confettiEmojis.map((emoji, ci) => (
                      <motion.span
                        key={ci}
                        initial={{ opacity: 1, y: 0, x: 0, scale: 0.6 }}
                        animate={{
                          opacity: 0,
                          y: -70 - ci * 8,
                          x: (ci - 1.5) * 22,
                          scale: 1.1,
                          rotate: ci * 40,
                        }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="absolute bottom-10 left-1/2 text-lg"
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
