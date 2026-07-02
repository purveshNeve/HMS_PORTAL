"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { OfferStatus } from "@/lib/types";

const flow: OfferStatus[] = ["Draft", "Pending Approval", "Approved", "Sent", "Viewed", "Accepted"];
const terminal: OfferStatus[] = ["Rejected", "Expired"];

export function OfferStatusTimeline({ status }: { status: OfferStatus }) {
  const isTerminal = terminal.includes(status) || status === "Negotiating";
  const currentIndex = flow.indexOf(status);
  const activeIndex = currentIndex === -1 ? (status === "Negotiating" ? 3 : flow.length - 1) : currentIndex;

  return (
    <div className="flex items-center">
      {flow.map((stage, i) => {
        const done = i < activeIndex || (i === activeIndex && !isTerminal);
        const isCurrent = i === activeIndex;
        return (
          <div key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                  done
                    ? "border-evergreen-700 bg-evergreen-700 text-white"
                    : isCurrent && isTerminal
                    ? "border-coral-500 bg-coral-500 text-white"
                    : "border-ink-200 bg-white text-ink-300 dark:border-ink-600 dark:bg-surface-darkcard"
                )}
              >
                {done ? <Check size={12} /> : i + 1}
              </motion.div>
              <span className={cn("w-16 text-center text-[10px] leading-tight", done ? "text-ink-600 dark:text-ink-300" : "text-ink-300")}>
                {stage}
              </span>
            </div>
            {i < flow.length - 1 && (
              <div className="mx-1 h-[2px] flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: i < activeIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="h-full bg-evergreen-700"
                />
              </div>
            )}
          </div>
        );
      })}
      {isTerminal && (
        <span
          className={cn(
            "ml-3 rounded-full px-2.5 py-1 text-[10px] font-semibold",
            status === "Rejected"
              ? "bg-coral-100 text-coral-700 dark:bg-coral-900/30 dark:text-coral-300"
              : "bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400"
          )}
        >
          {status}
        </span>
      )}
    </div>
  );
}
