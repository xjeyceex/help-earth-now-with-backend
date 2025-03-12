"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function userLogin(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Error:", error.message);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/auth/callback");
}

export const userLogout = async () => {
  const supabase = await createClient();

  const { error: logoutError } = await supabase.auth.signOut();

  if (logoutError) {
    return {
      error: true,
      message: "Failed to logout!",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const userRegister = async (formData: FormData) => {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.name,
      },
    },
  });

  if (error) {
    // If error includes "already registered", it means email exists
    if (error.message.toLowerCase().includes("already registered")) {
      return {
        emailError: true,
        message: "Email is already taken",
      };
    }

    console.log(error);

    return {
      error: true,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
};

export const updateDisplayName = async (newDisplayName: string) => {
  const supabase = await createClient();

  // Update user metadata in Supabase
  const { error } = await supabase.auth.updateUser({
    data: { displayname: newDisplayName },
  });

  if (error) {
    console.error("Error updating display name:", error.message);
    return { error: true, message: error.message };
  }

  // ✅ Refetch the user to get updated metadata
  const { data: refreshedUser, error: fetchError } =
    await supabase.auth.getUser();

  if (fetchError) {
    console.error("Error fetching updated user:", fetchError.message);
    return { error: true, message: fetchError.message };
  }

  // ✅ Revalidate the page so the UI updates
  revalidatePath("/", "layout");

  console.log("Display name updated successfully!");
  return { success: true, user: refreshedUser.user };
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  const supabase = await createClient();

  // Get the currently logged-in user
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError?.message);
    return { error: true, message: "User not authenticated." };
  }

  const userEmail = user?.user?.email;
  if (!userEmail) {
    return { error: true, message: "User email not found." };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: oldPassword,
  });

  if (signInError) {
    console.error("Reauthentication failed:", signInError.message);
    return { error: true, message: "Old password is incorrect." };
  }

  // Update the password after successful reauthentication
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error("Error changing password:", error.message);
    return { error: true, message: error.message };
  }

  console.log("Password updated successfully!");
  return { success: true };
};
