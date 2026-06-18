import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Shoutout } from "@/features/employee-relations/types";

export interface ShoutoutBoardProps {
  shoutouts: Shoutout[];
}

export function ShoutoutBoard({ shoutouts }: ShoutoutBoardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shoutout Board</CardTitle>
        <CardDescription>Peer recognition across the organization</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {shoutouts.map((shoutout) => (
            <li
              key={shoutout.id}
              className="rounded-lg border border-foreground/10 p-4"
            >
              <p className="text-sm">{shoutout.message}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-foreground/50">
                <span>{new Date(shoutout.createdAt).toLocaleDateString()}</span>
                <span>{shoutout.reactions ?? 0} reactions</span>
              </div>
            </li>
          ))}
          {shoutouts.length === 0 && (
            <li className="py-6 text-center text-sm text-foreground/50">
              No shoutouts yet — be the first!
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
