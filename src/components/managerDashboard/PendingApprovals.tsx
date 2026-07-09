"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { pendingApprovals, type PendingApproval } from "@/lib/mock/dashboard";

export function PendingApprovals() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800">
            Pending Approvals
          </CardTitle>
          <Badge variant="default" className="rounded-full bg-amber-50 text-amber-700 hover:bg-amber-50">
            {pendingApprovals.length} pending
          </Badge>
        </CardHeader>
        <CardContent className="space-y-1">
          {pendingApprovals.map((item: PendingApproval, idx: number) => (
            <div key={item.id}>
              <div className="flex items-center gap-3 py-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-slate-100 text-xs font-medium text-slate-600">
                    {item.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {item.employeeName}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {item.type} · {item.detail}
                  </p>
                  <p className="text-[11px] text-slate-400">Submitted {item.submittedOn}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button
                    size="sm"
                    className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 shadow-none hover:bg-emerald-100"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 shadow-none hover:bg-rose-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {idx < pendingApprovals.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
