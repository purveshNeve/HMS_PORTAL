"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { signPolicyAction } from "@/features/compliance-risk/actions";
import type { PolicyAcknowledgement } from "@/features/compliance-risk/types";

export interface PolicySignoffProps {
  acknowledgement: PolicyAcknowledgement;
  policyTitle: string;
  employeeId: string;
}

export function PolicySignoff({
  acknowledgement,
  policyTitle,
  employeeId,
}: PolicySignoffProps) {
  const handleSign = async () => {
    await signPolicyAction(acknowledgement.policyId, employeeId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{policyTitle}</CardTitle>
        <CardDescription>
          Status: <span className="capitalize">{acknowledgement.status}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {acknowledgement.status !== "signed" ? (
          <Button onClick={() => void handleSign()}>Sign Policy</Button>
        ) : (
          <p className="text-sm text-foreground/60">
            Signed on {new Date(acknowledgement.signedAt!).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
