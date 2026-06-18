import type { ReactNode } from "react";

import { Navbar } from "@/components/navigation/Navbar";
import { Sidebar, type NavItem } from "@/components/navigation/Sidebar";

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Recruitment", href: "/admin/recruitment" },
  { label: "Payroll", href: "/admin/payroll" },
  { label: "Compliance", href: "/admin/compliance" },
  { label: "Performance", href: "/admin/performance" },
  { label: "Culture", href: "/admin/culture" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={adminNav} title="Admin Portal" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar title="Strategic Overview" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
