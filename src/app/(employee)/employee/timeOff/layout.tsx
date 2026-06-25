import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import type { NavItem } from "@/components/navigation/Sidebar";
const employeeNav: NavItem[] = [
  { label: "Overview", href: "/employee/timeOff/overview" },
  { label: "Apply Leave", href: "/employee/timeOff/leave" },
  { label: "History", href: "/employee/timeOff/history" },
  { label: "Calendar and Team", href: "/employee/timeOff/calender" },
  { label: "WFH and Comp Off", href: "/employee/timeOff/compoff" },
  { label: "Policies", href: "/employee/timeOff/policies" }
];
export default function EmployeesLayout({ children }: { children: ReactNode }) {  return (
    <div className="flex flex-col gap-6">
      <Navbar title="Time Off" items={employeeNav} showAuthActions={false} />
      <div>{children}</div>
    </div>
  );
}
