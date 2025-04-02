"use client";

import { AppShell } from "@mantine/core";

import LoadingStatePublic from "@/components/LoadingStatePublic";
import { useEffect, useState } from "react";
import Navbar from "./_components/Navbar";

type PublicLayoutProps = {
  children: React.ReactNode;
};

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingStatePublic />;
  }
  return (
    <AppShell
      header={{
        height: 70,
      }}
    >
      <AppShell.Header>
        <Navbar />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
export default PublicLayout;
