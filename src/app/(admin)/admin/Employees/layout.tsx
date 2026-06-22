import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import type { NavItem } from "@/components/navigation/Sidebar";
const employeeNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/Employees/dashboard" },
  { label: "Employee List", href: "/admin/Employees/EmployeeDetails" },
  { label: "Attendance and Leave", href: "/admin/Employees/Attendance" },
  { label: "Salary and Payroll", href: "/admin/Employees/Salary" },
];
export default function EmployeesLayout({ children }: { children: ReactNode }) {  return (
    <div className="flex flex-col gap-6">
      <Navbar title="Employees" items={employeeNav} showAuthActions={false} />
      <div>{children}</div>
    </div>
  );
}
