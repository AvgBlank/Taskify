"use client";
import { FormEvent, useState } from "react";

// TODO: Check if cookie for `refreshToken` exists, if so, redirect to `/dashboard`.

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

  const placeholders = {
    name: "Full Name",
    email: "Email",
    pass: "Password",
    confirmPass: "Confirm Password",
  };

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
        alert(data.error || "Registration failed");
        return;
      }

      alert("Registration successful!");
    } catch {
      alert("Network error. Please try again.");
    }
  };

  return (
    <>
      <form className="text-black" noValidate onSubmit={handleSubmit}>
        {Object.keys(details).map((key) => (
          <input
            key={key}
            type={key === "pass" || key === "confirmPass" ? "password" : "text"}
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
        {(error.name || error.email || error.pass || error.confirmPass) && (
          <p className="text-red-600">
            {error.name || error.email || error.pass || error.confirmPass}
          </p>
        )}
      </form>
    </>
  );
};

export default Register;
