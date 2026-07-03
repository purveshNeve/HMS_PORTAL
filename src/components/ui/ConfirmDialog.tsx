"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal-copy";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "danger",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "danger" | "default";
}) {
  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div className="flex flex-col items-center py-2 text-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${tone === "danger" ? "bg-coral-50 text-coral-600 dark:bg-coral-900/30 dark:text-coral-300" : "bg-gold-50 text-gold-700"
            }`}
        >
          <AlertTriangle size={22} />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">{title}</h3>
        <p className="mt-1.5 text-sm text-ink-400">{description}</p>
        <div className="mt-6 flex w-full gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all active:scale-[0.98] ${tone === "danger" ? "bg-coral-600 hover:bg-coral-700" : "bg-evergreen-800 hover:bg-evergreen-700"
              }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
