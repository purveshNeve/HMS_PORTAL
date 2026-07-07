"use client";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-ink">{children}</label>
  );
}

export function TextField({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <input
        {...props}
        className="w-full rounded-lg border border-line bg-paper/60 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-indigoink focus:bg-card"
      />
      {error && <p className="mt-1 text-[11px] font-medium text-coral">{error}</p>}
    </div>
  );
}

export function TextareaField({
  label,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        {...props}
        rows={props.rows ?? 3}
        className="w-full resize-none rounded-lg border border-line bg-paper/60 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-indigoink focus:bg-card"
      />
      {error && <p className="mt-1 text-[11px] font-medium text-coral">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <select
        {...props}
        className="w-full cursor-pointer rounded-lg border border-line bg-paper/60 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-indigoink focus:bg-card"
      >
        {children}
      </select>
      {error && <p className="mt-1 text-[11px] font-medium text-coral">{error}</p>}
    </div>
  );
}
