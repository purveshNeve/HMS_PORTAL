"use client";

import { ChangeEvent, useRef } from "react";
import { CardData, BLOOD_GROUPS } from "@/types/types";

interface FormFieldsProps {
  data: CardData;
  onChange: (field: keyof CardData, value: string) => void;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-300";

export default function FormFields({ data, onChange }: FormFieldsProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        onChange("photoUrl", ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Photo upload */}
      <Field label="Photo">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 transition cursor-pointer text-left"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="truncate">
            {data.photoUrl ? "Photo selected ✓" : "Upload photo"}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhoto}
        />
      </Field>

      {/* Name */}
      <Field label="Full Name">
        <input
          className={inputClass}
          type="text"
          placeholder="e.g. Purvesh"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </Field>

      {/* Role */}
      <Field label="Role / Designation">
        <input
          className={inputClass}
          type="text"
          placeholder="e.g. Software Intern"
          value={data.role}
          onChange={(e) => onChange("role", e.target.value)}
        />
      </Field>

      {/* Department */}
      <Field label="Department">
        <input
          className={inputClass}
          type="text"
          placeholder="e.g. IT Department"
          value={data.department}
          onChange={(e) => onChange("department", e.target.value)}
        />
      </Field>

      {/* Employee ID */}
      <Field label="Employee ID">
        <input
          className={inputClass}
          type="text"
          placeholder="e.g. EMP1024"
          value={data.employeeId}
          onChange={(e) => onChange("employeeId", e.target.value)}
        />
      </Field>

      {/* Date of joining */}
      <Field label="Date of Joining">
        <input
          className={inputClass}
          type="date"
          value={data.dateOfJoining}
          onChange={(e) => onChange("dateOfJoining", e.target.value)}
        />
      </Field>

      {/* Email */}
      <Field label="Email">
        <input
          className={inputClass}
          type="email"
          placeholder="name@example.com"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </Field>

      {/* Phone */}
      <Field label="Phone">
        <input
          className={inputClass}
          type="text"
          placeholder="+91 98765 43210"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </Field>

      {/* Blood Group */}
      <Field label="Blood Group">
        <select
          className={inputClass}
          value={data.bloodGroup}
          onChange={(e) => onChange("bloodGroup", e.target.value)}
        >
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
      </Field>

      {/* Org name */}
      <Field label="Organisation Name">
        <input
          className={inputClass}
          type="text"
          placeholder="e.g. HMS Portal"
          value={data.orgName}
          onChange={(e) => onChange("orgName", e.target.value)}
        />
      </Field>

      {/* Org tagline */}
      <Field label="Organisation Tagline">
        <input
          className={inputClass}
          type="text"
          placeholder="e.g. Human Management System"
          value={data.orgTagline}
          onChange={(e) => onChange("orgTagline", e.target.value)}
        />
      </Field>
    </div>
  );
}
