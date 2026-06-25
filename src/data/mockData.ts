import type {
  LeaveBalance, LeaveRequest, Holiday,
  TeamMember, Notification, CompOff,
} from '@/types/indexOriginal';

export const leaveBalances: LeaveBalance[] = [
  { type: 'Annual Leave',      total: 21, used: 9,  remaining: 12, expiry: '31 Dec 2025', carryForward: true,  status: 'Active',    unit: 'days' },
  { type: 'Casual Leave',      total: 8,  used: 3,  remaining: 5,  expiry: '31 Mar 2025', carryForward: false, status: 'Active',    unit: 'days' },
  { type: 'Sick Leave',        total: 12, used: 2,  remaining: 10, expiry: '31 Dec 2025', carryForward: false, status: 'Active',    unit: 'days' },
  { type: 'Maternity Leave',   total: 182,used: 0,  remaining: 182,expiry: 'N/A',         carryForward: false, status: 'N/A',       unit: 'days' },
  { type: 'Paternity Leave',   total: 15, used: 0,  remaining: 15, expiry: 'N/A',         carryForward: false, status: 'Active',    unit: 'days' },
  { type: 'Bereavement Leave', total: 5,  used: 0,  remaining: 5,  expiry: 'N/A',         carryForward: false, status: 'Active',    unit: 'days' },
  { type: 'Optional Holiday',  total: 2,  used: 1,  remaining: 1,  expiry: '31 Dec 2025', carryForward: false, status: 'Active',    unit: 'days' },
  { type: 'Comp Off',          total: 3,  used: 1,  remaining: 2,  expiry: '30 Jun 2025', carryForward: false, status: 'Active',    unit: 'days' },
  { type: 'Work From Home',    total: 52, used: 18, remaining: 34, expiry: '31 Dec 2025', carryForward: false, status: 'Active',    unit: 'quota' },
  { type: 'Unpaid Leave',      total: 0,  used: 0,  remaining: 0,  expiry: 'N/A',         carryForward: false, status: 'N/A',       unit: 'days' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'LR-2025-0041', type: 'Annual Leave',   startDate: '10 Jul 2025', endDate: '14 Jul 2025', duration: 5, appliedDate: '02 Jun 2025', approver: 'Anita Sharma',   status: 'Approved',  comments: 'Approved. Enjoy your break.' },
  { id: 'LR-2025-0038', type: 'Sick Leave',     startDate: '19 May 2025', endDate: '20 May 2025', duration: 2, appliedDate: '19 May 2025', approver: 'Anita Sharma',   status: 'Approved',  comments: 'Get well soon.' },
  { id: 'LR-2025-0034', type: 'Casual Leave',   startDate: '02 May 2025', endDate: '02 May 2025', duration: 1, appliedDate: '28 Apr 2025', approver: 'Anita Sharma',   status: 'Approved',  comments: '' },
  { id: 'LR-2025-0047', type: 'Annual Leave',   startDate: '28 Jul 2025', endDate: '01 Aug 2025', duration: 5, appliedDate: '10 Jun 2025', approver: 'Anita Sharma',   status: 'Pending',   comments: '' },
  { id: 'LR-2025-0029', type: 'Optional Holiday',startDate: '14 Apr 2025',endDate: '14 Apr 2025', duration: 1, appliedDate: '10 Apr 2025', approver: 'Anita Sharma',   status: 'Approved',  comments: '' },
  { id: 'LR-2025-0022', type: 'Casual Leave',   startDate: '15 Mar 2025', endDate: '15 Mar 2025', duration: 1, appliedDate: '14 Mar 2025', approver: 'Anita Sharma',   status: 'Rejected',  comments: 'Critical deliverable on this date.' },
  { id: 'LR-2025-0019', type: 'Work From Home', startDate: '10 Mar 2025', endDate: '14 Mar 2025', duration: 5, appliedDate: '08 Mar 2025', approver: 'Anita Sharma',   status: 'Approved',  comments: '' },
  { id: 'LR-2025-0049', type: 'Comp Off',       startDate: '18 Jun 2025', endDate: '18 Jun 2025', duration: 1, appliedDate: '15 Jun 2025', approver: 'Anita Sharma',   status: 'Pending',   comments: 'Awaiting approval.' },
];

export const holidays: Holiday[] = [
  { id: 'H01', name: 'Republic Day',                date: '26 Jan 2025', day: 'Sunday',    type: 'Public',   locations: ['All India'] },
  { id: 'H02', name: 'Holi',                        date: '14 Mar 2025', day: 'Friday',    type: 'Public',   locations: ['North India', 'West India'] },
  { id: 'H03', name: 'Good Friday',                 date: '18 Apr 2025', day: 'Friday',    type: 'Public',   locations: ['All India'] },
  { id: 'H04', name: 'Ram Navami',                  date: '06 Apr 2025', day: 'Sunday',    type: 'Optional', locations: ['North India'] },
  { id: 'H05', name: 'Labour Day',                  date: '01 May 2025', day: 'Thursday',  type: 'Public',   locations: ['All India'] },
  { id: 'H06', name: 'Independence Day',            date: '15 Aug 2025', day: 'Friday',    type: 'Public',   locations: ['All India'] },
  { id: 'H07', name: 'Ganesh Chaturthi',            date: '27 Aug 2025', day: 'Wednesday', type: 'Regional', locations: ['Maharashtra', 'Karnataka'] },
  { id: 'H08', name: 'Gandhi Jayanti',              date: '02 Oct 2025', day: 'Thursday',  type: 'Public',   locations: ['All India'] },
  { id: 'H09', name: 'Dussehra',                    date: '02 Oct 2025', day: 'Thursday',  type: 'Public',   locations: ['All India'] },
  { id: 'H10', name: 'Diwali',                      date: '20 Oct 2025', day: 'Monday',    type: 'Public',   locations: ['All India'] },
  { id: 'H11', name: 'Diwali (Laxmi Puja)',         date: '21 Oct 2025', day: 'Tuesday',   type: 'Company',  locations: ['All India'] },
  { id: 'H12', name: 'Christmas Day',               date: '25 Dec 2025', day: 'Thursday',  type: 'Public',   locations: ['All India'] },
  { id: 'H13', name: 'Year-End Shutdown',           date: '29 Dec 2025', day: 'Monday',    type: 'Shutdown', locations: ['All India'] },
  { id: 'H14', name: 'Year-End Shutdown',           date: '30 Dec 2025', day: 'Tuesday',   type: 'Shutdown', locations: ['All India'] },
  { id: 'H15', name: 'Year-End Shutdown',           date: '31 Dec 2025', day: 'Wednesday', type: 'Shutdown', locations: ['All India'] },
];

export const teamMembers: TeamMember[] = [
  { id: 'T01', name: 'Riya Mehta',      role: 'Product Designer',    initials: 'RM', color: '#4f46e5', onLeave: true,  leaveType: 'Annual Leave',  leaveUntil: '20 Jun 2025' },
  { id: 'T02', name: 'Arjun Verma',     role: 'Backend Engineer',    initials: 'AV', color: '#0891b2', onLeave: true,  leaveType: 'Sick Leave',    leaveUntil: '17 Jun 2025' },
  { id: 'T03', name: 'Priya Nair',      role: 'QA Engineer',         initials: 'PN', color: '#059669', onLeave: false },
  { id: 'T04', name: 'Karan Singh',     role: 'Frontend Engineer',   initials: 'KS', color: '#d97706', onLeave: false },
  { id: 'T05', name: 'Sneha Iyer',      role: 'Product Manager',     initials: 'SI', color: '#7c3aed', onLeave: false },
  { id: 'T06', name: 'Rahul Gupta',     role: 'Data Analyst',        initials: 'RG', color: '#b45309', onLeave: true,  leaveType: 'Work From Home',leaveUntil: '18 Jun 2025' },
  { id: 'T07', name: 'Deepa Krishnan',  role: 'DevOps Engineer',     initials: 'DK', color: '#0f766e', onLeave: false },
  { id: 'T08', name: 'Vivek Sharma',    role: 'Tech Lead',           initials: 'VS', color: '#9333ea', onLeave: false },
];

export const notifications: Notification[] = [
  { id: 'N01', type: 'success', message: 'Your Annual Leave request (LR-2025-0041) for 10–14 Jul has been approved by Anita Sharma.', time: '2 hours ago',   read: false },
  { id: 'N02', type: 'warning', message: 'Comp Off balance of 1 day is expiring on 30 Jun 2025. Apply before it lapses.',                time: '1 day ago',    read: false },
  { id: 'N03', type: 'info',    message: 'Company holiday: Diwali (Laxmi Puja) announced for 21 Oct 2025.',                              time: '3 days ago',   read: true  },
  { id: 'N04', type: 'warning', message: 'Casual Leave balance is at 5 days. No carry-forward allowed after 31 Mar 2025.',               time: '5 days ago',   read: true  },
  { id: 'N05', type: 'info',    message: 'Manager Anita Sharma commented on request LR-2025-0022: "Critical deliverable on this date."', time: '12 days ago',  read: true  },
];

export const compOffRecords: CompOff[] = [
  { id: 'CO-01', earnedOn: '15 Mar 2025', reason: 'Weekend deployment support',    days: 1, expiry: '14 Jun 2025', status: 'Available' },
  { id: 'CO-02', earnedOn: '22 Feb 2025', reason: 'Critical release weekend work', days: 1, expiry: '31 May 2025', status: 'Used'      },
  { id: 'CO-03', earnedOn: '01 Jan 2025', reason: 'Holiday on-call duty',          days: 1, expiry: '31 Mar 2025', status: 'Expired'   },
];

export const attendanceStats = {
  attendancePct:      94.2,
  leaveUtilizationPct: 42.9,
  avgMonthlyDays:     1.3,
  lateArrivals:       4,
  earlyDepartures:    2,
  wfhDaysUsed:        18,
  wfhDaysTotal:       52,
};

export const summaryCards = [
  { label: 'Annual Leave',       value: 12,  unit: 'days remaining', trend: -3, color: 'blue',   pct: 57 },
  { label: 'Sick Leave',         value: 10,  unit: 'days remaining', trend: -2, color: 'green',  pct: 83 },
  { label: 'Casual Leave',       value: 5,   unit: 'days remaining', trend: -3, color: 'violet', pct: 63 },
  { label: 'Optional Holidays',  value: 1,   unit: 'remaining',      trend: -1, color: 'amber',  pct: 50 },
  { label: 'Comp Off Balance',   value: 2,   unit: 'days available', trend: +1, color: 'teal',   pct: 67 },
  { label: 'WFH Days',           value: 34,  unit: 'remaining',      trend: -18,color: 'indigo', pct: 65 },
  { label: 'Pending Requests',   value: 2,   unit: 'awaiting approval',trend:0, color: 'orange', pct: null },
  { label: 'Approved This Year', value: 6,   unit: 'requests',       trend: 0,  color: 'slate',  pct: null },
];
