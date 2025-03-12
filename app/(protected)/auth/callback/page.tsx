"use client";

import { getCurrentUser } from "@/actions/get";
import { User, useUserStore } from "@/stores/userStore";
import { Center, Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthCallback = () => {
  const { setUser } = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await getCurrentUser();

      if (res.error) {
        alert("Something went wrong while fetching user data.");
        setLoading(false);
        return;
      }

      if (res.success) {
        setUser(res.data as User);
        router.replace("/dashboard");
      }
    };

    fetchUser();
  }, [setUser, router]);

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" color="blue" />
      </Center>
    );
  }

  return null;
};

export default AuthCallback;
