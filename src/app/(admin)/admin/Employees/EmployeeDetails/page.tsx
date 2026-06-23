"use client";

import { useEffect, useState } from "react";

interface Employee {
  _id: string;
  name: string;
  email: string;
  userId: string;
}

export default function EmployeeDetailsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/allUsers");
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }
        const data = await res.json();
        setEmployees(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch employees");
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Employee List
        </h1>
        <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
          Loading employees...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Employee List
        </h1>
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Employee List
      </h1>
      {employees.length === 0 ? (
        <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
          No employees found
        </div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="border p-2">{employee.userId}</td>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
