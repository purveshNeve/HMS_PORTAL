import type { ReactNode } from "react";

import { Navbar } from "@/components/navigation/Navbar";
import type { NavItem } from "@/components/navigation/Sidebar";

const culturalNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/Cultural/dashboard" },
  { label: "Skill Development", href: "/admin/Cultural/skillDevelopement" },
  { label: "Cultural Calendar", href: "/admin/Cultural/CulturalInformation" },
];

export default function CulturalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <Navbar title="Cultural" items={culturalNav} showAuthActions={false} />
      <div>{children}</div>
    </div>
  );
}