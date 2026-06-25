import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import type { NavItem } from "@/components/navigation/Sidebar";
const employeeNav: NavItem[] = [
  { label: "Overview", href: "/employee/feedback/overview" },
  { label: "Sent Feedback", href: "/employee/feedback/sent" },
  { label: "Recieved Feedback", href: "/employee/feedback/recieved" },
  { label: "Give Feedback", href: "/employee/feedback/giveFeedback" },
  { label: "Analytics", href: "/employee/feedback/analytics" },
  { label: "Survey", href: "/employee/feedback/surveys" },
];
export default function EmployeesLayout({ children }: { children: ReactNode }) {  return (
    <div className="flex flex-col gap-6">
      <Navbar title="Feedback" items={employeeNav} showAuthActions={false} />
      <div>{children}</div>
    </div>
  );
}
