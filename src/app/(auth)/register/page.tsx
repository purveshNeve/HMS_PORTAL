"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"EMPLOYEE" | "MANAGER">("EMPLOYEE");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
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

      if (response.status === 400) {
        toast.error(data.message || "User already exists");
        setError(data.message || "User already exists");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
        return;
      }

      if (response.status === 201) {
        toast.success("Registration successful! Logging you in...");
        
        // Auto-login after successful registration
        setTimeout(async () => {
          const signInResult = await signIn("credentials", {
            email,
            password,
            userId,
            role,
            redirect: false,
          });

          if (signInResult?.ok) {
            if (role === "MANAGER") {
              router.push("/manager/dashboard");
            } else {
              router.push("/employee/dashboard");
            }
          } else {
            toast.error("Login failed, please sign in manually");
            router.push("/login");
          }
        }, 1000);
      } else {
        toast.error(data.message || "Registration failed");
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("An error occurred during registration");
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Register a new account to access HRMS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="flex gap-4">
              <Button
                type="button"
                variant={role === "EMPLOYEE" ? "primary" : "secondary"}
                onClick={() => setRole("EMPLOYEE")}
                className="flex-1"
              >
                Employee
              </Button>
              <Button
                type="button"
                variant={role === "MANAGER" ? "primary" : "secondary"}
                onClick={() => setRole("MANAGER")}
                className="flex-1"
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
              placeholder="Enter your full name"
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
              label={role === "EMPLOYEE" ? "Employee ID" : "Manager ID"}
              type="text"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={role === "EMPLOYEE" ? "Enter Employee ID" : "Enter Manager ID"}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
