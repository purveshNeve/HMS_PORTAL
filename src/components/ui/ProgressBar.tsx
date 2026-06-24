import { PROGRESS_BAR_COLOR, GoalStatus } from "@/lib/goals.types";

interface ProgressBarProps {
  value: number;
  status: GoalStatus;
  showLabel?: boolean;
  height?: string;
}

export default function ProgressBar({ value, status, showLabel = true, height = "h-2" }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className={`flex-1 bg-gray-100 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${PROGRESS_BAR_COLOR[status]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-600 w-8 text-right">{value}%</span>
      )}
    </div>
  );
}
