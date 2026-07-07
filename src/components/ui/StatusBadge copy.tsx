import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "info" | "violet";

const toneStyles: Record<Tone, string> = {
  success: "bg-moss-light text-moss",
  warning: "bg-marigold-light text-marigold",
  danger: "bg-coral-light text-coral",
  neutral: "bg-line/60 text-muted",
  info: "bg-slateblue-light text-slateblue",
  violet: "bg-indigoink-light text-indigoink",
};

export default function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: Tone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        toneStyles[tone]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
