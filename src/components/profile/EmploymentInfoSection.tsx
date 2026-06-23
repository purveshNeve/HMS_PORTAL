"use client";

import { useState } from "react";
import { EmployeeProfile } from "@/types/profile";

interface EmploymentInfoSectionProps {
  profile: EmployeeProfile;
  onUpdate: (updates: Partial<EmployeeProfile>) => Promise<void>;
}

export default function EmploymentInfoSection({
  profile,
  onUpdate,
}: EmploymentInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    department: profile.department || "",
    designation: profile.designation || "",
    joiningDate: profile.joiningDate
      ? new Date(profile.joiningDate).toISOString().split("T")[0]
      : "",
    manager: profile.manager || "",
    employmentType: profile.employmentType || "Full-time",
    workLocation: profile.workLocation || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate({
        ...formData,
        joiningDate: formData.joiningDate
          ? new Date(formData.joiningDate).toISOString()
          : null,
      });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      department: profile.department || "",
      designation: profile.designation || "",
      joiningDate: profile.joiningDate
        ? new Date(profile.joiningDate).toISOString().split("T")[0]
        : "",
      manager: profile.manager || "",
      employmentType: profile.employmentType || "Full-time",
      workLocation: profile.workLocation || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Employment Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                placeholder="e.g., Engineering"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                placeholder="e.g., Senior Developer"
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
            </div>

            {/* Manager */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Manager
              </label>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                placeholder="e.g., John Doe"
              />
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            {/* Work Location */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Work Location
              </label>
              <input
                type="text"
                name="workLocation"
                value={formData.workLocation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                placeholder="e.g., New York Office"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Department" value={profile.department || "Not set"} />
          <InfoField
            label="Designation"
            value={profile.designation || "Not set"}
          />
          <InfoField
            label="Joining Date"
            value={
              profile.joiningDate
                ? new Date(profile.joiningDate).toLocaleDateString()
                : "Not set"
            }
          />
          <InfoField label="Manager" value={profile.manager || "Not set"} />
          <InfoField
            label="Employment Type"
            value={profile.employmentType || "Not set"}
          />
          <InfoField
            label="Work Location"
            value={profile.workLocation || "Not set"}
          />
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
        {label}
      </p>
      <p className="text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}
