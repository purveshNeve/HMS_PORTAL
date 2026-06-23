import { EmployeeProfile, ProfileCompletionData } from "@/types/profile";

const PROFILE_FIELDS = {
  personal: [
    "name",
    "email",
    "phone",
    "dateOfBirth",
    "gender",
    "maritalStatus",
    "address",
  ],
  employment: [
    "department",
    "designation",
    "joiningDate",
    "manager",
    "employmentType",
    "workLocation",
  ],
  emergency: [
    "emergencyContactName",
    "emergencyContactRelationship",
    "emergencyContactPhone",
  ],
};

export function calculateProfileCompletion(
  profile: Partial<EmployeeProfile>
): ProfileCompletionData {
  const allFields = [
    ...PROFILE_FIELDS.personal,
    ...PROFILE_FIELDS.employment,
    ...PROFILE_FIELDS.emergency,
  ];

  const filledFields: string[] = [];
  const emptyFields: string[] = [];

  allFields.forEach((field) => {
    const value = (profile as any)[field];
    const isFilled =
      value !== null &&
      value !== undefined &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0);

    if (isFilled) {
      filledFields.push(field);
    } else {
      emptyFields.push(field);
    }
  });

  const completed = filledFields.length;
  const total = allFields.length;
  const percentage = Math.round((completed / total) * 100);

  return {
    completed,
    total,
    percentage,
    filledFields,
    emptyFields,
  };
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function parseDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toISOString();
}
