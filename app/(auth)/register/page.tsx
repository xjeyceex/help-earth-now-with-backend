"use client";

import { userRegister } from "@/actions/post";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const res = await userRegister(formData);

    if (res?.error) {
      alert(res.message);
      return;
    }

    alert("Registration successful! Please confirm your email.");
    router.push("/login"); // Redirect to login page after success
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
