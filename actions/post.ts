"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { TicketFormSchema } from "@/utils/zod/schema";
import { z } from "zod";

type LoginError = {
  email?: string;
  password?: string;
  form?: string;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function userLogin(
  formData: FormData
): Promise<{ error?: LoginError }> {
  const supabase = await createClient();

  // Validate input data
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return {
      error: {
        email: result.error.flatten().fieldErrors.email?.[0],
        password: result.error.flatten().fieldErrors.password?.[0],
      },
    };
  }

  // Attempt login
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    console.error("Login Error:", error.message);
    return {
      error: { form: "Incorrect email or password. Please try again." },
    };
  }

  // Refresh cache and redirect on success
  revalidatePath("/", "layout");
  redirect("/dashboard");
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
        error: true,
        emailError: true,
        message: "Email is already taken",
      };
    }
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

  return { success: true, user: refreshedUser.user };
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
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

  return { success: true };
};

export const createTicket = async (
  values: z.infer<typeof TicketFormSchema>,
  userId: string
) => {
  const supabase = await createClient();
  const validatedData = TicketFormSchema.parse(values);

  const { data, error } = await supabase
    .from("ticket_table")
    .insert({
      ticket_item_name: validatedData.ticketItemName,
      ticket_item_description: validatedData.ticketItemDescription,
      ticket_quantity: validatedData.ticketQuantity,
      ticket_specifications: validatedData.ticketSpecification,
      ticket_notes: validatedData.ticketNotes,
      ticket_created_by: userId,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: "Failed to create ticket",
    };
  }

  return { success: true, data };
};

export const updateProfilePicture = async (file: File) => {
  const supabase = await createClient();

  // Get logged-in user
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    console.error("Error fetching user:", userError?.message);
    return { error: "User not authenticated." };
  }

  const userId = user.user.id;

  // Fetch current avatar URL
  const { data: userData, error: fetchError } = await supabase
    .from("user_table")
    .select("user_avatar")
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching user avatar:", fetchError.message);
    return { error: fetchError.message };
  }

  // Remove old avatar if it exists
  const oldFilePath = userData?.user_avatar?.replace(
    /^.*\/avatars\//,
    "avatars/"
  );
  if (oldFilePath) await supabase.storage.from("avatars").remove([oldFilePath]);

  // Upload new avatar
  const filePath = `avatars/${userId}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Upload error:", uploadError.message);
    return { error: uploadError.message };
  }

  // Get new public URL
  const publicUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
    .data?.publicUrl;
  if (!publicUrl) return { error: "Failed to retrieve image URL" };

  // Update user profile
  const { error: updateError } = await supabase
    .from("user_table")
    .update({ user_avatar: publicUrl })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Database update error:", updateError.message);
    return { error: updateError.message };
  }

  return { success: true, url: publicUrl };
};

export const shareTicket = async (ticket_id: string, user_id: string) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError.message);
    throw new Error("Failed to fetch current user.");
  }

  const { error } = await supabase.rpc("share_ticket", {
    _ticket_id: ticket_id,
    _shared_user_id: user_id,
    _assigned_by: user?.id,
  });

  if (error) {
    console.error("Error sharing ticket:", error.message);
    throw new Error("Failed to share ticket");
  }
};
