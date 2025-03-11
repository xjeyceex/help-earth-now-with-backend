"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/userStore";
import { redirect } from "next/navigation";

type ManagerLayoutProps = {
  children: React.ReactNode;
};

const ManagerLayout = ({ children }: ManagerLayoutProps) => {
  const { user } = useUserStore();

  useEffect(() => {
    if (user && user?.user_role !== "MANAGER") {
      redirect("/auth/callback");
    }
  }, [user]);

  if (!user || user.user_role !== "MANAGER") {
    return <div>Loading...</div>;
  }

  return <main>{children}</main>;
};
export default ManagerLayout;
