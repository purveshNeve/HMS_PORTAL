import type { ReactNode } from "react";

import { Navbar } from "@/components/navigation/Navbar";
import { Sidebar, type NavItem } from "@/components/navigation/Sidebar";

const employeeNav: NavItem[] = [
  { label: "Dashboard", href: "/employee/dashboard" },
  { label: "Pay & Benefits", href: "/employee/payroll" },
  { label: "Time Off", href: "/employee/pto" },
  { label: "Goals", href: "/employee/goals" },
  { label: "Feedback", href: "/employee/feedback" },
];

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={employeeNav} title="Employee Portal" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar title="Self-Service" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
