import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import type { NavItem } from "@/components/navigation/Sidebar";

const employeeNav: NavItem[] = [
    { label: "Team Members", href: "/manager/team/myTeam" },
    { label: "Update Goal", href: "/manager/team/GoalUpdate" },
];

export default function EmployeesLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col gap-6">
            <Navbar title="Time Off" items={employeeNav} showAuthActions={false} />
            <div>{children}</div>
        </div>
    );
}
