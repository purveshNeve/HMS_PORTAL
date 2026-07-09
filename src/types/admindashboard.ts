// types/dashboard.ts
// Shared type definitions for the Admin Dashboard.
// Replace/extend these as your real Employee/Department/Payroll models evolve.

export type TrendDirection = "up" | "down" | "flat";

export interface StatCardData {
  id: string;
  label: string;
  value: number;
  format?: "number" | "currency" | "percent";
  trend?: TrendDirection;
  deltaLabel?: string; // e.g. "+6 this month"
  icon: string; // lucide icon name, mapped in StatsCard
  accent: "indigo" | "emerald" | "amber" | "sky" | "rose" | "violet" | "teal" | "slate";
}

export interface OverviewResponse {
  stats: StatCardData[];
  lastUpdated: string; // ISO timestamp
}

export interface EmployeeGrowthPoint {
  month: string;
  employees: number;
}

export interface DepartmentSlice {
  name: string;
  value: number;
  color: string;
}

export interface WorkforceResponse {
  growth: EmployeeGrowthPoint[];
  departments: DepartmentSlice[];
}

export interface RecruitmentSummary {
  applicationsReceived: number;
  applicationsDelta: string;
  interviewsScheduled: number;
  interviewsDelta: string;
  offersSent: number;
  offersDelta: string;
  hiringSuccessRate: number; // percent
}

export interface RecruitmentTrendPoint {
  month: string;
  applications: number;
  interviews: number;
  offers: number;
}

export interface RecruitmentResponse {
  summary: RecruitmentSummary;
  trend: RecruitmentTrendPoint[];
}

export interface AttendanceBreakdown {
  present: number;
  absent: number;
  late: number;
  workFromHome: number;
}

export interface LeaveStatus {
  pending: number;
  approved: number;
  rejected: number;
  onLeaveToday: number;
}

export interface AttendanceResponse {
  attendance: AttendanceBreakdown;
  leave: LeaveStatus;
}

export interface PayrollSummary {
  totalMonthlyPayroll: number;
  averageSalary: number;
  nextProcessingDate: string; // ISO date
}

export interface PayrollTrendPoint {
  month: string;
  amount: number;
}

export interface PayrollResponse {
  summary: PayrollSummary;
  trend: PayrollTrendPoint[];
}

export interface GenderSlice {
  name: string;
  value: number;
  color: string;
}

export interface EmploymentTypeBreakdown {
  fullTime: number;
  interns: number;
  contract: number;
  remote: number;
}

export interface EmployeeInsightsResponse {
  genderDistribution: GenderSlice[];
  employmentType: EmploymentTypeBreakdown;
  averageExperienceYears: number;
  averageAge: number;
  averagePerformanceScore: number; // out of 5
}

export type ActivityType =
  | "employee_added"
  | "department_created"
  | "leave_approved"
  | "interview_scheduled"
  | "payroll_processed"
  | "performance_review";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  actor: string;
  description: string;
  timestamp: string; // ISO
  status: "success" | "info" | "warning" | "pending";
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  avatarUrl?: string;
  department: string;
  role: string;
  manager: string;
  status: "active" | "onleave" | "inactive";
  joiningDate: string; // ISO
}

export interface UpcomingEvent {
  id: string;
  category: "birthday" | "anniversary" | "interview" | "meeting" | "company_event";
  title: string;
  subtitle?: string;
  date: string; // ISO
}

export interface PerformanceMetric {
  id: string;
  label: string;
  value: number; // 0-100
  deltaLabel?: string;
}

export interface OrgHealthMetric {
  id: string;
  label: string;
  value: number; // 0-100
  status: "good" | "warning" | "critical";
}

export interface NotificationItem {
  id: string;
  label: string;
  count: number;
  severity: "info" | "warning" | "critical";
}

export interface SystemStatusInfo {
  totalRecords: number;
  lastBackup: string; // ISO
  serverStatus: "operational" | "degraded" | "down";
  apiStatus: "operational" | "degraded" | "down";
  version: string;
}

// Discriminated map from section name -> response shape, used by the generic hook/fetcher.
export interface DashboardSectionMap {
  overview: OverviewResponse;
  workforce: WorkforceResponse;
  recruitment: RecruitmentResponse;
  attendance: AttendanceResponse;
  payroll: PayrollResponse;
  insights: EmployeeInsightsResponse;
  activities: ActivityItem[];
  employees: Employee[];
  events: UpcomingEvent[];
  performance: PerformanceMetric[];
  orgHealth: OrgHealthMetric[];
  notifications: NotificationItem[];
  system: SystemStatusInfo;
}

export type DashboardSection = keyof DashboardSectionMap;
