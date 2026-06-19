import type { ReactNode } from "react";

import { Navbar } from "@/components/navigation/Navbar";
import type { NavItem } from "@/components/navigation/Sidebar";

const employeeNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/Employees/dashboard" },
  { label: "Update Rolles", href: "/admin/Employees/updateRolles" },
  { label: "Applications", href: "/admin/Employees/Applications" },
  { label: "OnBoarding", href: "/admin/Employees/Onboarding" },
];

export default function EmployeesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <Navbar title="Employees" items={employeeNav} showAuthActions={false} />
      <div>{children}</div>
    </div>
  );
}
