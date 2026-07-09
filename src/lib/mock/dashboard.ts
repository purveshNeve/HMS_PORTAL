// lib/mock/dashboard.ts
// Central mock data source for the Manager Dashboard.
// Every dataset is typed so swapping this for a real API response later
// is a drop-in replacement — components never read raw literals, only these types.

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export type TrendDirection = "up" | "down" | "flat";

export interface Trend {
  direction: TrendDirection;
  value: string; // e.g. "+4.2%"
  label: string; // e.g. "vs last week"
}

export type EmployeeStatus = "active" | "remote" | "on-leave";

export type AvailabilityStatus =
  | "available"
  | "busy"
  | "in-meeting"
  | "remote"
  | "offline";

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export interface ManagerProfile {
  name: string;
  firstName: string;
  role: string;
  avatarUrl?: string;
  unreadNotifications: number;
}

export const managerProfile: ManagerProfile = {
  name: "Ishan Rao",
  firstName: "Ishan",
  role: "Engineering Manager",
  unreadNotifications: 5,
};

export interface QuickActionItem {
  id: string;
  label: string;
  icon: "target" | "calendarPlus" | "fileBarChart" | "download";
}

export const quickActions: QuickActionItem[] = [
  { id: "assign-goal", label: "Assign Goal", icon: "target" },
  { id: "schedule-meeting", label: "Schedule Meeting", icon: "calendarPlus" },
  { id: "generate-report", label: "Generate Report", icon: "fileBarChart" },
  { id: "export-dashboard", label: "Export Dashboard", icon: "download" },
];

// ---------------------------------------------------------------------------
// KPI Stats
// ---------------------------------------------------------------------------

export type StatIconKey =
  | "users"
  | "userCheck"
  | "home"
  | "clock"
  | "target"
  | "star"
  | "alarmClock"
  | "activity";

export type StatColor = "blue" | "green" | "purple" | "amber" | "indigo" | "rose" | "orange" | "teal";

export interface StatCardData {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: StatIconKey;
  color: StatColor;
  trend: Trend;
}

export const statCards: StatCardData[] = [
  {
    id: "team-members",
    title: "Team Members",
    value: "48",
    description: "Across 4 sub-teams",
    icon: "users",
    color: "blue",
    trend: { direction: "up", value: "+2", label: "new this month" },
  },
  {
    id: "present-today",
    title: "Present Today",
    value: "42",
    description: "87.5% attendance",
    icon: "userCheck",
    color: "green",
    trend: { direction: "up", value: "+3.1%", label: "vs yesterday" },
  },
  {
    id: "working-remotely",
    title: "Working Remotely",
    value: "11",
    description: "22.9% of team",
    icon: "home",
    color: "purple",
    trend: { direction: "flat", value: "0%", label: "vs yesterday" },
  },
  {
    id: "pending-leave",
    title: "Pending Leave Requests",
    value: "6",
    description: "Awaiting your approval",
    icon: "clock",
    color: "amber",
    trend: { direction: "up", value: "+2", label: "since Monday" },
  },
  {
    id: "active-goals",
    title: "Active Goals",
    value: "34",
    description: "Q3 objectives in progress",
    icon: "target",
    color: "indigo",
    trend: { direction: "up", value: "+5", label: "vs last quarter" },
  },
  {
    id: "avg-performance",
    title: "Average Performance Rating",
    value: "4.3",
    description: "Out of 5.0",
    icon: "star",
    color: "teal",
    trend: { direction: "up", value: "+0.2", label: "vs last review" },
  },
  {
    id: "late-checkins",
    title: "Late Check-ins",
    value: "4",
    description: "Today, after 9:30 AM",
    icon: "alarmClock",
    color: "rose",
    trend: { direction: "down", value: "-2", label: "vs yesterday" },
  },
  {
    id: "team-productivity",
    title: "Team Productivity",
    value: "91%",
    description: "Based on goal velocity",
    icon: "activity",
    color: "orange",
    trend: { direction: "up", value: "+6%", label: "this week" },
  },
];

// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------

export interface WeeklyAttendancePoint {
  day: string;
  present: number;
  remote: number;
  absent: number;
}

export const weeklyAttendance: WeeklyAttendancePoint[] = [
  { day: "Mon", present: 38, remote: 9, absent: 1 },
  { day: "Tue", present: 40, remote: 8, absent: 0 },
  { day: "Wed", present: 36, remote: 10, absent: 2 },
  { day: "Thu", present: 41, remote: 7, absent: 0 },
  { day: "Fri", present: 42, remote: 11, absent: 1 },
  { day: "Sat", present: 18, remote: 4, absent: 0 },
  { day: "Sun", present: 6, remote: 2, absent: 0 },
];

export interface MonthlyProductivityPoint {
  month: string;
  productivity: number;
  target: number;
}

export const monthlyProductivity: MonthlyProductivityPoint[] = [
  { month: "Jan", productivity: 78, target: 80 },
  { month: "Feb", productivity: 81, target: 80 },
  { month: "Mar", productivity: 79, target: 82 },
  { month: "Apr", productivity: 84, target: 82 },
  { month: "May", productivity: 86, target: 84 },
  { month: "Jun", productivity: 83, target: 84 },
  { month: "Jul", productivity: 88, target: 86 },
  { month: "Aug", productivity: 90, target: 86 },
  { month: "Sep", productivity: 89, target: 88 },
  { month: "Oct", productivity: 92, target: 88 },
  { month: "Nov", productivity: 91, target: 90 },
  { month: "Dec", productivity: 94, target: 90 },
];

export interface DepartmentSlice {
  department: string;
  count: number;
  color: string; // hex, used directly by the pie chart cells
}

export const departmentDistribution: DepartmentSlice[] = [
  { department: "Engineering", count: 18, color: "#6366f1" },
  { department: "HR", count: 5, color: "#22c55e" },
  { department: "Finance", count: 6, color: "#f59e0b" },
  { department: "Marketing", count: 7, color: "#ec4899" },
  { department: "Sales", count: 9, color: "#0ea5e9" },
  { department: "Support", count: 3, color: "#14b8a6" },
];

// ---------------------------------------------------------------------------
// Team overview table
// ---------------------------------------------------------------------------

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  role: string;
  department: string;
  attendance: number; // percentage
  currentGoal: string;
  performance: number; // 0-5
  status: EmployeeStatus;
}

export const teamMembers: TeamMember[] = [
  {
    id: "emp-1",
    name: "Rahul Mehta",
    initials: "RM",
    role: "Senior Frontend Engineer",
    department: "Engineering",
    attendance: 96,
    currentGoal: "Ship design-system v2",
    performance: 4.6,
    status: "active",
  },
  {
    id: "emp-2",
    name: "Sarah Thomas",
    initials: "ST",
    role: "Product Designer",
    department: "Engineering",
    attendance: 88,
    currentGoal: "Reduce onboarding drop-off",
    performance: 4.2,
    status: "remote",
  },
  {
    id: "emp-3",
    name: "Vikram Nair",
    initials: "VN",
    role: "Backend Engineer",
    department: "Engineering",
    attendance: 91,
    currentGoal: "Migrate to event-driven API",
    performance: 4.0,
    status: "active",
  },
  {
    id: "emp-4",
    name: "Priya Sharma",
    initials: "PS",
    role: "HR Business Partner",
    department: "HR",
    attendance: 100,
    currentGoal: "Launch wellness program",
    performance: 4.5,
    status: "active",
  },
  {
    id: "emp-5",
    name: "Aditya Kulkarni",
    initials: "AK",
    role: "Financial Analyst",
    department: "Finance",
    attendance: 79,
    currentGoal: "Automate expense reporting",
    performance: 3.7,
    status: "on-leave",
  },
  {
    id: "emp-6",
    name: "Neha Verma",
    initials: "NV",
    role: "Marketing Lead",
    department: "Marketing",
    attendance: 94,
    currentGoal: "Grow qualified pipeline 20%",
    performance: 4.4,
    status: "remote",
  },
  {
    id: "emp-7",
    name: "Karan Malhotra",
    initials: "KM",
    role: "Sales Executive",
    department: "Sales",
    attendance: 85,
    currentGoal: "Close 12 enterprise deals",
    performance: 4.1,
    status: "active",
  },
  {
    id: "emp-8",
    name: "Ishita Bansal",
    initials: "IB",
    role: "Support Specialist",
    department: "Support",
    attendance: 90,
    currentGoal: "Improve CSAT to 95%",
    performance: 4.3,
    status: "active",
  },
];

// ---------------------------------------------------------------------------
// Pending approvals
// ---------------------------------------------------------------------------

export type ApprovalType =
  | "Leave Request"
  | "Expense Claim"
  | "WFH Request"
  | "Promotion Approval";

export interface PendingApproval {
  id: string;
  employeeName: string;
  initials: string;
  type: ApprovalType;
  submittedOn: string;
  detail: string;
}

export const pendingApprovals: PendingApproval[] = [
  {
    id: "appr-1",
    employeeName: "Aditya Kulkarni",
    initials: "AK",
    type: "Leave Request",
    submittedOn: "Jul 7, 2026",
    detail: "5 days · Family event",
  },
  {
    id: "appr-2",
    employeeName: "Neha Verma",
    initials: "NV",
    type: "Expense Claim",
    submittedOn: "Jul 6, 2026",
    detail: "₹12,400 · Client travel",
  },
  {
    id: "appr-3",
    employeeName: "Karan Malhotra",
    initials: "KM",
    type: "WFH Request",
    submittedOn: "Jul 8, 2026",
    detail: "2 days · Home relocation",
  },
  {
    id: "appr-4",
    employeeName: "Rahul Mehta",
    initials: "RM",
    type: "Promotion Approval",
    submittedOn: "Jul 5, 2026",
    detail: "Senior → Staff Engineer",
  },
];

// ---------------------------------------------------------------------------
// Goal progress
// ---------------------------------------------------------------------------

export interface GoalProgressData {
  quarterLabel: string;
  completionPercent: number;
  completed: number;
  pending: number;
  overdue: number;
}

export const goalProgress: GoalProgressData = {
  quarterLabel: "Q3 2026",
  completionPercent: 68,
  completed: 23,
  pending: 9,
  overdue: 2,
};

// ---------------------------------------------------------------------------
// Team availability
// ---------------------------------------------------------------------------

export interface AvailabilityEntry {
  id: string;
  name: string;
  initials: string;
  status: AvailabilityStatus;
}

export const teamAvailability: AvailabilityEntry[] = [
  { id: "av-1", name: "Rahul Mehta", initials: "RM", status: "available" },
  { id: "av-2", name: "Sarah Thomas", initials: "ST", status: "remote" },
  { id: "av-3", name: "Vikram Nair", initials: "VN", status: "in-meeting" },
  { id: "av-4", name: "Priya Sharma", initials: "PS", status: "available" },
  { id: "av-5", name: "Aditya Kulkarni", initials: "AK", status: "offline" },
  { id: "av-6", name: "Neha Verma", initials: "NV", status: "busy" },
  { id: "av-7", name: "Karan Malhotra", initials: "KM", status: "available" },
  { id: "av-8", name: "Ishita Bansal", initials: "IB", status: "in-meeting" },
];

export const availabilityMeta: Record<
  AvailabilityStatus,
  { label: string; colorClass: string }
> = {
  available: { label: "Available", colorClass: "bg-emerald-500" },
  busy: { label: "Busy", colorClass: "bg-rose-500" },
  "in-meeting": { label: "In Meeting", colorClass: "bg-amber-500" },
  remote: { label: "Remote", colorClass: "bg-indigo-500" },
  offline: { label: "Offline", colorClass: "bg-slate-300" },
};

// ---------------------------------------------------------------------------
// Recent activity
// ---------------------------------------------------------------------------

export type ActivityType =
  | "check-in"
  | "leave"
  | "approval"
  | "training"
  | "goal";

export interface ActivityItem {
  id: string;
  actor: string;
  initials: string;
  description: string;
  type: ActivityType;
  timestamp: string; // relative label
}

export const recentActivity: ActivityItem[] = [
  {
    id: "act-1",
    actor: "John Abraham",
    initials: "JA",
    description: "checked in for the day",
    type: "check-in",
    timestamp: "5 min ago",
  },
  {
    id: "act-2",
    actor: "Sarah Thomas",
    initials: "ST",
    description: "submitted a leave request",
    type: "leave",
    timestamp: "32 min ago",
  },
  {
    id: "act-3",
    actor: "You",
    initials: "AR",
    description: "approved Priya Sharma's attendance correction",
    type: "approval",
    timestamp: "1 hr ago",
  },
  {
    id: "act-4",
    actor: "Ishita Bansal",
    initials: "IB",
    description: "completed 'Advanced Customer Support' training",
    type: "training",
    timestamp: "2 hr ago",
  },
  {
    id: "act-5",
    actor: "Vikram Nair",
    initials: "VN",
    description: "updated progress on 'Migrate to event-driven API'",
    type: "goal",
    timestamp: "3 hr ago",
  },
];

// ---------------------------------------------------------------------------
// Upcoming meetings
// ---------------------------------------------------------------------------

export interface MeetingItem {
  id: string;
  time: string;
  title: string;
  participants: string[];
  type: "1:1" | "Team Sync" | "Review" | "Interview";
  day: "today" | "tomorrow";
}

export const upcomingMeetings: MeetingItem[] = [
  {
    id: "mtg-1",
    time: "10:00 AM",
    title: "Sprint Planning",
    participants: ["RM", "VN", "ST"],
    type: "Team Sync",
    day: "today",
  },
  {
    id: "mtg-2",
    time: "2:00 PM",
    title: "1:1 with Aditya Kulkarni",
    participants: ["AK"],
    type: "1:1",
    day: "today",
  },
  {
    id: "mtg-3",
    time: "4:30 PM",
    title: "Q3 Performance Review",
    participants: ["NV", "KM"],
    type: "Review",
    day: "today",
  },
  {
    id: "mtg-4",
    time: "9:30 AM",
    title: "Candidate Interview — Frontend Role",
    participants: ["ST", "RM"],
    type: "Interview",
    day: "tomorrow",
  },
  {
    id: "mtg-5",
    time: "3:00 PM",
    title: "Design System Review",
    participants: ["ST", "IB"],
    type: "Review",
    day: "tomorrow",
  },
];

// ---------------------------------------------------------------------------
// Birthdays & anniversaries
// ---------------------------------------------------------------------------

export interface BirthdayEntry {
  id: string;
  name: string;
  initials: string;
  department: string;
  date: string;
}

export const upcomingBirthdays: BirthdayEntry[] = [
  { id: "bday-1", name: "Sarah Thomas", initials: "ST", department: "Engineering", date: "Jul 12" },
  { id: "bday-2", name: "Karan Malhotra", initials: "KM", department: "Sales", date: "Jul 15" },
  { id: "bday-3", name: "Ishita Bansal", initials: "IB", department: "Support", date: "Jul 21" },
];

export interface AnniversaryEntry {
  id: string;
  name: string;
  initials: string;
  years: number;
  date: string;
}

export const workAnniversaries: AnniversaryEntry[] = [
  { id: "ann-1", name: "Vikram Nair", initials: "VN", years: 5, date: "Jul 10" },
  { id: "ann-2", name: "Priya Sharma", initials: "PS", years: 3, date: "Jul 18" },
  { id: "ann-3", name: "Rahul Mehta", initials: "RM", years: 2, date: "Jul 27" },
];

// ---------------------------------------------------------------------------
// AI insights
// ---------------------------------------------------------------------------

export type InsightTone = "positive" | "neutral" | "warning";

export interface AIInsight {
  id: string;
  tone: InsightTone;
  text: string;
}

export const aiInsights: AIInsight[] = [
  {
    id: "insight-1",
    tone: "positive",
    text: "Team attendance improved by 12% compared to last month, led by the Engineering sub-team.",
  },
  {
    id: "insight-2",
    tone: "positive",
    text: "Three employees exceeded their quarterly goals ahead of schedule — consider recognition.",
  },
  {
    id: "insight-3",
    tone: "warning",
    text: "Two employees show a dip in engagement scores and may benefit from a check-in this week.",
  },
  {
    id: "insight-4",
    tone: "neutral",
    text: "Productivity increased 6% this week, driven by faster goal-completion velocity.",
  },
];

// ---------------------------------------------------------------------------
// Manager snapshot
// ---------------------------------------------------------------------------

export interface SnapshotMetric {
  id: string;
  label: string;
  value: number; // percentage 0-100
  colorClass: string;
}

export const managerSnapshot: SnapshotMetric[] = [
  { id: "snap-1", label: "Average Team Rating", value: 86, colorClass: "stroke-indigo-500" },
  { id: "snap-2", label: "Employee Satisfaction", value: 91, colorClass: "stroke-emerald-500" },
  { id: "snap-3", label: "Goal Achievement Rate", value: 78, colorClass: "stroke-blue-500" },
  { id: "snap-4", label: "Training Completion", value: 64, colorClass: "stroke-amber-500" },
  { id: "snap-5", label: "Attrition Risk", value: 14, colorClass: "stroke-rose-500" },
];

// ---------------------------------------------------------------------------
// Quick access
// ---------------------------------------------------------------------------

export interface QuickAccessItem {
  id: string;
  label: string;
  icon:
    | "users"
    | "calendarCheck"
    | "planeTakeoff"
    | "wallet"
    | "trendingUp"
    | "userPlus"
    | "graduationCap"
    | "calendarDays"
    | "folder";
  href: string;
}

export const quickAccessItems: QuickAccessItem[] = [
  { id: "qa-1", label: "My Team", icon: "users", href: "/team" },
  { id: "qa-2", label: "Attendance", icon: "calendarCheck", href: "/attendance" },
  { id: "qa-3", label: "Leaves", icon: "planeTakeoff", href: "/leaves" },
  { id: "qa-4", label: "Payroll", icon: "wallet", href: "/payroll" },
  { id: "qa-5", label: "Performance", icon: "trendingUp", href: "/performance" },
  { id: "qa-6", label: "Recruitment", icon: "userPlus", href: "/recruitment" },
  { id: "qa-7", label: "Training", icon: "graduationCap", href: "/training" },
  { id: "qa-8", label: "Calendar", icon: "calendarDays", href: "/calendar" },
  { id: "qa-9", label: "Documents", icon: "folder", href: "/documents" },
];

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------

export type AnnouncementCategory =
  | "Company Update"
  | "HR Notification"
  | "Policy Change"
  | "Training Program";

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  date: string;
  summary: string;
}

export const announcements: Announcement[] = [
  {
    id: "ann-notice-1",
    title: "Q3 town hall scheduled for Jul 20",
    category: "Company Update",
    date: "Jul 8, 2026",
    summary: "Leadership will share Q3 results and roadmap priorities.",
  },
  {
    id: "ann-notice-2",
    title: "Updated hybrid work policy",
    category: "Policy Change",
    date: "Jul 5, 2026",
    summary: "Minimum in-office days change from 2 to 3 starting August.",
  },
  {
    id: "ann-notice-3",
    title: "Open enrollment for benefits",
    category: "HR Notification",
    date: "Jul 3, 2026",
    summary: "Review and update your benefits elections before Jul 31.",
  },
  {
    id: "ann-notice-4",
    title: "New leadership training cohort",
    category: "Training Program",
    date: "Jul 1, 2026",
    summary: "Applications open for the Q4 leadership development track.",
  },
];

// ---------------------------------------------------------------------------
// Mini calendar
// ---------------------------------------------------------------------------

export type CalendarEventType = "meeting" | "leave" | "deadline";

export interface CalendarDayEvent {
  date: number; // day of month
  type: CalendarEventType;
  label: string;
}

export const miniCalendarEvents: CalendarDayEvent[] = [
  { date: 9, type: "meeting", label: "Sprint Planning" },
  { date: 10, type: "deadline", label: "Q3 goal check-in due" },
  { date: 12, type: "leave", label: "Sarah Thomas — Leave" },
  { date: 15, type: "meeting", label: "Performance Reviews" },
  { date: 18, type: "leave", label: "Aditya Kulkarni — Leave" },
  { date: 22, type: "deadline", label: "Expense reports due" },
  { date: 27, type: "meeting", label: "Town Hall" },
];
