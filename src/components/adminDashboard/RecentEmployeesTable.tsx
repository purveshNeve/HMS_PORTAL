// components/dashboard/RecentEmployeesTable.tsx
"use client";

import { Eye, Pencil } from "lucide-react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import { SectionCard, SectionHeading, Skeleton, ErrorState, EmptyState } from "./DashboardStates";
import { formatDate } from "@/lib/format";
import type { Employee } from "@/types/admindashboard";

const STATUS_STYLES: Record<Employee["status"], string> = {
  active: "bg-emerald-50 text-emerald-700",
  onleave: "bg-amber-50 text-amber-700",
  inactive: "bg-gray-100 text-gray-500",
};

const STATUS_LABEL: Record<Employee["status"], string> = {
  active: "Active",
  onleave: "On Leave",
  inactive: "Inactive",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RecentEmployeesTable({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("employees", refreshKey);

  return (
    <SectionCard>
      <SectionHeading title="Recent Employees" action={<button className="text-xs font-medium text-indigo-600 hover:underline">View all</button>} />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState message="No employees to show." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400">
                <th className="py-2 pr-3 font-medium">Employee</th>
                <th className="py-2 pr-3 font-medium">Department</th>
                <th className="py-2 pr-3 font-medium">Role</th>
                <th className="py-2 pr-3 font-medium">Manager</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Joined</th>
                <th className="py-2 pr-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((emp: Employee) => (
                <tr key={emp.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {initials(emp.name)}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-gray-600">{emp.department}</td>
                  <td className="py-2.5 pr-3 text-gray-600">{emp.role}</td>
                  <td className="py-2.5 pr-3 text-gray-600">{emp.manager}</td>
                  <td className="py-2.5 pr-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[emp.status as Employee["status"]]}`}>
                      {STATUS_LABEL[emp.status as Employee["status"]]}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-gray-500">{formatDate(emp.joiningDate)}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex justify-end gap-1">
                      <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700" aria-label="View employee">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700" aria-label="Edit employee">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
