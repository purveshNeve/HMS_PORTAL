// lib/icon-map.tsx
// Maps the string icon keys stored in mock data to actual lucide-react components.
// Keeping this separate means mock data stays pure data (serializable, API-ready)
// while components still get real icon elements.

import {
  Users,
  UserCheck,
  Home,
  Clock,
  Target,
  Star,
  AlarmClock,
  Activity,
  CalendarCheck,
  PlaneTakeoff,
  Wallet,
  TrendingUp,
  UserPlus,
  GraduationCap,
  CalendarDays,
  Folder,
  type LucideIcon,
} from "lucide-react";
import type { StatIconKey, QuickAccessItem } from "@/lib/mock/dashboard";

export const statIconMap: Record<StatIconKey, LucideIcon> = {
  users: Users,
  userCheck: UserCheck,
  home: Home,
  clock: Clock,
  target: Target,
  star: Star,
  alarmClock: AlarmClock,
  activity: Activity,
};

export const quickAccessIconMap: Record<QuickAccessItem["icon"], LucideIcon> = {
  users: Users,
  calendarCheck: CalendarCheck,
  planeTakeoff: PlaneTakeoff,
  wallet: Wallet,
  trendingUp: TrendingUp,
  userPlus: UserPlus,
  graduationCap: GraduationCap,
  calendarDays: CalendarDays,
  folder: Folder,
};

// Tailwind-safe color classes for KPI icon backgrounds.
// Written out fully (not templated) so Tailwind's compiler can detect them.
export const statColorClasses: Record<
  string,
  { bg: string; text: string }
> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-emerald-50", text: "text-emerald-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  teal: { bg: "bg-teal-50", text: "text-teal-600" },
};
