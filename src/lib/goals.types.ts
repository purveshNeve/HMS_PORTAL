export type GoalStatus = "not_started" | "in_progress" | "completed" | "at_risk" | "on_hold";
export type GoalCategory = "performance" | "learning" | "project" | "personal" | "team";
export type GoalPriority = "low" | "medium" | "high";

export interface GoalMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface GoalComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number; // 0–100
  startDate: string;
  dueDate: string;
  milestones: GoalMilestone[];
  comments: GoalComment[];
  tags: string[];
  managerApproved: boolean;
}

export const STATUS_LABELS: Record<GoalStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
  at_risk: "At Risk",
  on_hold: "On Hold",
};

export const STATUS_COLORS: Record<GoalStatus, string> = {
  not_started: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  at_risk: "bg-red-100 text-red-700",
  on_hold: "bg-amber-100 text-amber-700",
};

export const PRIORITY_COLORS: Record<GoalPriority, string> = {
  low: "bg-gray-100 text-gray-500",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-600",
};

export const CATEGORY_LABELS: Record<GoalCategory, string> = {
  performance: "Performance",
  learning: "Learning & Development",
  project: "Project",
  personal: "Personal",
  team: "Team",
};

export const PROGRESS_BAR_COLOR: Record<GoalStatus, string> = {
  not_started: "bg-gray-300",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  at_risk: "bg-red-500",
  on_hold: "bg-amber-400",
};

export const DEFAULT_GOALS: Goal[] = [
  {
    id: "g1",
    title: "Complete React & Next.js Advanced Certification",
    description:
      "Finish the advanced React and Next.js course on Udemy and obtain the certification to strengthen front-end development skills.",
    category: "learning",
    status: "in_progress",
    priority: "high",
    progress: 65,
    startDate: "2025-01-15",
    dueDate: "2025-06-30",
    milestones: [
      { id: "m1", title: "Complete React Hooks module", dueDate: "2025-02-28", completed: true },
      { id: "m2", title: "Finish Next.js App Router section", dueDate: "2025-04-15", completed: true },
      { id: "m3", title: "Build capstone project", dueDate: "2025-06-01", completed: false },
      { id: "m4", title: "Pass certification exam", dueDate: "2025-06-30", completed: false },
    ],
    comments: [
      { id: "c1", author: "Manager", text: "Great progress! Keep it up.", date: "2025-04-10" },
      { id: "c2", author: "You", text: "Completed the App Router module ahead of schedule.", date: "2025-04-08" },
    ],
    tags: ["react", "nextjs", "certification"],
    managerApproved: true,
  },
  {
    id: "g2",
    title: "Deliver Q2 Customer Dashboard Feature",
    description:
      "Design, develop, and deploy the new customer analytics dashboard as part of the Q2 product roadmap.",
    category: "project",
    status: "at_risk",
    priority: "high",
    progress: 40,
    startDate: "2025-03-01",
    dueDate: "2025-06-15",
    milestones: [
      { id: "m5", title: "Finalise design mockups", dueDate: "2025-03-20", completed: true },
      { id: "m6", title: "API integration", dueDate: "2025-04-30", completed: false },
      { id: "m7", title: "QA & testing", dueDate: "2025-05-31", completed: false },
      { id: "m8", title: "Production deployment", dueDate: "2025-06-15", completed: false },
    ],
    comments: [
      {
        id: "c3",
        author: "Manager",
        text: "API delays are blocking progress. Please flag blockers early.",
        date: "2025-05-02",
      },
    ],
    tags: ["dashboard", "frontend", "Q2"],
    managerApproved: true,
  },
  {
    id: "g3",
    title: "Improve Code Review Participation",
    description:
      "Actively participate in at least 3 code reviews per week to improve code quality and team collaboration.",
    category: "performance",
    status: "completed",
    priority: "medium",
    progress: 100,
    startDate: "2025-01-01",
    dueDate: "2025-03-31",
    milestones: [
      { id: "m9", title: "Review 10 PRs in January", dueDate: "2025-01-31", completed: true },
      { id: "m10", title: "Review 12 PRs in February", dueDate: "2025-02-28", completed: true },
      { id: "m11", title: "Review 15 PRs in March", dueDate: "2025-03-31", completed: true },
    ],
    comments: [],
    tags: ["code-review", "collaboration"],
    managerApproved: true,
  },
  {
    id: "g4",
    title: "Mentor Junior Developer",
    description:
      "Conduct weekly 1:1 sessions with the new junior developer to help them onboard and grow their technical skills.",
    category: "team",
    status: "in_progress",
    priority: "medium",
    progress: 50,
    startDate: "2025-02-01",
    dueDate: "2025-07-31",
    milestones: [
      { id: "m12", title: "Set up onboarding plan", dueDate: "2025-02-07", completed: true },
      { id: "m13", title: "First monthly check-in", dueDate: "2025-03-01", completed: true },
      { id: "m14", title: "Mid-point review", dueDate: "2025-05-01", completed: false },
      { id: "m15", title: "Final assessment", dueDate: "2025-07-31", completed: false },
    ],
    comments: [],
    tags: ["mentoring", "team"],
    managerApproved: false,
  },
  {
    id: "g5",
    title: "Complete AWS Cloud Practitioner Course",
    description: "Enrol and complete the AWS Cloud Practitioner Essentials course to gain cloud fundamentals.",
    category: "learning",
    status: "not_started",
    priority: "low",
    progress: 0,
    startDate: "2025-07-01",
    dueDate: "2025-09-30",
    milestones: [],
    comments: [],
    tags: ["aws", "cloud", "certification"],
    managerApproved: false,
  },
];
