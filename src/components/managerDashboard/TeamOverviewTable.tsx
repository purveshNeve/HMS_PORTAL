"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  MessageSquare,
  Pencil,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { getManagerEmployees } from "@/lib/managerDasboardOverview";

const PAGE_SIZE = 5;

interface TeamMember {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  attendance: number;
  currentGoal: string;
  status: "Active" | "Remote" | "On Leave";
  goalAhead: String;
  profileImage?: string;
}

const statusMeta = {
  Active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700",
  },
  Remote: {
    label: "Remote",
    className: "bg-indigo-50 text-indigo-700",
  },
  "On Leave": {
    label: "On Leave",
    className: "bg-amber-50 text-amber-700",
  },
};

export function TeamOverviewTable() {
  const [employees, setEmployees] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
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

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paged = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          Loading employees...
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Team Overview
            </CardTitle>

            <p className="text-xs text-slate-400">
              {filtered.length} of {employees.length} members
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={query}
              placeholder="Search employee..."
              className="pl-9"
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[900px]">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-3 py-3">Department</th>
                    <th className="px-3 py-3">Attendance</th>
                    <th className="px-3 py-3">Current Goal</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Goal Progress</th>
                    {/* <th className="px-3 py-3 text-right">Actions</th> */}
                  </tr>
                </thead>

                <tbody>
                  {paged.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {employee.profileImage ? (
                              <img
                                src={employee.profileImage}
                                alt={employee.name}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)}
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <div>
                            <p className="font-medium">
                              {employee.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {employee.designation}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        {employee.department}
                      </td>

                      <td className="px-3 py-3">
                        {employee.attendance}%
                      </td>

                      <td className="px-3 py-3">
                        {employee.currentGoal}
                      </td>

                      <td className="px-3 py-3">
                        <Badge
                          className={cn(
                            "rounded-full",
                            statusMeta[employee.status].className
                          )}
                        >
                          {statusMeta[employee.status].label}
                        </Badge>
                      </td>

                      <td className="px-3 py-3">
                          {employee.goalAhead}
                      </td>

                      {/* <td className="px-3 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Message
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td> */}
                    </tr>
                  ))}

                  {!loading && paged.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-500"
                      >
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between border-t px-5 py-3">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() =>
                  setPage((prev) => Math.max(prev - 1, 1))
                }
              >
                Previous
              </Button>

              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}