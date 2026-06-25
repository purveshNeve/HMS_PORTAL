export const employeeData = {
  name: "Arjun Mehta",
  id: "EMP-8651",
  designation: "Senior Software Engineer",
  department: "Engineering",
  grade: "L5",
  employmentType: "Full-Time",
  joiningDate: "2021-03-15",
};

export const compensationSummary = {
  currentMonthlySalary: 125000,
  annualCTC: 1800000,
  baseSalary: 900000,
  variablePay: 180000,
  lastSalaryCreditedDate: "2026-05-31",
  nextSalaryCreditDate: "2026-06-30",
  salaryRevisionDate: "2026-04-01",
  employmentType: "Full-Time",
  grade: "L5 / Senior",
  payrollStatus: "Active",
};

export const salaryBreakdown = {
  earnings: [
    { label: "Basic Pay", monthly: 50000, annual: 600000 },
    { label: "House Rent Allowance (HRA)", monthly: 20000, annual: 240000 },
    { label: "Special Allowance", monthly: 25000, annual: 300000 },
    { label: "Medical Allowance", monthly: 3000, annual: 36000 },
    { label: "Transport Allowance", monthly: 3200, annual: 38400 },
    { label: "Internet Allowance", monthly: 1500, annual: 18000 },
    { label: "Performance Bonus", monthly: 15000, annual: 180000 },
    { label: "Overtime Pay", monthly: 0, annual: 0 },
    { label: "Other Allowances", monthly: 2300, annual: 27600 },
  ],
  deductions: [
    { label: "Provident Fund (PF)", monthly: 6000, annual: 72000 },
    { label: "Professional Tax", monthly: 200, annual: 2400 },
    { label: "Income Tax (TDS)", monthly: 8500, annual: 102000 },
    { label: "Insurance Deduction", monthly: 1200, annual: 14400 },
    { label: "Other Deductions", monthly: 300, annual: 3600 },
  ],
};

export const payslips = [
  { id: 1, month: "May", year: 2026, status: "Processed", creditedDate: "2026-05-31" },
  { id: 2, month: "April", year: 2026, status: "Processed", creditedDate: "2026-04-30" },
  { id: 3, month: "March", year: 2026, status: "Processed", creditedDate: "2026-03-31" },
  { id: 4, month: "February", year: 2026, status: "Processed", creditedDate: "2026-02-28" },
  { id: 5, month: "January", year: 2026, status: "Processed", creditedDate: "2026-01-31" },
  { id: 6, month: "December", year: 2025, status: "Processed", creditedDate: "2025-12-31" },
  { id: 7, month: "November", year: 2025, status: "Processed", creditedDate: "2025-11-30" },
  { id: 8, month: "October", year: 2025, status: "Processed", creditedDate: "2025-10-31" },
  { id: 9, month: "September", year: 2025, status: "Processed", creditedDate: "2025-09-30" },
  { id: 10, month: "August", year: 2025, status: "Processed", creditedDate: "2025-08-31" },
  { id: 11, month: "July", year: 2025, status: "Processed", creditedDate: "2025-07-31" },
  { id: 12, month: "June", year: 2025, status: "Processed", creditedDate: "2025-06-30" },
];

export const reimbursements = [
  {
    id: 1,
    claimType: "Travel",
    amount: 4500,
    submissionDate: "2026-05-20",
    status: "Approved",
    approvedAmount: 4500,
    paymentDate: "2026-05-31",
    remarks: "Client visit to Pune",
  },
  {
    id: 2,
    claimType: "Internet",
    amount: 999,
    submissionDate: "2026-05-01",
    status: "Approved",
    approvedAmount: 999,
    paymentDate: "2026-05-31",
    remarks: "Monthly broadband bill",
  },
  {
    id: 3,
    claimType: "Training",
    amount: 12000,
    submissionDate: "2026-04-15",
    status: "Pending",
    approvedAmount: 0,
    paymentDate: "-",
    remarks: "AWS certification course",
  },
  {
    id: 4,
    claimType: "Medical",
    amount: 3200,
    submissionDate: "2026-04-02",
    status: "Approved",
    approvedAmount: 3000,
    paymentDate: "2026-04-30",
    remarks: "Partial approval – within policy limit",
  },
  {
    id: 5,
    claimType: "Food",
    amount: 850,
    submissionDate: "2026-03-28",
    status: "Rejected",
    approvedAmount: 0,
    paymentDate: "-",
    remarks: "Receipts missing",
  },
  {
    id: 6,
    claimType: "Office Supplies",
    amount: 1750,
    submissionDate: "2026-03-10",
    status: "Approved",
    approvedAmount: 1750,
    paymentDate: "2026-03-31",
    remarks: "Keyboard and mouse",
  },
];

export const benefits = {
  health: [
    {
      name: "Medical Insurance",
      status: "Active",
      coverage: "₹5,00,000",
      renewalDate: "2027-01-01",
      description: "Comprehensive family floater plan covering hospitalization, surgery, and critical illness.",
    },
    {
      name: "Dental Coverage",
      status: "Active",
      coverage: "₹25,000",
      renewalDate: "2027-01-01",
      description: "Annual dental care including cleaning, fillings, and orthodontic consultation.",
    },
    {
      name: "Vision Coverage",
      status: "Active",
      coverage: "₹10,000",
      renewalDate: "2027-01-01",
      description: "Covers prescription glasses, contact lenses, and annual eye exams.",
    },
  ],
  financial: [
    {
      name: "Provident Fund",
      status: "Active",
      coverage: "12% of Basic",
      renewalDate: "Ongoing",
      description: "Employer contributes 12% of basic salary to your EPF account monthly.",
    },
    {
      name: "Gratuity",
      status: "Active",
      coverage: "As per Gratuity Act",
      renewalDate: "On Separation",
      description: "Payable after 5 years of continuous service at 15/26 × basic × years.",
    },
    {
      name: "Pension Scheme",
      status: "Active",
      coverage: "8.33% of Basic",
      renewalDate: "Ongoing",
      description: "Employee Pension Scheme (EPS) contribution managed by EPFO.",
    },
  ],
  work: [
    {
      name: "Work From Home Allowance",
      status: "Active",
      coverage: "₹3,000 / month",
      renewalDate: "Ongoing",
      description: "Monthly allowance for home office setup and utilities.",
    },
    {
      name: "Internet Reimbursement",
      status: "Active",
      coverage: "₹1,500 / month",
      renewalDate: "Ongoing",
      description: "Reimbursement for broadband or mobile data expenses.",
    },
    {
      name: "Learning Budget",
      status: "Active",
      coverage: "₹50,000 / year",
      renewalDate: "2027-03-31",
      description: "Annual budget for courses, books, and conferences.",
    },
    {
      name: "Certification Sponsorship",
      status: "Active",
      coverage: "Up to ₹20,000",
      renewalDate: "2027-03-31",
      description: "Full or partial sponsorship for approved industry certifications.",
    },
  ],
  additional: [
    {
      name: "Gym Membership",
      status: "Active",
      coverage: "₹2,000 / month",
      renewalDate: "2026-12-31",
      description: "Subsidised membership at partner gyms and fitness centres.",
    },
    {
      name: "Wellness Program",
      status: "Active",
      coverage: "₹5,000 / year",
      renewalDate: "2026-12-31",
      description: "Covers yoga, meditation apps, and wellness workshops.",
    },
    {
      name: "Employee Discounts",
      status: "Active",
      coverage: "Up to 30%",
      renewalDate: "Ongoing",
      description: "Exclusive discounts on partner brands, travel, and electronics.",
    },
    {
      name: "Employee Assistance Program",
      status: "Active",
      coverage: "Free – 8 sessions",
      renewalDate: "Ongoing",
      description: "Confidential counselling for mental health and personal challenges.",
    },
  ],
};

export const taxInfo = {
  panNumber: "BNZPM1234K",
  taxRegime: "New Regime",
  annualTaxPaid: 102000,
  tdsDeducted: 8500,
  taxSavingInvestments: 150000,
};

export const bankingInfo = {
  bankName: "HDFC Bank",
  accountNumber: "XXXX XXXX 4821",
  ifscCode: "HDFC0001234",
  accountType: "Savings",
  status: "Active",
};

export const bonuses = [
  { type: "Performance Bonus", amount: 90000, date: "2026-04-15", status: "Paid" },
  { type: "Quarterly Bonus", amount: 25000, date: "2026-04-01", status: "Paid" },
  { type: "Referral Bonus", amount: 15000, date: "2025-11-01", status: "Paid" },
  { type: "Spot Award", amount: 10000, date: "2025-08-20", status: "Paid" },
];

export const payrollTimeline = [
  { step: "Payroll Generated", date: "25 May 2026", status: "completed" },
  { step: "Payroll Approved", date: "27 May 2026", status: "completed" },
  { step: "Salary Processed", date: "29 May 2026", status: "completed" },
  { step: "Salary Credited", date: "31 May 2026", status: "completed" },
];

export const salaryHistory = [
  { year: "FY 2021-22", ctc: 1200000 },
  { year: "FY 2022-23", ctc: 1440000 },
  { year: "FY 2023-24", ctc: 1620000 },
  { year: "FY 2024-25", ctc: 1710000 },
  { year: "FY 2025-26", ctc: 1800000 },
];

export const notifications = [
  {
    id: 1,
    type: "success",
    title: "Salary Credited",
    message: "Your May 2026 salary of ₹1,08,800 has been credited to your account.",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "info",
    title: "Form 16 Available",
    message: "Your Form 16 for FY 2025-26 is now available for download.",
    time: "1 day ago",
  },
  {
    id: 3,
    type: "success",
    title: "Reimbursement Approved",
    message: "Travel reimbursement claim of ₹4,500 has been approved.",
    time: "3 days ago",
  },
  {
    id: 4,
    type: "info",
    title: "Insurance Renewed",
    message: "Your medical insurance policy has been renewed for FY 2026-27.",
    time: "1 week ago",
  },
];
