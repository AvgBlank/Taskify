"use client";

import * as React from "react";
import { FormEvent, useEffect, useState } from "react";
import checkAuth from "@/lib/isAuthenticated";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import apiFetch from "../../lib/apiFetch";

interface RegisterFormData {
  name: string;
  email: string;
  pass: string;
  confirmPass: string;
}

export default function Register() {
  const { resolvedTheme } = useTheme();
  const [details, setDetails] = useState<RegisterFormData>({
    name: "",
    email: "",
    pass: "",
    confirmPass: "",
  });
  const [loading, setLoading] = useState(true);
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confShowPassword, setConfShowPassword] = useState(false);

  useEffect(() => {
    setNotyf(new Notyf());
  }, []);

  useEffect(() => {
    (async () => {
      const { valid } = await checkAuth();
      if (valid) {
        window.location.href = "/dashboard";
      } else {
        setLoading(false);
      }
    })();
  }, []);

  const validations = (key: keyof RegisterFormData) => {
    const errors = {
      name: () => {
        if (!details.name) return "Please enter a valid name";
        if (/[0-9\p{P}]/u.test(details.name))
          return "Please enter a valid name";
        return "";
      },
      email: () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email))
          return "Please enter a valid email";
        return "";
      },
      pass: () => {
        if (details.pass.includes(" ")) return "Password cannot contain spaces";
        if (details.pass.length < 7)
          return "Password must be at least 8 characters long";
        return "";
      },
      confirmPass: () => {
        if (details.confirmPass !== details.pass)
          return "Passwords do not match";
        return "";
      },
    };
    return errors[key];
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (const key of Object.keys(details)) {
      const errorMsg = validations(key as keyof RegisterFormData)();

      if (errorMsg && notyf) {
        notyf.error(errorMsg);
        return;
      }
    }

    try {
      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          password: details.pass,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (notyf) {
          notyf.error(data.error || "Registration failed");
        }
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      if (notyf) {
        notyf.error("Network error. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin"
          width="32"
          height="32"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M236,128a108,108,0,0,1-216,0c0-42.52,24.73-81.34,63-98.9A12,12,0,1,1,93,50.91C63.24,64.57,44,94.83,44,128a84,84,0,0,0,168,0c0-33.17-19.24-63.43-49-77.09A12,12,0,1,1,173,29.1C211.27,46.66,236,85.48,236,128Z"></path>
        </svg>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center">
      <div className="hidden flex-1 flex-col justify-center space-y-6 h-screen relative bg-muted/50 px-10 py-20 md:flex">
        <Image
          src={
            resolvedTheme === "dark"
              ? "/taskify-light.svg"
              : "/taskify-dark.svg"
          }
          alt="Taskify Logo"
          width={128}
          height={32}
          className="absolute left-5 top-5"
          priority
        />
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Manage your tasks easily!
          </h1>
          <p className="text-muted-foreground">
            Your personal task management solution
          </p>
        </div>
        <Image
          src="/task-management.png"
          alt="Task Management"
          width={780}
          height={650}
          className="w-full"
          priority
        />
      </div>
      <div className="flex-1 p-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <Card className="mx-auto max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              Welcome
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Name"
                  value={details.name}
                  onChange={(e) =>
                    setDetails({ ...details, name: e.target.value })
                  }
                  onBlur={() => {
                    const errorMsg = validations("name")();
                    if (errorMsg && notyf) {
                      notyf.error(errorMsg);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Email"
                  value={details.email}
                  onChange={(e) =>
                    setDetails({ ...details, email: e.target.value })
                  }
                  onBlur={() => {
                    const errorMsg = validations("email")();
                    if (errorMsg && notyf) {
                      notyf.error(errorMsg);
                    }
                  }}
                />
              </div>
              <div className="relative ">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={details.pass}
                  onChange={(e) =>
                    setDetails({ ...details, pass: e.target.value })
                  }
                  onBlur={() => {
                    setShowPassword(false);
                    const errorMsg = validations("pass")();
                    if (errorMsg && notyf) {
                      notyf.error(errorMsg);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 p-0 hover:bg-transparent top-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="relative ">
                <Input
                  type={confShowPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={details.confirmPass}
                  onChange={(e) =>
                    setDetails({ ...details, confirmPass: e.target.value })
                  }
                  onBlur={() => {
                    setConfShowPassword(false);
                    const errorMsg = validations("confirmPass")();
                    if (errorMsg && notyf) {
                      notyf.error(errorMsg);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 p-0 hover:bg-transparent top-0"
                  onClick={() => setConfShowPassword(!confShowPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
                  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
                  window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path
                    className="fill-black dark:fill-white"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  />
                </svg>
                Sign Up with Google
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
