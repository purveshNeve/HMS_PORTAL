import { EventCategory } from "@/types/calendar";
import { categoryStyles } from "@/lib/category-styles";
import { cn } from "@/lib/utils";

export default function CategoryBadge({
  category,
  size = "sm",
}: {
  category: EventCategory;
  size?: "sm" | "md";
}) {
  const style = categoryStyles[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        style.bg,
        style.text,
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {category}
    </span>
  );
}
