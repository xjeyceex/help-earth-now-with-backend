"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/userStore";
import { redirect } from "next/navigation";

type SupervisorLayoutProps = {
  children: React.ReactNode;
};

const SupervisorLayout = ({ children }: SupervisorLayoutProps) => {
  const { user } = useUserStore();

  useEffect(() => {
    if (user && user?.user_role !== "SUPERVISOR") {
      redirect("/auth/callback");
    }
  }, [user]);

  if (!user || user.user_role !== "SUPERVISOR") {
    return <div>Loading...</div>;
  }

  return <main>{children}</main>;
};
export default SupervisorLayout;
