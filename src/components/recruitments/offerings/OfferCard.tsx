"use client";

import { motion } from "framer-motion";
import { FileDown, Send, Ban, CalendarClock, RotateCcw, FileSignature } from "lucide-react";
import { Offer } from "@/lib/types";
import StatusBadge from "@/components/ui/StatusBadge";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { OfferStatusTimeline } from "./OfferStatusTimeline";
import { formatCurrency, cn } from "@/lib/utils";

export function OfferCard({
  offer,
  index,
  onSend,
  onDownload,
  onRevoke,
  onExtend,
  onResend,
  onGenerateLetter,
}: {
  offer: Offer;
  index: number;
  onSend: () => void;
  onDownload: () => void;
  onRevoke: () => void;
  onExtend: () => void;
  onResend: () => void;
  onGenerateLetter: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -3 }}
      className="card-surface p-5 transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <img src={offer.avatar} alt={offer.candidateName} className="h-11 w-11 rounded-xl object-cover" />
          <div>
            <p className="font-display text-[15px] font-semibold text-ink-900 dark:text-ink-50">{offer.candidateName}</p>
            <p className="text-xs text-ink-400">{offer.position} · {offer.department}</p>
          </div>
        </div>
        <ActionMenu
          items={[
            { label: "Generate Offer Letter", icon: FileSignature, onClick: onGenerateLetter },
            { label: "Send Offer", icon: Send, onClick: onSend },
            { label: "Download PDF", icon: FileDown, onClick: onDownload },
            { label: "Extend Deadline", icon: CalendarClock, onClick: onExtend },
            { label: "Resend Offer", icon: RotateCcw, onClick: onResend },
            { label: "Revoke Offer", icon: Ban, onClick: onRevoke, danger: true },
          ]}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-ink-50/70 p-3 text-center dark:bg-ink-800/40">
        <div>
          <p className="font-mono text-sm font-semibold text-ink-800 dark:text-ink-100">{formatCurrency(offer.salaryOffered)}</p>
          <p className="text-[10px] uppercase tracking-wide text-ink-400">CTC / yr</p>
        </div>
        <div>
          <p className="font-mono text-sm font-semibold text-ink-800 dark:text-ink-100">{offer.joiningDate.slice(0, 10)}</p>
          <p className="text-[10px] uppercase tracking-wide text-ink-400">Joining</p>
        </div>
        <div>
          <p className={cn("font-mono text-sm font-semibold", offer.negotiationStatus === "In Progress" ? "text-gold-600" : "text-ink-800 dark:text-ink-100")}>
            {offer.negotiationStatus}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-ink-400">Negotiation</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <OfferStatusTimeline status={offer.status} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3 dark:border-ink-700">
        <span className="text-[11px] text-ink-400">Recruiter: {offer.recruiter}</span>
        <StatusBadge status={offer.status} />
      </div>
    </motion.div>
  );
}
