import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import type { NavItem } from "@/components/navigation/Sidebar";
const employeeNav: NavItem[] = [
  { label: "Overview", href: "/employee/Goals/overview" },
  { label: "Recognition", href: "/employee/Goals/recognition" },
  { label: "Surveys", href: "/employee/Goals/surveys" },
  { label: "Developement", href: "/employee/Goals/developement" }
];
export default function EmployeesLayout({ children }: { children: ReactNode }) {  return (
    <div className="flex flex-col gap-6">
      <Navbar title="Goals" items={employeeNav} showAuthActions={false} />
      <div>{children}</div>
    </div>
  );
}
