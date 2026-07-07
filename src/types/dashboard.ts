import { ReactNode } from "react";

export interface KpiCardData {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  trend: number; // signed percentage
  trendLabel: string;
  icon: ReactNode;
  from: string;
  to: string;
}

export type ActivityType =
  | "joined"
  | "certified"
  | "workshop"
  | "assigned"
  | "feedback";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  employee: string;
  detail: string;
  timeAgo: string;
  department: string;
}

export type TrainingStatus = "Open" | "Filling Fast" | "Full" | "Completed";

export interface UpcomingTraining {
  id: string;
  title: string;
  trainer: string;
  date: string;
  seatsTotal: number;
  seatsFilled: number;
  status: TrainingStatus;
}

export type NotificationKind =
  | "certification-due"
  | "certification-expired"
  | "learning-pending"
  | "manager-review";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  timeAgo: string;
}

export interface ChartPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}
