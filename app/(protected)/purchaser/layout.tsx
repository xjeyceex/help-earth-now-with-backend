"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/userStore";
import { redirect } from "next/navigation";

type PurchaserLayoutProps = {
  children: React.ReactNode;
};

const PurchaserLayout = ({ children }: PurchaserLayoutProps) => {
  const { user } = useUserStore();

  useEffect(() => {
    if (user && user?.user_role !== "PURCHASER") {
      redirect("/auth/callback");
    }
  }, [user]);

  if (!user || user.user_role !== "PURCHASER") {
    return <div>Loading...</div>;
  }

  return <main>{children}</main>;
};
export default PurchaserLayout;
