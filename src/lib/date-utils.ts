export interface DayCell {
  date: Date;
  iso: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + amount);
  return d;
}

export function monthLabel(date: Date): string {
  return MONTH_LABELS[date.getMonth()];
}

export function weekdayLabels(): string[] {
  return WEEKDAY_LABELS;
}

export function monthOptions(): string[] {
  return MONTH_LABELS;
}

/** Builds a 6-row x 7-col grid of DayCell for the month containing `date`. */
export function buildMonthGrid(date: Date, today: Date = new Date()): DayCell[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = Sun
  const gridStart = new Date(year, month, 1 - startOffset);

  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + i);
    cells.push({
      date: cellDate,
      iso: toISODate(cellDate),
      day: cellDate.getDate(),
      isCurrentMonth: cellDate.getMonth() === month,
      isToday: isSameDay(cellDate, today),
      isWeekend: cellDate.getDay() === 0 || cellDate.getDay() === 6,
    });
  }
  return cells;
}

export function formatFriendlyDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
