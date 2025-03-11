"use server";

import { User } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/server";

export const getCurrentUser = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: true,
      success: false,
      message: error?.message || "No user found.",
    };
  }

  console.log(user);

  const { data: userData, error: userError } = await supabase
    .from("user_table")
    .select("user_role, user_avatar")
    .eq("user_id", user.id)
    .single();

  if (userError) {
    return {
      error: true,
      message: "An unexpected error occurred whiel fetching user data.",
      success: false,
    };
  }

  return {
    success: true,
    data: {
      user_id: user.id,
      user_role: userData?.user_role,
      user_full_name: user.user_metadata.display_name,
      user_email: user.user_metadata.email,
      user_avatar: userData?.user_avatar,
    } as User,
  };
};
