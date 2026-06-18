import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";

import type { Payslip } from "../types";

export interface PayslipCardProps {
  payslip: Payslip;
}

export function PayslipCard({ payslip }: PayslipCardProps) {
  return (
    <Card
      title={`Pay period ${formatDate(payslip.periodStart)} – ${formatDate(payslip.periodEnd)}`}
      description={`Status: ${payslip.status}`}
    >
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-zinc-500">Gross pay</dt>
          <dd className="font-semibold text-zinc-900 dark:text-zinc-50">
            {formatCurrency(payslip.grossPay, payslip.currency)}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Net pay</dt>
          <dd className="font-semibold text-zinc-900 dark:text-zinc-50">
            {formatCurrency(payslip.netPay, payslip.currency)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
