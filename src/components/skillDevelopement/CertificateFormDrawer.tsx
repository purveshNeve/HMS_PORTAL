"use client";

import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Certificate, CertificateStatus } from "@/types/skill-development";
import { departments } from "@/data/skillDevelopmentData";
import Drawer from "@/components/ui/Drawer";
import { TextField, SelectField, FieldLabel } from "@/components/ui/FormFields";

const STATUSES: CertificateStatus[] = ["Valid", "Expiring Soon", "Expired", "Pending Verification"];

const emptyForm = {
  employee: "",
  department: departments[0],
  certificateName: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  status: "Pending Verification" as CertificateStatus,
  fileName: "",
};

export default function CertificateFormDrawer({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial: Certificate | null;
  onSave: (cert: Certificate) => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        employee: initial.employee,
        department: initial.department,
        certificateName: initial.certificateName,
        issuer: initial.issuer,
        issueDate: initial.issueDate,
        expiryDate: initial.expiryDate === "—" ? "" : initial.expiryDate,
        status: initial.status,
        fileName: initial.fileName,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initial, open]);

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.employee.trim()) nextErrors.employee = "Employee name is required.";
    if (!form.certificateName.trim()) nextErrors.certificateName = "Certificate name is required.";
    if (!form.issuer.trim()) nextErrors.issuer = "Issuer is required.";
    if (!form.issueDate.trim()) nextErrors.issueDate = "Issue date is required.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      id: initial?.id ?? `cert-${Math.random().toString(36).slice(2, 8)}`,
      employee: form.employee.trim(),
      department: form.department,
      certificateName: form.certificateName.trim(),
      issuer: form.issuer.trim(),
      issueDate: form.issueDate,
      expiryDate: form.expiryDate.trim() || "—",
      status: form.status,
      fileName: form.fileName || "certificate.pdf",
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={initial ? "Edit Certificate" : "Issue Certificate"}
      description="Certificates appear in the Certification Management list once saved."
    >
      <TextField
        label="Employee"
        placeholder="e.g. Farhan Sheikh"
        value={form.employee}
        error={errors.employee}
        onChange={(e) => setForm({ ...form, employee: e.target.value })}
      />
      <SelectField
        label="Department"
        value={form.department}
        onChange={(e) => setForm({ ...form, department: e.target.value })}
      >
        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
      </SelectField>
      <TextField
        label="Certificate Name"
        placeholder="e.g. AWS Certified Cloud Practitioner"
        value={form.certificateName}
        error={errors.certificateName}
        onChange={(e) => setForm({ ...form, certificateName: e.target.value })}
      />
      <TextField
        label="Issuer"
        placeholder="e.g. Amazon Web Services"
        value={form.issuer}
        error={errors.issuer}
        onChange={(e) => setForm({ ...form, issuer: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Issue Date"
          type="date"
          value={form.issueDate}
          error={errors.issueDate}
          onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
        />
        <TextField
          label="Expiry Date"
          type="date"
          value={form.expiryDate}
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
        />
      </div>
      <SelectField
        label="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value as CertificateStatus })}
      >
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </SelectField>

      {/* <div className="mb-4">
        <FieldLabel>Upload Certificate</FieldLabel>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-line bg-paper/50 px-3 py-3 text-xs text-muted transition-colors hover:border-indigoink hover:text-indigoink">
          <UploadCloud className="h-4 w-4" />
          {form.fileName || "Choose a file (PDF, JPG, PNG)"}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setForm({ ...form, fileName: file.name });
            }}
          />
        </label>
      </div> */}

      <div className="mt-6 flex justify-end gap-2.5">
        <button
          onClick={onClose}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-full bg-indigoink px-4 py-2 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
        >
          {initial ? "Save Changes" : "Issue Certificate"}
        </button>
      </div>
    </Drawer>
  );
}
