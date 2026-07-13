"use client";

import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import { CulturalEvent } from "@/types/calendar";
import { formatShortDate } from "@/lib/date-utils";
import CategoryBadge from "./CategoryBadge";
import Modal from "@/components/ui/Modal";
import { useEffect, useMemo, useState } from "react";
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
  const [localEvents, setLocalEvents] = useState<CulturalEvent[]>(events);
  const [openForm, setForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CulturalEvent>>({
    title: "",
    emoji: "🎉",
    date: "",
    time: "",
    venue: "",
    organizer: "",
    department: "",
    description: "",
    category: "Workshop",
    participants: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  const handleSaveEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.venue || !newEvent.organizer || !newEvent.description || !newEvent.department) {
      return alert("Please fill all required fields.");
    }

    setSaving(true);
    try {
      const response = await fetch("/api/adminDashboard/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          emoji: newEvent.emoji,
          date: newEvent.date,
          time: newEvent.time,
          venue: newEvent.venue,
          organizer: newEvent.organizer,
          department: newEvent.department,
          description: newEvent.description,
          category: newEvent.category,
          participants: Number(newEvent.participants ?? 0),
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || "Failed to save event");
      }

      const data = await response.json();
      const savedEvent = data.event as any;
      const savedEventWithId = {
        ...savedEvent,
        id:
          savedEvent.id || savedEvent._id?.toString?.() || savedEvent.eventId || `event-${Date.now()}`,
        date:
          typeof savedEvent.date === "string"
            ? savedEvent.date
            : new Date(savedEvent.date).toISOString().slice(0, 10),
      } as CulturalEvent;
      setLocalEvents((current) => [savedEventWithId, ...current]);
      setNewEvent({
        title: "",
        emoji: "🎉",
        date: "",
        time: "",
        venue: "",
        organizer: "",
        department: "",
        description: "",
        category: "Workshop",
        participants: 0,
      });
      setForm(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unable to save event");
    } finally {
      setSaving(false);
    }
  };

  const eventOptions = [
    "Workshop",
    "Festival",
    "Holiday",
    "CSR",
    "Training",
    "Sports",
    "Birthday",
    "Town Hall",
    "Volunteer",
    "Celebration",
  ] as const;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Upcoming Events</h2>
        <button onClick={() => setForm(true)}>Add Event</button>
      </div>
      
      {openForm && (
        <Modal open={openForm} onClose={() => setForm(false)} title="Add Event" size="lg">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Title
                <input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                  placeholder="Event title"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Emoji
                <input
                  value={newEvent.emoji}
                  onChange={(e) => setNewEvent({ ...newEvent, emoji: e.target.value })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                  placeholder="🎉"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Date
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Time
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Venue
                <input
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                  placeholder="Event location"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Organizer
                <input
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                  placeholder="Organizer name"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Department
                <input
                  value={newEvent.department}
                  onChange={(e) => setNewEvent({ ...newEvent, department: e.target.value })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                  placeholder="Department"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Participants
                <input
                  type="number"
                  min={0}
                  value={newEvent.participants ?? 0}
                  onChange={(e) => setNewEvent({ ...newEvent, participants: Number(e.target.value) })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
                Category
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                >
                  {eventOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-ink">
              Description
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="min-h-[120px] w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
                placeholder="Write a short event description"
              />
            </label>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setForm(false)}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEvent}
                disabled={saving}
                className="rounded-full bg-indigoink px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Event"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {localEvents.map((event, i) => (
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
                <span className="rounded-full bg-gradient-to-r from-indigoink to-slateblue px-3 py-1.5 text-[11px] font-semibold text-black">
                  Learn More
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      <span className="text-xs text-muted">Scroll for more →</span>
    </div>
  );
}
