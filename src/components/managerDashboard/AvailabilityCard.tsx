"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { teamAvailability, availabilityMeta, type AvailabilityEntry, type AvailabilityStatus } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

export function AvailabilityCard() {
  const counts = teamAvailability.reduce<Record<string, number>>((acc, entry: AvailabilityEntry) => {
    acc[entry.status] = (acc[entry.status] ?? 0) + 1;
    return acc;
  }, {});

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
            Team Availability
          </CardTitle>
          <p className="text-xs text-slate-400">Live status of your team right now</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            {(Object.keys(availabilityMeta) as AvailabilityStatus[]).map((key) => {
              const meta = availabilityMeta[key];
              return (
                <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className={cn("h-2 w-2 rounded-full", meta.colorClass)} />
                  {meta.label}
                  <span className="text-slate-400">({counts[key] ?? 0})</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            {teamAvailability.map((entry: AvailabilityEntry) => (
              <HoverCard key={entry.id}>
                <HoverCardTrigger asChild>
                  <div className="relative cursor-default">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-100 text-xs font-medium text-slate-600">
                        {entry.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                        availabilityMeta[entry.status].colorClass
                      )}
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-44 rounded-xl text-sm">
                  <p className="font-medium text-slate-800">{entry.name}</p>
                  <p className="text-xs text-slate-400">{availabilityMeta[entry.status].label}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
