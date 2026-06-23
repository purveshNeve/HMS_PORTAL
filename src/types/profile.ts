export interface EmployeeProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  gender: "Male" | "Female" | "Other" | "";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed" | "";
  address: string;
  department: string;
  designation: string;
  joiningDate: string | null;
  manager: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  workLocation: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  profileImage: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileSectionData {
  personal: PersonalInfo;
  employment: EmploymentInfo;
  emergency: EmergencyContactInfo;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  gender: string;
  maritalStatus: string;
  address: string;
  userId: string;
}

export interface EmploymentInfo {
  department: string;
  designation: string;
  joiningDate: string | null;
  manager: string;
  employmentType: string;
  workLocation: string;
}

export interface EmergencyContactInfo{
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
}

export interface ProfileCompletionData{
  completed: number;
  total: number;
  percentage: number;
  filledFields: string[];
  emptyFields: string[];
}