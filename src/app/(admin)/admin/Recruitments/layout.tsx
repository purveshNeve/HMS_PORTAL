import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import type { NavItem } from "@/components/navigation/Sidebar";
const recruitmentsNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/Recruitments/dashboard" },
  { label: "Update Rolles", href: "/admin/Recruitments/UpdateRolles" },
  { label: "Applications", href: "/admin/Recruitments/Applications" },
  { label: "Offerings", href: "/admin/Recruitments/Offerings" },
];
export default function RecruitmentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <Navbar title="Recruitments" items={recruitmentsNav} showAuthActions={false} />
      <div>{children}</div>
    </div>
  );
}