"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import { signPolicy } from "../actions";
import type { Policy } from "../types";

export interface PolicySignFormProps {
  policy: Policy;
  employeeId: string;
}

export function PolicySignForm({ policy, employeeId }: PolicySignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const result = await signPolicy({ policyId: policy.id, employeeId });

    setIsSubmitting(false);
    setMessage(result.success ? "Policy signed successfully." : result.error ?? "Error");
  }

  return (
    <Card title={policy.title} description={`Version ${policy.version}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          By signing, you acknowledge that you have read and agree to this policy.
        </p>
        {message ? <p className="text-sm text-zinc-700 dark:text-zinc-300">{message}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing..." : "Sign policy"}
        </Button>
      </form>
    </Card>
  );
}
