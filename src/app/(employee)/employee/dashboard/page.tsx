"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import IDCard from "@/components/IDCard";
import { useAuth } from "@/hooks/useAuth";
import type { CardData } from "@/types/types";
import type { EmployeeProfile } from "@/types/profile";

interface DashboardStats {
  stats: {
    attendance: number;
    leaves: number;
    wfhLeaves: number;
    payroll: number;
    tasks: number;
  };
  UpcomingEvents: {
    meetings: Array<{
      _id?: string;
      title?: string;
      date?: string | Date;
      time?: string;
      note?: string;
      duration?: string;
    }>;
    projectDeadline?: Array<{
      _id?: string;
      title?: string;
      dueDate?: string | Date;
    }>;
  };
  payrollBreakdown: {
    baseSalary: number;
    workingDays: number;
    prevMonthSal: number;
    creditedDate: string | null;
  };
  details: {
    approvedLeaves: Array<{
      type: string;
      date: string;
      status: string;
      color: string;
    }>;
    approvedWFH: Array<{
      type: string;
      date: string;
      status: string;
      color: string;
    }>;
    pendingGoals: Array<{
      id: string;
      title: string;
      dueDate: string;
      priority: string;
      progress: number;
    }>;
  };
}

const defaultStats = [
  { label: "Attendance", value: "22", total: "0",subtitle: "Present Days This Month" },
  { label: "Leaves", value: "10", total: "0",subtitle: "Leaves Taken This Month" },
  { label: "WFH Leaves", value: "10",total: "0", subtitle: "WFH Leaves Taken This Month" },
  { label: "Payroll", value: "₹45,000",subtitle: "This Month Salary" },
  { label: "Tasks", value: "05", subtitle: "Pending Tasks Due Soon" },
  {label: "LastMonth" , value: "45000" ,subtitle: "Last Month Salary"},
];

const defaultLeaveRequests = [
  { type: "Casual Leave", date: "10 Jun – 12 Jun", status: "Approved", color: "bg-emerald-100 text-emerald-700" },
  { type: "Sick Leave", date: "22 Jun", status: "Pending", color: "bg-amber-100 text-amber-700" },
  { type: "Casual Leave", date: "01 Jul – 02 Jul", status: "Pending", color: "bg-amber-100 text-amber-700" },
];

type DashboardEventItem = {
  key: string;
  title: string;
  time: string;
  date: string;
  agenda?: string;
  type: "meeting" | "deadline" | "event" | "holiday";
};

type AnnouncementItem = {
  key: string;
  title: string;
  time?: string;
  date: string;
  agenda?: string;
  type: "event" | "holiday";
  badge: string;
};

const announcements = [
  { title: "Holiday Notice", description: "Office will remain closed on 21 June 2025 on account of...", date: "2 days ago", badge: "Notice" },
];

const activities = [
  { title: "Leave request approved", detail: "Your leave request for 10 – 12 Jun has been approved.", date: "1 day ago" },
  { title: "Salary credited", detail: "Your salary for June 2025 has been credited.", date: "3 days ago" },
  { title: "Profile updated", detail: "Your profile information has been updated.", date: "5 days ago" },
  { title: "Document uploaded", detail: "You uploaded a new document (Aadhar Card).", date: "1 week ago" },
];

function formatDate(dateValue: string | null | Date) {
  if (!dateValue) return "Not available";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  return !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Not available";
}

export default function EmployeeDashboardPage() {

  const router = useRouter();

  const handleViewPayslip = async () => {
    try {
      const res = await fetch("/api/payroll/payslips?status=SUBMITTED,PROCESSED,PAID");
      if (res.ok) {
        const data = await res.json();
        const first = data.payslips?.[0];
        if (first?._id) {
          router.push(`/employee/PayAndBenefit/overview?openId=${first._id}`);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch payslip before navigation:", err);
    }
    // Fallback: still navigate to overview
    router.push("/employee/PayAndBenefit/overview");
  };
  const { session, isLoading, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState(defaultStats);
  const [leaveRequests, setLeaveRequests] = useState(defaultLeaveRequests);
  const [backendEvents, setBackendEvents] = useState<DashboardEventItem[]>([]);
  const [backendHolidays, setBackendHolidays] = useState<DashboardEventItem[]>([]);
  const [prevMonth, setPrevMonthSalary] = useState<string>("₹100");
  const [creditedDate, setCreditedDate] = useState<string>("Not available");
  
  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
      fetchEventsAndHolidays();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = (await res.json()) as EmployeeProfile;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/employee/dashboard-stats");
      if (!res.ok) {
        throw new Error(`Failed to fetch dashboard stats`);
      }
      const data = (await res.json()) as DashboardStats;
      setDashboardStats(data);

      const prevMonthSalary = data.payrollBreakdown.prevMonthSal;
      setPrevMonthSalary(`₹${prevMonthSalary?.toLocaleString("en-IN") ?? "0"}`);
      setCreditedDate(
        data.payrollBreakdown.creditedDate
          ? formatDate(data.payrollBreakdown.creditedDate)
          : "Not available"
      );

      const updatedStats = [
        { label: "Attendance", value: String(data.stats.attendance), 
          total: "30" , subtitle: "Present Days This Month" },
        { label: "Leaves", value: String(data.stats.leaves), total : "2",subtitle: "Leaves Taken This Month"}, 
        { label: "WFH Leaves", value: String(data.stats.wfhLeaves), 
          total : "5" , subtitle: "WFH Leaves Taken This Month" },
        {
          label: "Payroll",
          value: `₹${data.stats.payroll.toLocaleString("en-IN")}`,
          subtitle: "This Month Salary",
        },
        { label: "Tasks", value: String(data.stats.tasks), subtitle: "Pending Tasks Due Soon" },
      ];
      setStats(updatedStats);

      const allRequests = [
        ...data.details.approvedLeaves,
        ...data.details.approvedWFH,
      ];
      setLeaveRequests(allRequests.length > 0 ? allRequests : defaultLeaveRequests);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Keep default stats on error
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchEventsAndHolidays = async () => {
    try {
      const [eventsRes, holidaysRes] = await Promise.all([
        fetch("/api/adminDashboard/events"),
        fetch("/api/adminDashboard/holidays"),
      ]);

      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setBackendEvents(
          (data.events ?? []).map((item: any) => ({
            key: item.id || item.eventId || `${item.title}-${item.date}-${item.time}`,
            title: item.title ?? "Event",
            time: item.time ?? "All Day",
            date: item.date ? formatDate(new Date(item.date)) : "",
            agenda: item.description ?? "",
            type: "event",
          }))
        );
      } else {
        setBackendEvents([]);
      }

      if (holidaysRes.ok) {
        const data = await holidaysRes.json();
        setBackendHolidays(
          (data.holidays ?? []).map((item: any) => ({
            key: item.id || item.holidayId || `${item.title}-${item.date}`,
            title: item.title ?? "Holiday",
            time: "",
            date: item.date ? formatDate(new Date(item.date)) : "",
            agenda: item.description ?? "",
            type: "holiday",
          }))
        );
      } else {
        setBackendHolidays([]);
      }
    } catch (error) {
      console.error("Error fetching events and holidays:", error);
      setBackendEvents([]);
      setBackendHolidays([]);
    }
  };

  const eventList = useMemo(() => {
    const meetings = dashboardStats?.UpcomingEvents?.meetings ?? [];
    const deadlines = dashboardStats?.UpcomingEvents?.projectDeadline ?? [];
    if (meetings.length > 0 || deadlines.length > 0) {
      return [
        ...meetings.map((m) => ({
          key: m._id ?? `${m.date}-${m.time}`,
          title: m.title ?? "Meeting",
          time: m.time ?? "",
          date: m.date ? formatDate(new Date(m.date)) : "",
          agenda: m.note ?? "",
          type: "meeting" as const,
        })),
        ...deadlines.map((p) => ({
          key: p._id ?? p.title ?? "deadline",
          title: p.title ?? "Project Deadline",
          time: p.dueDate ? formatDate(new Date(p.dueDate)) : "",
          date: p.dueDate ? formatDate(new Date(p.dueDate)) : "",
          agenda: "",
          type: "deadline" as const,
        })),
      ];
    }
    return backendEvents;
  }, [backendEvents, dashboardStats]);

  const initials = useMemo(() => {
    const name = profile?.name || session?.user?.name || "User";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }, [profile, session]);

  const profileImage = profile?.profileImage || session?.user?.image || null;
  const displayName = profile?.name || session?.user?.name || "Employee";
  const displayDepartment = profile?.department || "Not assigned";
  const displayDesignation = profile?.designation || "Not set";
  const displayEmail = profile?.email || session?.user?.email || "Not available";
  const displayPhone = profile?.phone || "Not available";
  const displayUserId = profile?.userId || session?.user?.userId || "—";
  const displayJoiningDate = formatDate(profile?.joiningDate ?? null);

  const idCardData: CardData = {
    name: displayName,
    role: displayDesignation,
    department: displayDepartment,
    employeeId: displayUserId,
    dateOfJoining: profile?.joiningDate ? new Date(profile.joiningDate).toISOString().slice(0, 10) : "",
    email: displayEmail,
    phone: displayPhone,
    bloodGroup: "O+",
    orgName: "HMS PORTAL",
    orgTagline: "Human Management System",
    photoUrl: profileImage,
  };

  if (isLoading || loadingProfile || loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-50 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">       
      <div>
        <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
          Welcome back, {displayName}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Here&apos;s what&apos;s happening with your work today.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="mx-auto w-full" style={{ maxWidth: 560 }}>
            <IDCard data={idCardData} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.slice(0, 3).map((item) => (
              <Card key={item.label}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">{item.value}/{item.total}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-500">{item.subtitle}</p>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payslip & Salary</CardTitle>
              <CardDescription>Current earnings and most recent salary credit.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-100 p-6 dark:bg-zinc-900">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">LAST MONTH SALARY</p>
                  <p className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">{prevMonth}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-sm text-zinc-500">Last credited on</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{creditedDate}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleViewPayslip}
                >
                  View Payslip
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/payroll/payslips?status=SUBMITTED,PROCESSED,PAID");
                      if (res.ok) {
                        const data = await res.json();
                        const first = data.payslips?.[0];
                        if (first?._id) {
                          router.push(`/employee/PayAndBenefit/overview?openId=${first._id}&action=download`);
                          return;
                        }
                      }
                    } catch (err) {
                      console.error("Failed to fetch payslip before download:", err);
                    }
                    router.push("/employee/PayAndBenefit/overview");
                  }}
                >
                  Download Statement
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Keep track of your next meetings and company events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventList.length > 0 ? (
                eventList.map((event) => (
                  <div key={event.key} className="flex items-center justify-between gap-4 rounded-3xl bg-zinc-100 p-4 dark:bg-zinc-900">
                    <div>
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{event.title}</p>
                      <p className="text-sm text-zinc-500">{event.type === "meeting" ? event.time : `Due: ${event.time}`}</p>
                      {event.agenda ? <p className="text-xs text-slate-500 mt-1">{event.agenda}</p> : null}
                    </div>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-zinc-800 dark:text-slate-300">{event.date}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No upcoming events available.</p>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.slice(3).map((item) => (
              <Card key={item.label}>
                <p className="text-sm font-medium text-zinc-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">{item.value}</p>
                <p className="mt-4 text-sm text-zinc-500">{item.subtitle}</p>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Today&apos;s Attendance</CardTitle>
                <CardDescription>Track your check-in and working hours.</CardDescription>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Present</span>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-zinc-100 p-5 dark:bg-zinc-900">
                  <p className="text-sm text-zinc-500">Check In Time</p>
                  <p className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">09:12 AM</p>
                </div>
                <div className="rounded-3xl bg-zinc-100 p-5 dark:bg-zinc-900">
                  <p className="text-sm text-zinc-500">Working Hours</p>
                  <p className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">06h 45m</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="default" className="flex-1">Check In</Button>
                <Button variant="destructive" className="flex-1">Check Out</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Recent requests and current approval status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveRequests.map((request) => (
                <div key={`${request.type}-${request.date}`} className="flex items-center justify-between rounded-3xl bg-zinc-100 p-4 dark:bg-zinc-900">
                  <div>
                    <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{request.type}</p>
                    <p className="text-sm text-zinc-500">{request.date}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${request.color}`}>{request.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Latest company updates and notices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              

              {(backendEvents.length > 0 || backendHolidays.length > 0) ? (
                <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  {[...backendEvents, ...backendHolidays].map((item) => (
                    <div key={item.key} className="rounded-3xl bg-zinc-100 p-4 dark:bg-zinc-900">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{item.title}</p>
                          <p className="text-sm text-zinc-500">
                            {item.date}{item.time ? ` • ${item.time}` : ""}
                          </p>
                          {item.agenda ? <p className="text-xs text-slate-500 mt-1">{item.agenda}</p> : null}
                        </div>
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-zinc-800 dark:text-slate-300">
                          {item.type === "holiday" ? "Holiday" : "Event"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No upcoming events or holidays available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Stay updated with the latest actions on your account.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.title} className="flex flex-col rounded-3xl border border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-zinc-950 dark:text-zinc-50">{activity.title}</p>
                <span className="text-xs text-zinc-500">{activity.date}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{activity.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
