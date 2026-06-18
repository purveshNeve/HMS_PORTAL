import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { PtoBalance } from "@/features/compensation-payroll/types";

export interface PtoBalanceCardProps {
  balance: PtoBalance;
}

export function PtoBalanceCard({ balance }: PtoBalanceCardProps) {
  const usedPercent = balance.accrued > 0 ? (balance.used / balance.accrued) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>PTO Balance</CardTitle>
        <CardDescription>Accrued time off in {balance.unit}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold">{balance.remaining}</div>
        <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-foreground/60">
          <span>Used: {balance.used}</span>
          <span>Accrued: {balance.accrued}</span>
        </div>
      </CardContent>
    </Card>
  );
}
