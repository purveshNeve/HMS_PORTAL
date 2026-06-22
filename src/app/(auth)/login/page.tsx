"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"EMPLOYEE" | "MANAGER">("EMPLOYEE");
  const [userId , setUserId] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        userId,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Registration failed");
      return;
    }
    alert("Registration successful!");
  } catch (error) {
    setError("Something went wrong.");
  } finally {
    setIsLoading(false);
  }
    if(role === "MANAGER"){
      router.push("/manager/dashboard");
    } else {
      router.push("/employee/dashboard");
    }
    router.refresh();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to HRMS</CardTitle>
        <CardDescription>Enter your credentials to access the portal</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="flex gap-4">
            <Button
              type="button"
              variant={role === "EMPLOYEE" ? "primary" : "secondary"}
              onClick={() => setRole("EMPLOYEE")}
            >
              Employee
            </Button>
            <Button
              type="button"
              variant={role === "MANAGER" ? "primary" : "secondary"}
              onClick={() => setRole("MANAGER")}
            >
              Manager
            </Button>
          </div>
          <Input
            label="Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label = {role === "EMPLOYEE" ? "Employee ID" : "Manager ID"}
            type="text"
            name="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder={
              role === "EMPLOYEE"
                ? "Enter Employee ID"
                : "Enter Manager ID"
            }
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : `Sign in as ${role === "EMPLOYEE" ? "Employee" : "Manager"}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
