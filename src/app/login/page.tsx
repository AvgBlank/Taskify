"use client";
import { FormEvent, useState } from "react";
import checkAuth from "@/components/IsAuthenticated";

const Login = () => {
  // Checking for valid cookies
  checkAuth().then((isAuthenticated) => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    }
  });

  interface Types {
    email: string;
    pass: string;
  }

  const [details, setDetails] = useState<Types>({
    email: "",
    pass: "",
  });
  const [error, setError] = useState("");

  const placeholders = {
    email: "Email",
    pass: "Password",
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: details.email,
          password: details.pass,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        return;
      }
      setError("");

      window.location.href = "/dashboard";
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <>
      <form className="text-black" noValidate onSubmit={handleSubmit}>
        {Object.keys(details).map((key) => (
          <input
            key={key}
            type={key.includes("pass") ? "password" : "text"}
            placeholder={placeholders[key as keyof Types]}
            value={details[key as keyof Types]}
            onChange={(e) => {
              setDetails({ ...details, [key]: e.target.value });
            }}
          />
        ))}
        <button type="submit" className="bg-red-500 text-white">
          Login
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </>
  );
};

export default Login;
