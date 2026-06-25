import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Read: "bg-surface-subtle text-ink-muted border-border",
  Unread: "bg-brand-50 text-brand-700 border-brand-200",
  Archived: "bg-surface-subtle text-ink-faint border-border",
  Draft: "bg-warning-50 text-warning-600 border-warning-500/20",
  Sent: "bg-success-50 text-success-600 border-success-500/20",
  Withdrawn: "bg-danger-50 text-danger-600 border-danger-500/20",
  Delivered: "bg-success-50 text-success-600 border-success-500/20",
  Pending: "bg-warning-50 text-warning-600 border-warning-500/20",
  Failed: "bg-danger-50 text-danger-600 border-danger-500/20",
  "Not Started": "bg-surface-subtle text-ink-muted border-border",
  "In Progress": "bg-brand-50 text-brand-700 border-brand-200",
  Submitted: "bg-success-50 text-success-600 border-success-500/20",
  Completed: "bg-success-50 text-success-600 border-success-500/20",
  Active: "bg-success-50 text-success-600 border-success-500/20",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-medium leading-none whitespace-nowrap",
        statusStyles[status] ?? "bg-surface-subtle text-ink-muted border-border"
      )}
    >
      {status}
    </span>
  );
}
