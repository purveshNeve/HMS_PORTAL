import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ rating, size = 13 }: { rating: number; size?: number }) {
  if (rating === 0) {
    return <span className="text-xs text-ink-faint">—</span>;
  }
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className={cn(
            i < rating ? "fill-warning-500 text-warning-500" : "fill-transparent text-border-strong"
          )}
        />
      ))}
    </div>
  );
}
