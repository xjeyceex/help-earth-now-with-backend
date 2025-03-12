"use client";

import { userLogin } from "@/actions/post";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const handleSubmit = async (formData: FormData) => {
    const result = await userLogin(formData);

    if (result?.error) {
      setErrors(result.error);
    } else {
      setErrors({});
    }
  };

  return (
    <form action={handleSubmit}>
      {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}

      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

      <button type="submit">Log in</button>

      <div>
        Dont have an account? <Link href="/register">Sign up</Link>
      </div>
    </form>
  );
};

export default LoginPage;
