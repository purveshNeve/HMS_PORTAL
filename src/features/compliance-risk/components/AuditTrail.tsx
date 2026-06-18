import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { AuditEvent } from "@/features/compliance-risk/types";

const severityColors: Record<AuditEvent["severity"], string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

export interface AuditTrailProps {
  events: AuditEvent[];
}

export function AuditTrail({ events }: AuditTrailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
        <CardDescription>Recent compliance and risk events</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-foreground/10 p-3"
            >
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-foreground/50">
                  {event.domain} · {new Date(event.occurredAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${severityColors[event.severity]}`}
              >
                {event.severity}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
