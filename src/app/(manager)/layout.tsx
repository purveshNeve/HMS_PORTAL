import type { ReactNode } from "react";

import { Navbar } from "@/components/navigation/Navbar";
import { Sidebar, type NavItem } from "@/components/navigation/Sidebar";

const managerNav: NavItem[] = [
  { label: "Dashboard", href: "/manager/dashboard" },
  { label: "My Team", href: "/manager/team" },
  { label: "Approvals", href: "/manager/approvals" },
  { label: "Performance", href: "/manager/performance" },
  { label: "Time Off", href: "/manager/timeOff" },
];

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={managerNav} title="Manager Portal" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar title="Team Operations" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
