"use server";

import { createClient } from "@/utils/supabase/server";

export const editComment = async (
  comment_id: string,
  newContent: string
): Promise<void> => {
  const supabase = await createClient();

  // Update the comment content and mark it as edited
  const { error } = await supabase
    .from("comment_table")
    .update({
      comment_content: newContent,
      comment_is_edited: true,
      comment_last_updated: new Date(),
    })
    .eq("comment_id", comment_id); // Ensure we update the correct comment

  if (error) {
    console.error("Error updating comment:", error.message);
    throw new Error("Failed to update comment.");
  }
};
