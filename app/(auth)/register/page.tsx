"use client";

import Link from "next/link";

import { userRegister } from "@/actions/post";

const RegisterPage = () => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const res = await userRegister(formData);

    if (res?.error) {
      alert(res.message);
      return;
    }

    alert("Registered successfully");
  };
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name">Full name:</label>
      <input id="name" name="name" type="text" required />
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button>Register</button>
      <div>
        Already have an account? <Link href="/login">Log in</Link>
      </div>
    </form>
  );
};

export default RegisterPage;
