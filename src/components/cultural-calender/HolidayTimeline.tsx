"use client";

import { motion } from "framer-motion";
import { Holiday } from "@/types/calendar";
import { formatFriendlyDate } from "@/lib/date-utils";
import Modal from "@/components/ui/Modal";
import { useEffect, useState } from "react";

const tagColors = ["#3730E0", "#E8A33D", "#F0665A", "#4C8B62", "#5B7FDB", "#1E9E8C", "#E0578A", "#34406B"];

export default function HolidayTimeline({ holidays }: { holidays: Holiday[] }) {
  const [openForm, setForm] = useState(false);
  const [localHolidays, setLocalHolidays] = useState<Holiday[]>(holidays);
  const [newHoliday, setNewHoliday] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalHolidays(holidays);
  }, [holidays]);

  const handleSaveHoliday = async () => {
    if (!newHoliday.title.trim() || !newHoliday.date || !newHoliday.description.trim()) {
      return alert("Please fill all required fields.");
    }

    setSaving(true);
    try {
      const response = await fetch("/api/adminDashboard/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newHoliday.title,
          date: newHoliday.date,
          description: newHoliday.description,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || "Failed to save holiday");
      }

      const data = await response.json();
      const createdHoliday = data.holiday;
      const mappedHoliday: Holiday = {
        id: createdHoliday.id || createdHoliday.holidayId || `holiday-${Date.now()}`,
        name: createdHoliday.title,
        date: typeof createdHoliday.date === "string"
          ? createdHoliday.date.slice(0, 10)
          : new Date(createdHoliday.date).toISOString().slice(0, 10),
        description: createdHoliday.description || "",
        icon: "🏖️",
        category: "Holiday",
      };

      setLocalHolidays((current) => [mappedHoliday, ...current]);
      setNewHoliday({ title: "", date: "", description: "" });
      setForm(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unable to save holiday");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">Company Holidays</h2>
      <button onClick={() => setForm(true)}>Add Holiday</button>

      <Modal open={openForm} onClose={() => setForm(false)} title="Add Holiday" size="md">
        <div className="space-y-5">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Holiday Title
            <input
              value={newHoliday.title}
              onChange={(e) => setNewHoliday({ ...newHoliday, title: e.target.value })}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
              placeholder="e.g. Republic Day"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ink">
            Date
            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ink">
            Description
            <textarea
              value={newHoliday.description}
              onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })}
              className="min-h-[120px] w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigoink"
              placeholder="Add a short description for the holiday"
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
              onClick={handleSaveHoliday}
              disabled={saving}
              className="rounded-full bg-indigoink px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Holiday"}
            </button>
          </div>
        </div>
      </Modal>

      <div className="relative rounded-xl2 border border-line bg-card p-5 shadow-soft sm:p-6">
        <div className="absolute bottom-6 left-[26px] top-6 w-px bg-line sm:left-[30px]" />
        <ul className="space-y-5">
          {localHolidays.map((h, i) => (
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
