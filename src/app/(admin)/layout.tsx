import type { ReactNode } from "react";

import { Navbar } from "@/components/navigation/Navbar";
import { Sidebar, type NavItem } from "@/components/navigation/Sidebar";

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Recruitment", href: "/admin/Recruitments" },
  { label: "Employee Details", href: "/admin/Employees" },
  { label: "Career Development", href: "/admin/Cultural" },
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
