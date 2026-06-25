"use client"

import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import type { NavItem } from "@/components/navigation/Sidebar";
const employeeNav: NavItem[] = [
  { label: "Overview", href: "/employee/PayAndBenefit/overview" },
  { label: "Benefits", href: "/employee/PayAndBenefit/benefits" },
  { label: "Tax Information", href: "/employee/PayAndBenefit/taxInformation"}
];
export default function EmployeesLayout({ children }: { children: ReactNode }) {  return (
    <div className="flex flex-col gap-6">
      <Navbar title="Time Off" items={employeeNav} showAuthActions={false} />
      <div>{children}</div>
    </div>
  );
}
