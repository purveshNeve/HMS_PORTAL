// Shared types for the Employee Dashboard

export interface DashboardEmployee {
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  designation: string;
  employmentType: string;
  workLocation: string;
  joiningDate: string | null;
  profileImage: string | null;
  manager: string;
  gender: string;
  monthlySalary: number;
  annualCTC: number;
  tenureYears: number;
  onLeave: boolean;
  leavesThisMonth: number;
  wfhThisMonth: number;
  payrollStatus: string;
  profileComplete: boolean;
  hasPhone: boolean;
  hasAddress: boolean;
  hasEmergencyContact: boolean;
  daysToAnniversary: number | null;
}

export interface DashboardKPIs {
  totalEmployees: number;
  totalMonthlyPayroll: number;
  totalAnnualCTC: number;
  avgMonthlySalary: number;
  avgTenure: number;
  remoteCount: number;
  officeCount: number;
  onLeaveCount: number;
  totalLeavesThisMonth: number;
  totalWFHThisMonth: number;
  incompleteProfiles: number;
  missingPhone: number;
  missingEmergencyContact: number;
  payrollSubmitted: number;
  payrollPending: number;
}

export interface DashboardCharts {
  salaryDistribution: { label: string; count: number }[];
  departmentBreakdown: {
    department: string;
    count: number;
    totalMonthlySalary: number;
    totalAnnualSalary: number;
  }[];
  employmentTypeDistribution: { type: string; count: number }[];
  designationSalaries: { designation: string; avgMonthly: number; count: number }[];
}

export interface DashboardInsights {
  highestPaid: DashboardEmployee[];
  lowestPaid: DashboardEmployee[];
  longestTenure: DashboardEmployee[];
  recentlyJoined: DashboardEmployee[];
  upcomingAnniversaries: (DashboardEmployee & { daysToAnniversary: number })[];
  incompleteProfileEmployees: DashboardEmployee[];
}

export interface DashboardData {
  ok: boolean;
  meta: { generatedAt: string; month: string };
  kpis: DashboardKPIs;
  charts: DashboardCharts;
  insights: DashboardInsights;
  employees: DashboardEmployee[];
}
