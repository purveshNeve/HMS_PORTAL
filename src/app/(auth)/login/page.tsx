"use client";
export const dynamic = "force-dynamic";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"EMPLOYEE" | "MANAGER">("EMPLOYEE");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if redirected from registration page
    const registered = searchParams.get("registered");
    if (registered === "true") {
      toast.success("Registration successful! Please sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        userId,
        role,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Invalid credentials");
        setError(result.error || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Login successful!");
        setTimeout(() => {
          if (role === "MANAGER") {
            router.push("/manager/dashboard");
          } else {
            router.push("/employee/dashboard");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An error occurred during login");
      setError("An error occurred during login");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md">
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
              label={role === "EMPLOYEE" ? "Employee ID" : "Manager ID"}
              type="text"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={role === "EMPLOYEE" ? "Enter Employee ID" : "Enter Manager ID"}
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
              placeholder="Enter your password"
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="flex flex-col gap-2 text-center text-sm">
              <Link href="/forgetPasswordPage" className="text-blue-600 hover:underline dark:text-blue-400">
                Forgot password?
              </Link>
              <span>
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
                  Create one
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
