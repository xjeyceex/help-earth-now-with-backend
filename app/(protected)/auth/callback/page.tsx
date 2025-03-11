"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

import { getCurrentUser } from "@/actions/get";
import { User, useUserStore } from "@/stores/userStore";

const AuthCallback = () => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      if (user?.user_role === "PURCHASER") {
        redirect("/purchaser");
      } else if (user?.user_role === "SUPERVISOR") {
        redirect("/supervisor");
      } else if (user?.user_role === "MANAGER") {
        redirect("/manager");
      }
    }, 1500);

    return () => clearTimeout(redirectTimer);
  }, [user?.user_role]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUser();

      if (res.error) {
        alert("Something went wrong while fetching user data.");
        return;
      }

      if (res.success) {
        setUser(res.data as User);
      }
    };

    fetchUser();
  }, []);

  return <div>Redirecting...</div>;
};
export default AuthCallback;
