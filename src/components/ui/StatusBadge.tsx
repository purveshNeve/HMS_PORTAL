import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  // Role statuses
  Open: "bg-evergreen-50 text-evergreen-700 dark:bg-evergreen-900/40 dark:text-evergreen-300",
  "On Hold": "bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300",
  Closed: "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300",
  Draft: "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300",
  "Pending Approval": "bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300",

  // Candidate pipeline
  Applied: "bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200",
  Screening: "bg-sky-100 text-sky-700",
  Shortlisted: "bg-evergreen-50 text-evergreen-700 dark:bg-evergreen-900/40 dark:text-evergreen-300",
  "Interview Scheduled": "bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300",
  "Technical Round": "bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300",
  "HR Round": "bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300",
  Selected: "bg-evergreen-100 text-evergreen-800 dark:bg-evergreen-900/50 dark:text-evergreen-200",
  Rejected: "bg-coral-100 text-coral-700 dark:bg-coral-900/40 dark:text-coral-300",
  "Offer Released": "bg-evergreen-50 text-evergreen-700 dark:bg-evergreen-900/40 dark:text-evergreen-300",
  Joined: "bg-evergreen-800 text-white dark:bg-evergreen-600",

  // Offer statuses
  Approved: "bg-evergreen-50 text-evergreen-700 dark:bg-evergreen-900/40 dark:text-evergreen-300",
  Sent: "bg-sky-100 text-sky-700",
  Viewed: "bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300",
  Accepted: "bg-evergreen-800 text-white dark:bg-evergreen-600",
  Negotiating: "bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300",
  Expired: "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300",

  // Priority
  Critical: "bg-coral-100 text-coral-700 dark:bg-coral-900/40 dark:text-coral-300",
  High: "bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300",
  Medium: "bg-sky-100 text-sky-700",
  Low: "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("chip", colorMap[status] ?? "bg-ink-100 text-ink-600", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
