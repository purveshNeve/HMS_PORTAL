"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, CalendarDays, Home, Clock, Loader2, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { getPendingRequests } from "@/lib/managerDashboardPending";

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface PendingLeave {
  startDate: string;
  endDate: string;
  isHalfDay?: boolean;
  leaveType?: string;
  reason?: string;
  days: number;
}

export interface PendingWFH {
  startDate: string;
  endDate: string;
  reason?: string;
  days: number;
}

export interface PendingCompOff {
  hoursWorked: number;
  compOffDaysEarned: number;
  workType?: string;
  reason?: string;
  workDate?: string;
  days: number;
}

export interface EmployeePendingApproval {
  id: string;
  name: string;
  email: string;
  department?: string;
  designation?: string;
  profileImage?: string | null;
  userId: string;
  pendingLeave: PendingLeave | null;
  pendingWFH: PendingWFH | null;
  pendingCompOff: PendingCompOff | null;
}
// ─── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Each employee can have up to 3 pending items — flatten them for rendering
interface ApprovalItem {
  employeeId: string;
  employeeName: string;
  profileImage?: string | null;
  type: "Leave" | "WFH" | "Comp-Off";
  detail: string;
  reason?: string;
  days: number;
  dateRange: string;
}

function flattenApprovals(employees: EmployeePendingApproval[]): ApprovalItem[] {
  const items: ApprovalItem[] = [];

  for (const emp of employees) {
    if (emp.pendingLeave) {
      items.push({
        employeeId: emp.userId,
        employeeName: emp.name,
        profileImage: emp.profileImage,
        type: "Leave",
        detail: emp.pendingLeave.leaveType ?? "Leave",
        reason: emp.pendingLeave.reason,
        days: emp.pendingLeave.days,
        dateRange: `${formatDate(emp.pendingLeave.startDate)} – ${formatDate(emp.pendingLeave.endDate)}`,
      });
    }

    if (emp.pendingWFH) {
      items.push({
        employeeId: emp.userId,
        employeeName: emp.name,
        profileImage: emp.profileImage,
        type: "WFH",
        detail: "Work From Home",
        reason: emp.pendingWFH.reason,
        days: emp.pendingWFH.days,
        dateRange: `${formatDate(emp.pendingWFH.startDate)} – ${formatDate(emp.pendingWFH.endDate)}`,
      });
    }

    if (emp.pendingCompOff) {
      items.push({
        employeeId: emp.userId,
        employeeName: emp.name,
        profileImage: emp.profileImage,
        type: "Comp-Off",
        detail: emp.pendingCompOff.workType ?? "Comp-Off",
        reason: emp.pendingCompOff.reason,
        days: emp.pendingCompOff.days,
        dateRange: emp.pendingCompOff.workDate
          ? formatDate(emp.pendingCompOff.workDate)
          : `${emp.pendingCompOff.hoursWorked}h worked`,
      });
    }
  }

  return items;
}

// ─── Badge meta ───────────────────────────────────────────────────────────────

const typeMeta: Record<
  ApprovalItem["type"],
  { icon: React.ElementType; className: string }
> = {
  Leave: {
    icon: CalendarDays,
    className: "bg-amber-50 text-amber-700",
  },
  WFH: {
    icon: Home,
    className: "bg-indigo-50 text-indigo-700",
  },
  "Comp-Off": {
    icon: Clock,
    className: "bg-violet-50 text-violet-700",
  },
};
// ─── Component ────────────────────────────────────────────────────────────────

export function PendingApprovals() {
  const [employees, setEmployees] = useState<EmployeePendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApprovals() {
      try {
        const data = await getPendingRequests();
        setEmployees(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load pending approvals.");
      } finally {
        setLoading(false);
      }
    }
    fetchApprovals();
  }, []);

  const items = flattenApprovals(employees);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800">
            Pending Approvals
          </CardTitle>

          {!loading && (
            <Badge
              variant="default"
              className="rounded-full bg-amber-50 text-amber-700 hover:bg-amber-50"
            >
              {items.length} pending
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-1">
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-sm">Loading approvals…</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="py-8 text-center text-sm text-rose-500">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
              <Inbox className="h-8 w-8" />
              <p className="text-sm">No pending approvals</p>
            </div>
          )}

          {/* List */}
          {!loading &&
            !error &&
            items.map((item, idx) => {
              const meta = typeMeta[item.type];
              const Icon = meta.icon;

              return (
                <div key={`${item.employeeId}-${item.type}`}>
                  <div className="flex items-center gap-3 py-3">
                    {/* Avatar */}
                    <Avatar className="h-9 w-9 shrink-0">
                      {item.profileImage ? (
                        <img
                          src={item.profileImage}
                          alt={item.employeeName}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-indigo-100 text-xs font-medium text-indigo-600">
                          {getInitials(item.employeeName)}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.employeeName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge
                          variant="default"
                          className={`rounded-full px-2 py-0 text-[10px] font-medium ${meta.className} hover:${meta.className}`}
                        >
                          <Icon className="mr-1 h-3 w-3" />
                          {item.type}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {item.detail}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.dateRange} ·{" "}
                        <span className="font-medium text-slate-500">
                          {item.days === 0.5
                            ? "Half day"
                            : `${item.days} day${item.days !== 1 ? "s" : ""}`}
                        </span>
                      </p>
                      {item.reason && (
                        <p className="text-[11px] text-slate-400 mt-0.5 italic truncate">
                          &ldquo;{item.reason}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-1.5">
                      <Button
                        size="sm"
                        className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 shadow-none hover:bg-emerald-100"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 shadow-none hover:bg-rose-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {idx < items.length - 1 && <Separator />}
                </div>
              );
            })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
