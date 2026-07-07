import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/50 px-6 py-16 text-center dark:border-ink-700 dark:bg-surface-darkcard/50">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-400 dark:bg-ink-800">
        <Icon size={24} strokeWidth={1.6} />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink-800 dark:text-ink-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
