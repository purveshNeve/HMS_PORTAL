import type { JobRole, Candidate, Offer, ActivityItem } from "./types";

export const departments = [
  "Engineering",
  "Product",
  "Design",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
  "Customer Success",
  "Operations",
  "Legal",
];

export const avatar = (seed: string) =>
  `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;

// ---------------------------------------------------------------------------
// KPI summary for the executive dashboard
// ---------------------------------------------------------------------------
export const kpiSummary = {
  openPositions: { value: 84, delta: 6.2, trend: "up" as const },
  activeRecruitments: { value: 57, delta: 3.1, trend: "up" as const },
  applicationsReceived: { value: 5482, delta: 14.8, trend: "up" as const },
  candidatesShortlisted: { value: 963, delta: 9.4, trend: "up" as const },
  interviewsScheduled: { value: 214, delta: -2.3, trend: "down" as const },
  offersReleased: { value: 96, delta: 11.2, trend: "up" as const },
  offersAccepted: { value: 71, delta: 4.6, trend: "up" as const },
  hiringSuccessRate: { value: 73.9, delta: 2.1, trend: "up" as const },
  avgTimeToHire: { value: 27, delta: -3.4, trend: "down" as const },
  avgCostPerHire: { value: 84500, delta: -1.8, trend: "down" as const },
};

export const monthlyHiringTrend = [
  { month: "Jan", applications: 320, hires: 18, offers: 24 },
  { month: "Feb", applications: 410, hires: 22, offers: 29 },
  { month: "Mar", applications: 388, hires: 19, offers: 26 },
  { month: "Apr", applications: 452, hires: 27, offers: 33 },
  { month: "May", applications: 501, hires: 31, offers: 38 },
  { month: "Jun", applications: 476, hires: 24, offers: 30 },
  { month: "Jul", applications: 540, hires: 34, offers: 41 },
  { month: "Aug", applications: 498, hires: 29, offers: 35 },
  { month: "Sep", applications: 560, hires: 38, offers: 45 },
  { month: "Oct", applications: 612, hires: 41, offers: 49 },
  { month: "Nov", applications: 589, hires: 36, offers: 43 },
  { month: "Dec", applications: 634, hires: 44, offers: 52 },
];

export const departmentHiring = [
  { department: "Engineering", openings: 26, hires: 61 },
  { department: "Sales", openings: 14, hires: 45 },
  { department: "Product", openings: 9, hires: 22 },
  { department: "Design", openings: 6, hires: 15 },
  { department: "Marketing", openings: 8, hires: 19 },
  { department: "Customer Success", openings: 11, hires: 27 },
  { department: "Finance", openings: 5, hires: 12 },
  { department: "Operations", openings: 5, hires: 14 },
];

export const pipelineFunnel = [
  { stage: "Applied", value: 5482 },
  { stage: "Screening", value: 2967 },
  { stage: "Shortlisted", value: 963 },
  { stage: "Interview", value: 512 },
  { stage: "Offer", value: 96 },
  { stage: "Joined", value: 71 },
];

export const offerAcceptance = [
  { name: "Accepted", value: 71, color: "#227A5F" },
  { name: "Rejected", value: 14, color: "#D4573D" },
  { name: "Negotiating", value: 7, color: "#C9A24B" },
  { name: "Expired", value: 4, color: "#9FADA4" },
];

export const sourceAnalytics = [
  { source: "LinkedIn", value: 2140, color: "#0B2B26" },
  { source: "Referral", value: 1180, color: "#227A5F" },
  { source: "Career Portal", value: 980, color: "#71B19C" },
  { source: "Job Boards", value: 760, color: "#C9A24B" },
  { source: "Agency", value: 422, color: "#E2725B" },
];

export const recruiterPerformance = [
  { recruiter: "Ananya Rao", hires: 24, avgDays: 22, satisfaction: 4.8 },
  { recruiter: "Karan Mehta", hires: 19, avgDays: 26, satisfaction: 4.6 },
  { recruiter: "Priya Nair", hires: 21, avgDays: 24, satisfaction: 4.7 },
  { recruiter: "Devika Sen", hires: 15, avgDays: 31, satisfaction: 4.3 },
  { recruiter: "Rohan Kapoor", hires: 17, avgDays: 29, satisfaction: 4.5 },
];

export const recentActivity: ActivityItem[] = [
  { id: "a1", type: "application", title: "New application from Isha Kulkarni", subtitle: "Senior Frontend Engineer · Engineering", time: "2026-06-30T09:12:00" },
  { id: "a2", type: "interview", title: "Technical round scheduled with Farhan Sheikh", subtitle: "Backend Engineer · with Ananya Rao", time: "2026-06-30T08:40:00" },
  { id: "a3", type: "offer", title: "Offer released to Meera Iyer", subtitle: "Product Designer · ₹18.5L CTC", time: "2026-06-29T17:05:00" },
  { id: "a4", type: "closed", title: "Position closed — Growth Marketer", subtitle: "Marketing · 3 openings filled", time: "2026-06-29T14:22:00" },
  { id: "a5", type: "application", title: "New application from Vikram Suri", subtitle: "DevOps Engineer · Engineering", time: "2026-06-29T11:03:00" },
  { id: "a6", type: "interview", title: "HR round completed with Sneha Bhatt", subtitle: "Customer Success Lead", time: "2026-06-28T16:47:00" },
  { id: "a7", type: "offer", title: "Offer accepted by Arjun Nambiar", subtitle: "Staff Engineer · Joining Aug 18", time: "2026-06-28T10:11:00" },
];

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------
const roleTitles = [
  ["Senior Frontend Engineer", "Engineering", ["React", "TypeScript", "Next.js"]],
  ["Backend Engineer", "Engineering", ["Node.js", "PostgreSQL", "AWS"]],
  ["DevOps Engineer", "Engineering", ["Kubernetes", "Terraform", "CI/CD"]],
  ["Staff Engineer", "Engineering", ["System Design", "Go", "Distributed Systems"]],
  ["Product Manager", "Product", ["Roadmapping", "SQL", "Agile"]],
  ["Associate Product Manager", "Product", ["User Research", "Analytics"]],
  ["Product Designer", "Design", ["Figma", "Design Systems", "Prototyping"]],
  ["UX Researcher", "Design", ["User Interviews", "Usability Testing"]],
  ["Enterprise Account Executive", "Sales", ["SaaS Sales", "Negotiation", "CRM"]],
  ["Sales Development Rep", "Sales", ["Outbound", "Cold Calling", "HubSpot"]],
  ["Growth Marketer", "Marketing", ["SEO", "Paid Media", "Content Strategy"]],
  ["Brand Designer", "Marketing", ["Illustration", "Branding", "Motion"]],
  ["Financial Analyst", "Finance", ["Forecasting", "Excel", "FP&A"]],
  ["HR Business Partner", "Human Resources", ["Employee Relations", "Policy"]],
  ["Customer Success Manager", "Customer Success", ["Onboarding", "Retention"]],
  ["Operations Manager", "Operations", ["Process Design", "Vendor Mgmt"]],
  ["Corporate Counsel", "Legal", ["Contracts", "Compliance"]],
  ["QA Automation Engineer", "Engineering", ["Cypress", "Playwright", "CI"]],
  ["Data Scientist", "Engineering", ["Python", "ML", "SQL"]],
  ["Technical Recruiter", "Human Resources", ["Sourcing", "ATS", "Interviewing"]],
] as const;

const managers = [
  "Ananya Rao", "Karan Mehta", "Priya Nair", "Devika Sen", "Rohan Kapoor",
  "Aditya Verma", "Nisha Pillai", "Siddharth Rao", "Kavya Menon", "Arjun Bose",
];

const priorities: JobRole["priority"][] = ["Critical", "High", "Medium", "Low"];
const statuses: JobRole["status"][] = ["Open", "On Hold", "Closed", "Draft", "Pending Approval"];
const employmentTypes: JobRole["employmentType"][] = ["Full-Time", "Part-Time", "Contract", "Internship"];
const locations = ["Mumbai, IN", "Bengaluru, IN", "Pune, IN", "Remote", "Gurugram, IN", "Hyderabad, IN"];

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const jobRoles: JobRole[] = Array.from({ length: 32 }).map((_, i) => {
  const [title, department, skills] = roleTitles[i % roleTitles.length];
  const r = (n: number) => seededRand(i * 13.37 + n);
  const openings = Math.max(1, Math.round(r(1) * 6));
  const filled = Math.min(openings, Math.round(r(2) * openings));
  const salaryMin = 8 + Math.round(r(3) * 20);
  return {
    id: `role-${i + 1}`,
    title: `${title}${i >= roleTitles.length ? " II" : ""}`,
    department,
    hiringManager: managers[i % managers.length],
    managerAvatar: avatar(managers[i % managers.length]),
    openings,
    filled,
    applications: Math.round(40 + r(4) * 460),
    priority: priorities[i % priorities.length],
    experience: `${1 + (i % 6)}-${4 + (i % 6)} yrs`,
    employmentType: employmentTypes[i % employmentTypes.length],
    salaryMin: salaryMin * 100000,
    salaryMax: (salaryMin + 6 + Math.round(r(5) * 10)) * 100000,
    location: locations[i % locations.length],
    remote: i % 3 === 0,
    status: filled >= openings ? "Closed" : statuses[i % statuses.length],
    postedOn: new Date(2026, 4, (i % 28) + 1).toISOString(),
    deadline: new Date(2026, 7, (i % 28) + 1).toISOString(),
    skills: [...skills],
    version: 1 + (i % 4),
  };
});

// ---------------------------------------------------------------------------
// Candidates
// ---------------------------------------------------------------------------
const candidateNames = [
  "Isha Kulkarni", "Farhan Sheikh", "Meera Iyer", "Vikram Suri", "Sneha Bhatt",
  "Arjun Nambiar", "Divya Krishnan", "Rahul Chawla", "Ananya Ghosh", "Tarun Malhotra",
  "Pooja Deshmukh", "Kabir Ahluwalia", "Neha Srinivasan", "Yash Oberoi", "Simran Kaur",
  "Aditi Rangan", "Manav Chopra", "Ritika Sanghvi", "Aarav Bhatia", "Shreya Pandit",
  "Nikhil D'Souza", "Lavanya Reddy", "Harsh Vardhan", "Ishita Trivedi", "Sameer Khanna",
  "Radhika Shetty", "Dev Patel", "Anushka Bajaj", "Rohit Talwar", "Kritika Joshi",
];

const educations = [
  "B.Tech, IIT Bombay", "M.S. Computer Science, BITS Pilani", "MBA, IIM Ahmedabad",
  "B.Des, NID Ahmedabad", "B.Com, Narsee Monjee", "M.Tech, IIT Delhi",
  "BBA, Symbiosis Pune", "B.Sc, Delhi University", "MCA, VIT Vellore", "B.Tech, NIT Trichy",
];

const pipelineStages: Candidate["stage"][] = [
  "Applied", "Screening", "Shortlisted", "Interview Scheduled", "Technical Round",
  "HR Round", "Selected", "Rejected", "Offer Released", "Joined",
];

const sources = ["LinkedIn", "Referral", "Career Portal", "Job Boards", "Agency"];

export const candidates: Candidate[] = Array.from({ length: 60 }).map((_, i) => {
  const role = jobRoles[i % jobRoles.length];
  const r = (n: number) => seededRand(i * 7.77 + n);
  const name = candidateNames[i % candidateNames.length] + (i >= candidateNames.length ? ` ${Math.floor(i / candidateNames.length) + 1}` : "");
  return {
    id: `cand-${i + 1}`,
    name,
    avatar: avatar(name + i),
    positionApplied: role.title,
    department: role.department,
    experience: `${1 + (i % 8)} yrs`,
    skills: role.skills.slice(0, 2 + (i % 2)),
    education: educations[i % educations.length],
    applicationDate: new Date(2026, 5, 1 + (i % 30)).toISOString(),
    matchScore: 55 + Math.round(r(1) * 44),
    stage: pipelineStages[i % pipelineStages.length],
    source: sources[i % sources.length],
    location: locations[i % locations.length],
    email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@mailbox.com`,
    phone: `+91 9${Math.floor(100000000 + r(2) * 800000000)}`,
    rating: Math.round((3 + r(3) * 2) * 10) / 10,
    tags: i % 4 === 0 ? ["Top Talent"] : i % 5 === 0 ? ["Fast Track"] : [],
    resumeSummary: `${1 + (i % 8)} years building products in ${role.department.toLowerCase()}, strong background in ${role.skills[0]} and ${role.skills[1] ?? role.skills[0]}. Known for shipping reliably and mentoring junior team members.`,
  };
});

// ---------------------------------------------------------------------------
// Offers
// ---------------------------------------------------------------------------
const offerStatuses: Offer["status"][] = [
  "Draft", "Pending Approval", "Approved", "Sent", "Viewed",
  "Accepted", "Rejected", "Negotiating", "Expired",
];

export const offers: Offer[] = Array.from({ length: 24 }).map((_, i) => {
  const cand = candidates[i % candidates.length];
  const r = (n: number) => seededRand(i * 5.55 + n);
  return {
    id: `offer-${i + 1}`,
    candidateName: cand.name,
    avatar: cand.avatar,
    position: cand.positionApplied,
    department: cand.department,
    salaryOffered: (10 + Math.round(r(1) * 25)) * 100000,
    joiningDate: new Date(2026, 7, 1 + (i % 28)).toISOString(),
    status: offerStatuses[i % offerStatuses.length],
    negotiationStatus: i % 4 === 0 ? "In Progress" : i % 3 === 0 ? "Resolved" : "None",
    sentOn: new Date(2026, 5, 5 + (i % 20)).toISOString(),
    expiresOn: new Date(2026, 6, 5 + (i % 20)).toISOString(),
    approvalStage: i % 3 === 0 ? "Awaiting CFO" : i % 2 === 0 ? "Awaiting HRBP" : "Complete",
    recruiter: managers[i % managers.length],
  };
});

export const offerStats = {
  acceptanceRate: 74,
  avgNegotiationDays: 4.2,
  avgTimeToSign: 3.1,
  pendingOffers: offers.filter((o) => ["Sent", "Viewed", "Negotiating", "Pending Approval"].includes(o.status)).length,
};
