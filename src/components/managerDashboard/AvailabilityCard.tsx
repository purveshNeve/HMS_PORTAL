"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { getManagerEmployees } from "@/lib/managerDasboardOverview";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  attendance: number;
  currentGoal: string;
  status: "Active" | "Remote" | "On Leave";
  profileImage?: string;
}

const statusMeta = {
  Active: {
    label: "Active",
    ringClass: "border-emerald-500",
    badgeClass: "bg-emerald-500 text-white",
  },
  Remote: {
    label: "Remote",
    ringClass: "border-indigo-500",
    badgeClass: "bg-indigo-500 text-white",
  },
  "On Leave": {
    label: "On Leave",
    ringClass: "border-amber-500",
    badgeClass: "bg-amber-500 text-white",
  },
} as const;

const PAGE_SIZE = 5;


export function AvailabilityCard() {
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getManagerEmployees();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return employees;

    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(q) ||
        employee.designation.toLowerCase().includes(q) ||
        employee.department.toLowerCase().includes(q)
    );
  }, [employees, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }
      }
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800">
            Team Availability
          </CardTitle>
          <p className="text-xs text-slate-400">Live status of your team right now</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            {Object.entries(statusMeta).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={cn("h-2 w-2 rounded-full", meta.ringClass.replace("border-", "bg-"))} />
                {meta.label}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <tbody>
                {paged.map((employee) => {
                  const initials = employee.name
                    .split(" ")
                    .filter(Boolean)
                    .map((part) => part[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  const status = statusMeta[employee.status] ?? statusMeta.Active;

                  return (
                    <tr key={employee.id} className="border-t border-slate-100">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("relative rounded-full p-0.5", status.ringClass)}>
                            <Avatar className="h-10 w-10 ring-2 ring-white">
                              {employee.profileImage ? (
                                <img
                                  src={employee.profileImage}
                                  alt={employee.name}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                <AvatarFallback className="bg-slate-100 text-slate-700">
                                  {initials}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">{employee.name}</p>
                            <p className="text-xs text-slate-500">{employee.designation}</p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-3 text-right text-xs uppercase tracking-wide text-slate-500">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          status.badgeClass
                        )}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div >
  );
}
