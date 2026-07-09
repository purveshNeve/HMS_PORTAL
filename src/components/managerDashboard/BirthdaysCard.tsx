"use client";

import { motion } from "framer-motion";
import { Cake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { upcomingBirthdays, type BirthdayEntry } from "@/lib/mock/dashboard";

export function BirthdaysCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <Cake className="h-4 w-4 text-pink-500" />
          <CardTitle className="text-base font-semibold text-slate-800">
            Team Birthdays
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingBirthdays.map((entry: BirthdayEntry) => (
            <div key={entry.id} className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-pink-50 text-xs font-medium text-pink-600">
                  {entry.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{entry.name}</p>
                <p className="text-xs text-slate-400">{entry.department} · {entry.date}</p>
              </div>
              <Button size="sm" variant="secondary" className="shrink-0 rounded-lg">
                Wish
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
