"use client";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";
import { UserType } from "@/utils/types";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthCallback = () => {
  const router = useRouter();
  const { setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient();

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        notifications.show({
          title: "Error",
          message: "Authentication failed. Please try again.",
          color: "red",
        });
        router.push("/"); // Redirect to home on failure
        return;
      }

      const supabaseUser = data.session.user;

      const user: UserType = {
        user_id: supabaseUser.id,
        user_role: "user",
        user_full_name: supabaseUser.user_metadata?.full_name || "Unnamed User",
        user_email: supabaseUser.email || "",
        user_avatar: supabaseUser.user_metadata?.avatar_url || "",
      };

      setUser(user);

      notifications.show({
        title: "Success",
        message: "Signed in with Google!",
        color: "green",
      });

      router.push("/dashboard"); // Redirect after setting user
    };

    fetchUser();
  }, [router, setUser]);

  return <div>Processing authentication...</div>;
};

export default AuthCallback;
