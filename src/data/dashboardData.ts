import {
  ActivityItem,
  ChartPoint,
  NotificationItem,
  UpcomingTraining,
} from "@/types/dashboard";

export const kpiRawData = {
  totalEnrolled: { value: 1284, trend: 8.2 },
  activePrograms: { value: 36, trend: 5.4 },
  upcomingEvents: { value: 12, trend: -3.1 },
  completionRate: { value: 78, trend: 4.6 },
  certificationsEarned: { value: 512, trend: 12.9 },
  skillGapIndex: { value: 23, trend: -6.4 },
};

export const completionTrend: ChartPoint[] = [
  { label: "Feb", value: 58 },
  { label: "Mar", value: 62 },
  { label: "Apr", value: 65 },
  { label: "May", value: 69 },
  { label: "Jun", value: 73 },
  { label: "Jul", value: 78 },
];

export const skillsDistribution: ChartPoint[] = [
  { label: "Technical", value: 38 },
  { label: "Leadership", value: 22 },
  { label: "Communication", value: 18 },
  { label: "Product", value: 14 },
  { label: "Compliance", value: 8 },
];

export const departmentProgress: ChartPoint[] = [
  { label: "Engineering", value: 82 },
  { label: "Sales", value: 64 },
  { label: "Marketing", value: 71 },
  { label: "Finance", value: 58 },
  { label: "HR", value: 89 },
  { label: "Operations", value: 66 },
];

export const learningHours: ChartPoint[] = [
  { label: "Feb", value: 420 },
  { label: "Mar", value: 512 },
  { label: "Apr", value: 486 },
  { label: "May", value: 610 },
  { label: "Jun", value: 705 },
  { label: "Jul", value: 742 },
];

export const monthlyParticipation: ChartPoint[] = [
  { label: "Feb", value: 210 },
  { label: "Mar", value: 265 },
  { label: "Apr", value: 240 },
  { label: "May", value: 298 },
  { label: "Jun", value: 331 },
  { label: "Jul", value: 356 },
];

export const recentActivities: ActivityItem[] = [
  {
    id: "act-01",
    type: "joined",
    employee: "Isha Malhotra",
    detail: "joined the \"Advanced React Patterns\" training",
    timeAgo: "12 minutes ago",
    department: "Engineering",
  },
  {
    id: "act-02",
    type: "certified",
    employee: "Farhan Sheikh",
    detail: "completed the AWS Cloud Practitioner certification",
    timeAgo: "48 minutes ago",
    department: "Engineering",
  },
  {
    id: "act-03",
    type: "workshop",
    employee: "Lavanya Iyer",
    detail: "attended the Conflict Resolution workshop",
    timeAgo: "2 hours ago",
    department: "Human Resources",
  },
  {
    id: "act-04",
    type: "assigned",
    employee: "Devraj Bose",
    detail: "was assigned \"Data Storytelling for Analysts\"",
    timeAgo: "3 hours ago",
    department: "Analytics",
  },
  {
    id: "act-05",
    type: "feedback",
    employee: "Ritika Chawla",
    detail: "received manager feedback on Q2 growth plan",
    timeAgo: "5 hours ago",
    department: "Marketing",
  },
  {
    id: "act-06",
    type: "certified",
    employee: "Omar Qureshi",
    detail: "completed the Scrum Master certification",
    timeAgo: "Yesterday",
    department: "Product",
  },
];

export const upcomingTrainings: UpcomingTraining[] = [
  {
    id: "trn-01",
    title: "Advanced React Patterns",
    trainer: "Sana Kapoor",
    date: "Jul 10, 2026",
    seatsTotal: 30,
    seatsFilled: 24,
    status: "Filling Fast",
  },
  {
    id: "trn-02",
    title: "Effective Delegation for Managers",
    trainer: "Arjun Malhotra",
    date: "Jul 12, 2026",
    seatsTotal: 25,
    seatsFilled: 25,
    status: "Full",
  },
  {
    id: "trn-03",
    title: "Cloud Fundamentals: Azure",
    trainer: "Neha Sinha",
    date: "Jul 18, 2026",
    seatsTotal: 40,
    seatsFilled: 12,
    status: "Open",
  },
  {
    id: "trn-04",
    title: "Storytelling with Data",
    trainer: "Rahul Verma",
    date: "Jul 21, 2026",
    seatsTotal: 20,
    seatsFilled: 9,
    status: "Open",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "ntf-01",
    kind: "certification-due",
    title: "3 certifications expiring soon",
    detail: "PMP, CISSP, and ITIL renewals are due within 30 days.",
    timeAgo: "Today",
  },
  {
    id: "ntf-02",
    kind: "certification-expired",
    title: "2 certificates have expired",
    detail: "Six Sigma Green Belt certificates need renewal.",
    timeAgo: "Yesterday",
  },
  {
    id: "ntf-03",
    kind: "learning-pending",
    title: "18 employees have pending learning",
    detail: "Assigned modules are overdue by more than 7 days.",
    timeAgo: "2 days ago",
  },
  {
    id: "ntf-04",
    kind: "manager-review",
    title: "5 manager reviews awaiting response",
    detail: "Growth plan feedback needs acknowledgement.",
    timeAgo: "3 days ago",
  },
];
