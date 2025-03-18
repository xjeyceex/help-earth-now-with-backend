"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export const deleteUser = async () => {
  const supabase = await createClient();

  // Delete the user's auth account
  const { error: deleteError } = await supabase.rpc("delete_user");

  if (deleteError) {
    throw new Error("Failed to delete user account. Please try again.");
  }

  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/");
};

export const deleteComment = async (comment_id: string): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("comment_table")
    .delete()
    .eq("comment_id", comment_id);

  if (error) {
    console.error("Error deleting comment:", error.message);
    throw new Error("Failed to delete comment.");
  }
};
