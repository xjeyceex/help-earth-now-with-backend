"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/userStore";
import { redirect } from "next/navigation";

type ProfileLayoutProps = {
  children: React.ReactNode;
};

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      redirect("/register");
    }
  }, [user]);

  return <main>{children}</main>;
};
export default ProfileLayout;
