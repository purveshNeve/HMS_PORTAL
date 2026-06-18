import Link from "next/link";

import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-foreground/50">
          Enterprise HRMS
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Human Resource Management System
        </h1>
        <p className="mt-6 text-lg text-foreground/60">
          Unified platform for talent acquisition, compensation, compliance,
          performance management, and employee engagement.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button variant="secondary">Admin Portal</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
