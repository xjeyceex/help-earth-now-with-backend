"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/userStore";
import { redirect } from "next/navigation";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      redirect("/register");
    }
  }, [user]);

  return <main>{children}</main>;
};
export default DashboardLayout;
