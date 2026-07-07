"use client";

import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import { CulturalEvent } from "@/types/calendar";
import { formatShortDate } from "@/lib/date-utils";
import CategoryBadge from "./CategoryBadge";

const bannerGradients: Record<string, string> = {
  Workshop: "linear-gradient(135deg,#3730E0,#5B4FF0)",
  Festival: "linear-gradient(135deg,#E8A33D,#F2BE6E)",
  Holiday: "linear-gradient(135deg,#F0665A,#F5897F)",
  CSR: "linear-gradient(135deg,#4C8B62,#6FAE84)",
  Training: "linear-gradient(135deg,#5B7FDB,#7C9BEB)",
  Sports: "linear-gradient(135deg,#1E9E8C,#3FBBA9)",
  Birthday: "linear-gradient(135deg,#E0578A,#EC85AA)",
  "Town Hall": "linear-gradient(135deg,#34406B,#4F5D8F)",
  Volunteer: "linear-gradient(135deg,#4C8B62,#6FAE84)",
  Celebration: "linear-gradient(135deg,#D9457A,#EC85AA)",
};

export default function UpcomingEvents({
  events,
  onSelectEvent,
}: {
  events: CulturalEvent[];
  onSelectEvent: (e: CulturalEvent) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Upcoming Events</h2>
        <span className="text-xs text-muted">Scroll for more →</span>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {events.map((event, i) => (
          <motion.button
            key={event.id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            onClick={() => onSelectEvent(event)}
            className="w-72 shrink-0 overflow-hidden rounded-xl2 border border-line bg-card text-left shadow-soft"
          >
            <div
              className="flex h-28 items-center justify-center text-4xl"
              style={{ backgroundImage: bannerGradients[event.category] }}
            >
              {event.emoji}
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <CategoryBadge category={event.category} />
                <span className="text-[11px] font-medium text-muted">
                  {formatShortDate(event.date)}
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-ink">{event.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                {event.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {event.participants}
                  </span>
                </div>
                <span className="rounded-full bg-gradient-to-r from-indigoink to-slateblue px-3 py-1.5 text-[11px] font-semibold text-white">
                  Learn More
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
