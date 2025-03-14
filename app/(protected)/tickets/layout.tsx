"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/userStore";
import { redirect } from "next/navigation";

type TicketsLayoutProps = {
  children: React.ReactNode;
};

const TicketsLayout = ({ children }: TicketsLayoutProps) => {
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      redirect("/register");
    }
  }, [user]);

  return <main>{children}</main>;
};
export default TicketsLayout;
