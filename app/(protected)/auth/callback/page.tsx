"use client";

import { getCurrentUser } from "@/actions/get";
import { User, useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthCallback = () => {
  const { setUser } = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await getCurrentUser();

      if (res.error) {
        alert("Something went wrong while fetching user data.");
        setLoading(false);
        return;
      }

      if (res.success) {
        setUser(res.data as User);
        router.replace("/dashboard"); // Correct way to redirect
      }
    };

    fetchUser();
  }, [setUser, router]); // No empty array to ensure fresh data is always fetched

  return <div>{loading ? "Redirecting..." : "Failed to fetch user data"}</div>;
};

export default AuthCallback;
