"use client";

import { ProfileCompletionData } from "@/types/profile";

interface ProfileCompletionBarProps {
  completion: ProfileCompletionData;
}

export default function ProfileCompletionBar({
  completion,
}: ProfileCompletionBarProps) {
  const getColorClass = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusText = (percentage: number) => {
    if (percentage === 100) return "Profile Complete";
    if (percentage >= 80) return "Almost there";
    if (percentage >= 60) return "Good progress";
    if (percentage >= 40) return "Getting started";
    return "Incomplete";
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Profile Completion
          </h2>
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {completion.percentage}%
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {getStatusText(completion.percentage)} · {completion.completed} of{" "}
          {completion.total} fields completed
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${getColorClass(
            completion.percentage
          )} transition-all duration-300`}
          style={{ width: `${completion.percentage}%` }}
        ></div>
      </div>

      {/* Missing Fields */}
      {completion.emptyFields.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            Complete these fields to finish your profile:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {completion.emptyFields.slice(0, 6).map((field) => (
              <div key={field} className="text-sm text-blue-800 dark:text-blue-300">
                • {formatFieldName(field)}
              </div>
            ))}
            {completion.emptyFields.length > 6 && (
              <div className="text-sm text-blue-800 dark:text-blue-300">
                • +{completion.emptyFields.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
