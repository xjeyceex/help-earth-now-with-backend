"use client";

import { getCurrentUser } from "@/actions/get";
import LoadingStatePublic from "@/components/LoadingStatePublic";
import MobileSidebar from "@/components/MobileSidebar";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useUserStore } from "@/stores/userStore";
import { UserType } from "@/utils/types";
import { Box, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect } from "react";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUser();

      if (res.error) {
        notifications.show({
          title: "Error",
          message: "Something went wrong.",
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
        return;
      }

      if (res.success) {
        setUser(res.data as UserType);
      }
    };

    fetchUser();
  }, [setUser]);

  if (!user) return <LoadingStatePublic />;

  return (
    <Flex style={{ minHeight: "100vh" }}>
      <Sidebar />
      <MobileSidebar />
      <Box
        style={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "padding-left 0.3s ease-in-out",
        }}
        pl={{ base: 0, md: "300px" }}
      >
        <Navbar />
        <Box
          p="md"
          style={{
            flex: 1,
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default ProtectedLayout;
