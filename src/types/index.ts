export type UserRole = "admin" | "manager" | "employee";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string | null;
}

export interface Employee {
  id: string;
  userId: string;
  employeeNumber: string;
  department: string;
  jobTitle: string;
  managerId?: string | null;
  hireDate: string;
  status: "active" | "inactive" | "on_leave" | "terminated";
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
