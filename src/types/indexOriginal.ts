export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Withdrawn';
export type LeaveType =
  | 'Annual Leave'
  | 'Casual Leave'
  | 'Sick Leave'
  | 'Maternity Leave'
  | 'Paternity Leave'
  | 'Bereavement Leave'
  | 'Optional Holiday'
  | 'Comp Off'
  | 'Work From Home'
  | 'Unpaid Leave';

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
  expiry: string;
  carryForward: boolean;
  status: 'Active' | 'Exhausted' | 'N/A';
  unit: 'days' | 'quota';
}

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  duration: number;
  appliedDate: string;
  approver: string;
  status: LeaveStatus;
  comments: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  day: string;
  type: 'Public' | 'Company' | 'Regional' | 'Optional' | 'Shutdown';
  locations: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  onLeave: boolean;
  leaveType?: string;
  leaveUntil?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  time: string;
  read: boolean;
}

export interface CompOff {
  id: string;
  earnedOn: string;
  reason: string;
  days: number;
  expiry: string;
  status: 'Available' | 'Used' | 'Expired';
}
