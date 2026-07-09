"use client";

import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { workAnniversaries, type AnniversaryEntry } from "@/lib/mock/dashboard";

export function AnniversaryCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <PartyPopper className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-base font-semibold text-slate-800">
            Work Anniversaries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {workAnniversaries.map((entry: AnniversaryEntry) => (
            <div key={entry.id} className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-amber-50 text-xs font-medium text-amber-600">
                  {entry.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{entry.name}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <Badge variant="default" className="rounded-full bg-amber-50 text-[10px] font-normal text-amber-700 hover:bg-amber-50">
                    {entry.years} {entry.years === 1 ? "year" : "years"}
                  </Badge>
                  <span className="text-xs text-slate-400">{entry.date}</span>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="shrink-0 rounded-lg">
                Celebrate
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
