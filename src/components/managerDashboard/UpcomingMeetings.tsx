"use client";

import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { upcomingMeetings, type MeetingItem } from "@/lib/mock/dashboard";

function MeetingList({ day }: { day: "today" | "tomorrow" }) {
  const meetings = upcomingMeetings.filter((m) => m.day === day);

  if (meetings.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">No meetings scheduled.</p>;
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting: MeetingItem) => (
        <div
          key={meeting.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex w-16 shrink-0 flex-col items-start">
              <span className="text-sm font-semibold text-slate-800">{meeting.time}</span>
              <Badge variant="default" className="rounded-full bg-slate-100 text-[10px] font-normal text-slate-500">
                {meeting.type}
              </Badge>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">{meeting.title}</p>
              <div className="mt-1 flex -space-x-2">
                {meeting.participants.map((p: string) => (
                  <Avatar key={p} className="h-6 w-6 border-2 border-white">
                    <AvatarFallback className="bg-indigo-50 text-[10px] text-indigo-600">
                      {p}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
          <Button size="sm" variant="secondary" className="shrink-0 gap-1.5 rounded-lg">
            <Video className="h-3.5 w-3.5" />
            Join
          </Button>
        </div>
      ))}
    </div>
  );
}

export function UpcomingMeetings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800">
            Upcoming Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today">
            <TabsList className="mb-3 grid w-full grid-cols-2 rounded-lg">
              <TabsTrigger value="today" className="rounded-md">Today</TabsTrigger>
              <TabsTrigger value="tomorrow" className="rounded-md">Tomorrow</TabsTrigger>
            </TabsList>
            <TabsContent value="today">
              <MeetingList day="today" />
            </TabsContent>
            <TabsContent value="tomorrow">
              <MeetingList day="tomorrow" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
