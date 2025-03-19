"use client";

import { getCurrentUser } from "@/actions/get";
import LoadingStatePublic from "@/components/LoadingStatePublic";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useUserStore } from "@/stores/userStore";
import { UserType } from "@/utils/types";
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
    <main>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flexGrow: 1, paddingLeft: 300 }}>{children}</main>
      </div>
    </main>
  );
};
export default ProtectedLayout;
