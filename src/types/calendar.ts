export type EventCategory =
  | "Workshop"
  | "Festival"
  | "Holiday"
  | "CSR"
  | "Training"
  | "Sports"
  | "Birthday"
  | "Town Hall"
  | "Volunteer"
  | "Celebration";

export interface CategoryStyle {
  label: EventCategory;
  bg: string;
  text: string;
  dot: string;
}

export interface CulturalEvent {
  id: string;
  title: string;
  emoji: string;
  date: string; // ISO yyyy-mm-dd
  time: string;
  endTime?: string;
  venue: string;
  organizer: string;
  department: string;
  description: string;
  category: EventCategory;
  participants: number;
  dressCode?: string;
  image?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  description: string;
  icon: string;
  category: EventCategory;
}

export interface Birthday {
  id: string;
  name: string;
  department: string;
  date: string;
  initials: string;
}

export type CalendarView = "month" | "week" | "agenda";
