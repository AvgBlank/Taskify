"use client";
import { FormEvent, useEffect, useState } from "react";
import checkAuth from "@/components/IsAuthenticated";

const Register = () => {
  interface Types {
    name: string;
    email: string;
    pass: string;
    confirmPass: string;
  }

  const [details, setDetails] = useState<Types>({
    name: "",
    email: "",
    pass: "",
    confirmPass: "",
  });
  const [error, setError] = useState<Types>({
    name: "",
    email: "",
    pass: "",
    confirmPass: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const placeholders = {
    name: "Full Name",
    email: "Email",
    pass: "Password",
    confirmPass: "Confirm Password",
  };

  // Checking for valid cookies
  useEffect(() => {
    checkAuth().then((isAuthenticated) => {
      if (isAuthenticated[0 as keyof typeof isAuthenticated]) {
        window.location.href = "/dashboard";
      } else {
        setLoading(false);
      }
    });
  });

  if (loading) return <div>Loading...</div>;

  const validations = (key: keyof Types) => {
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

    const newErrors = {} as Types;
    Object.keys(details).forEach((key) => {
      newErrors[key as keyof Types] = validations(key as keyof Types)();
    });
    setError(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      return;
    }

    try {
      const response = await fetch("/api/users/register", {
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
        setSubmitError(data.error || "Registration failed");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setSubmitError("Network error. Please try again.");
    }
  };

  return (
    <>
      <form className="text-black" noValidate onSubmit={handleSubmit}>
        {Object.keys(details).map((key) => (
          <input
            key={key}
            type={key.toLowerCase().includes("pass") ? "password" : "text"}
            placeholder={placeholders[key as keyof Types]}
            value={details[key as keyof Types]}
            onChange={(e) => {
              setDetails({ ...details, [key]: e.target.value });
            }}
            onBlur={() => {
              setError({ ...error, [key]: validations(key as keyof Types)() });
            }}
          />
        ))}
        <button type="submit" className="bg-red-500 text-white">
          Register
        </button>
        {(error.name ||
          error.email ||
          error.pass ||
          error.confirmPass ||
          submitError) && (
          <p className="text-red-600">
            {error.name ||
              error.email ||
              error.pass ||
              error.confirmPass ||
              submitError}
          </p>
        )}
      </form>
    </>
  );
};

export default Register;
