"use client";

import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
import { announcements, type Announcement, type AnnouncementCategory } from "@/lib/mock/dashboard";

const categoryClass: Record<AnnouncementCategory, string> = {
  "Company Update": "bg-blue-50 text-blue-700 hover:bg-blue-50",
  "HR Notification": "bg-purple-50 text-purple-700 hover:bg-purple-50",
  "Policy Change": "bg-amber-50 text-amber-700 hover:bg-amber-50",
  "Training Program": "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
};

export function Announcements() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <Megaphone className="h-4 w-4 text-slate-500" />
          <CardTitle className="text-base font-semibold text-slate-800">
            Recent Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {announcements.map((item: Announcement, idx: number) => (
            <div key={item.id}>
              <div className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <Badge
                    variant="default"
                    className={`shrink-0 rounded-full font-normal ${categoryClass[item.category]}`}
                  >
                    {item.category}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.summary}</p>
                <p className="mt-1 text-[11px] text-slate-400">{item.date}</p>
              </div>
              {idx < announcements.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
