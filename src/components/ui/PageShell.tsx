"use client";

import { ReactNode } from "react";
import { Topbar } from "./Topbar";

export function PageShell({
  children,
  onCreate,
  createLabel,
}: {
  children: ReactNode;
  onCreate?: () => void;
  createLabel?: string;
}) {
  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* <Topbar onCreate={onCreate} createLabel={createLabel} /> */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
