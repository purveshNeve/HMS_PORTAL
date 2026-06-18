"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { submitFeedback } from "../actions";

export interface FeedbackFormProps {
  employeeId: string;
}

export function FeedbackForm({ employeeId }: FeedbackFormProps) {
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const result = await submitFeedback(employeeId, {
      type: "general",
      message,
      isAnonymous,
    });

    setIsSubmitting(false);

    if (result.success) {
      setMessage("");
      setStatus("Feedback submitted. Thank you!");
    } else {
      setStatus(result.error ?? "Something went wrong.");
    }
  }

  return (
    <Card title="Share feedback" description="Help us improve the workplace experience.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Your feedback"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => setIsAnonymous(event.target.checked)}
          />
          Submit anonymously
        </label>
        {status ? <p className="text-sm text-zinc-700 dark:text-zinc-300">{status}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit feedback"}
        </Button>
      </form>
    </Card>
  );
}
