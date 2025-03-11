import Link from "next/link";

import { userLogin } from "@/actions/post";

const LoginPage = () => {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={userLogin}>Log in</button>
      <div>
        Don't have an account? <Link href="/register">Sign up</Link>
      </div>
    </form>
  );
};

export default LoginPage;
