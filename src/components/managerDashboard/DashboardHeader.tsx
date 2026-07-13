"use client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Bell, Search, ChevronDown, Target, CalendarPlus, FileBarChart, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { managerProfile, quickActions, type QuickActionItem } from "@/lib/mock/dashboard";

const quickActionIconMap: Record<QuickActionItem["icon"], typeof Target> = {
  target: Target,
  calendarPlus: CalendarPlus,
  fileBarChart: FileBarChart,
  download: Download,
};

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardHeader() {
  const today = getTodayLabel();
  const session = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Good Morning, {session?.user?.name} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s an overview of your team&apos;s performance today.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="hidden text-sm font-medium text-slate-500 md:inline-block">
          {today}
        </span>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search team, goals, requests..."
            className="w-[200px] rounded-xl border-slate-200 bg-white pl-9 shadow-sm focus-visible:ring-indigo-500 lg:w-[260px]"
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="relative rounded-xl border-slate-200 shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-slate-600" />
          {managerProfile.unreadNotifications > 0 && (
            <Badge className="absolute -right-1.5 -top-1.5 h-5 min-w-5 justify-center rounded-full bg-rose-500 px-1 text-[10px] leading-none text-white hover:bg-rose-500">
              {managerProfile.unreadNotifications}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-1.5 rounded-xl bg-indigo-600 shadow-sm hover:bg-indigo-700">
              Quick Action
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl">
            {quickActions.map((action: QuickActionItem) => {
              const Icon = quickActionIconMap[action.icon as QuickActionItem['icon']];
              return (
                <DropdownMenuItem key={action.id} className="gap-2 rounded-lg">
                  <Icon className="h-4 w-4 text-slate-500" />
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
