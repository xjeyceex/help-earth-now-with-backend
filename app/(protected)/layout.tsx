"use client";

import { getCurrentUser } from "@/actions/get";
import LoadingState from "@/components/LoadingState";
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

  if (!user) return <LoadingState />;

  return <main>{children}</main>;
};
export default ProtectedLayout;
