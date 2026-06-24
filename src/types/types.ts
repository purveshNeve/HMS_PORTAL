export interface CardData {
  name: string;
  role: string;
  department: string;
  employeeId: string;
  dateOfJoining: string;
  email: string;
  phone: string;
  bloodGroup: string;
  orgName: string;
  orgTagline: string;
  photoUrl: string | null;
}

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

export const DEFAULT_CARD_DATA: CardData = {
  name: "Purvesh",
  role: "Software Intern",
  department: "IT Department",
  employeeId: "EMP1024",
  dateOfJoining: "2025-01-01",
  email: "purvesh@example.com",
  phone: "+91 98765 43210",
  bloodGroup: "O+",
  orgName: "HMS PORTAL",
  orgTagline: "Human Management System",
  photoUrl: null,
};
