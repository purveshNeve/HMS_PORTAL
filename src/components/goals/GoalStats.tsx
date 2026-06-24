import { Goal, GoalStatus } from "@/lib/goals.types";

interface GoalStatsProps {
  goals: Goal[];
}

export default function GoalStats({ goals }: GoalStatsProps) {
  const total = goals.length;
  const byStatus = (s: GoalStatus) => goals.filter((g) => g.status === s).length;
  const avgProgress = total
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / total)
    : 0;

  const stats = [
    { label: "Total Goals", value: total, color: "bg-gray-900 text-white" },
    { label: "In Progress", value: byStatus("in_progress"), color: "bg-blue-50 text-blue-700" },
    { label: "Completed", value: byStatus("completed"), color: "bg-green-50 text-green-700" },
    { label: "At Risk", value: byStatus("at_risk"), color: "bg-red-50 text-red-700" },
    { label: "Avg Progress", value: `${avgProgress}%`, color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map(({ label, value, color }) => (
        <div
          key={label}
          className={`rounded-xl p-4 flex flex-col gap-1 ${color}`}
        >
          <span className="text-2xl font-bold leading-none">{value}</span>
          <span className="text-xs font-medium opacity-70 mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}
