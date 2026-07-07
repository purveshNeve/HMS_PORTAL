"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Clock, MapPin, User, Users, Building2, Shirt } from "lucide-react";
import { CulturalEvent } from "@/types/calendar";
import { categoryStyles } from "@/lib/category-styles";
import { formatFriendlyDate } from "@/lib/date-utils";
import CategoryBadge from "./CategoryBadge";

export default function EventModal({
  event,
  onClose,
}: {
  event: CulturalEvent | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-xl2 border border-line bg-card shadow-soft"
          >
            <div
              className="relative flex h-40 items-end overflow-hidden rounded-t-xl2 p-5"
              style={{
                backgroundImage: `linear-gradient(135deg, ${categoryColor(event, "from")}, ${categoryColor(event, "to")})`,
              }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-15" style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 60%, white 0, transparent 35%)",
              }} />
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative z-10">
                <div className="text-4xl">{event.emoji}</div>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                  {event.title}
                </h2>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <CategoryBadge category={event.category} size="md" />
                <span className="text-xs font-medium text-muted">
                  {formatFriendlyDate(event.date)}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-muted">{event.description}</p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoRow icon={<Clock className="h-4 w-4" />} label="Time">
                  {event.time}
                  {event.endTime ? ` – ${event.endTime}` : ""}
                </InfoRow>
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Venue">
                  {event.venue}
                </InfoRow>
                <InfoRow icon={<User className="h-4 w-4" />} label="Organizer">
                  {event.organizer}
                </InfoRow>
                <InfoRow icon={<Building2 className="h-4 w-4" />} label="Department">
                  {event.department}
                </InfoRow>
                <InfoRow icon={<Users className="h-4 w-4" />} label="Participants">
                  {event.participants} attending
                </InfoRow>
                {event.dressCode && (
                  <InfoRow icon={<Shirt className="h-4 w-4" />} label="Dress Code">
                    {event.dressCode}
                  </InfoRow>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  onClick={onClose}
                  className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
                >
                  Close
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full bg-indigoink px-4 py-2 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-paper/70 p-2.5">
      <span className="mt-0.5 text-muted">{icon}</span>
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">
          {label}
        </div>
        <div className="text-sm font-medium text-ink">{children}</div>
      </div>
    </div>
  );
}

const categoryColorMap: Record<string, { from: string; to: string }> = {
  Workshop: { from: "#3730E0", to: "#5B4FF0" },
  Festival: { from: "#E8A33D", to: "#F2BE6E" },
  Holiday: { from: "#F0665A", to: "#F5897F" },
  CSR: { from: "#4C8B62", to: "#6FAE84" },
  Training: { from: "#5B7FDB", to: "#7C9BEB" },
  Sports: { from: "#1E9E8C", to: "#3FBBA9" },
  Birthday: { from: "#E0578A", to: "#EC85AA" },
  "Town Hall": { from: "#34406B", to: "#4F5D8F" },
  Volunteer: { from: "#4C8B62", to: "#6FAE84" },
  Celebration: { from: "#D9457A", to: "#EC85AA" },
};

function categoryColor(event: CulturalEvent, key: "from" | "to") {
  return categoryColorMap[event.category]?.[key] ?? "#3730E0";
}
