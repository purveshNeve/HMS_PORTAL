import { cn } from "@/lib/utils";

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

export default function UnreadBadge({ count, className }: UnreadBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-rose-500 text-[10px] font-bold text-white leading-none animate-pulse",
        className
      )}
    >
      {count}
    </span>
  );
}
