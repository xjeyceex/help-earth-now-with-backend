"use server";

import { createClient } from "@/utils/supabase/server";

export const markNotificationAsRead = async ({
  notification_id,
}: {
  notification_id: string;
}) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notification_table")
    .update({ notification_read: true })
    .eq("notification_id", notification_id);

  if (error) {
    console.error("Error marking notification as read:", error.message);
    return { error: true, message: "Failed to mark notification as read." };
  }

  return { success: true };
};

export const markAllUserNotificationsAsRead = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated.");
  }

  const { error } = await supabase
    .from("notification_table")
    .update({ notification_read: true })
    .eq("notification_user_id", user?.id);

  if (error) {
    console.error("Error marking notification as read:", error.message);
    return { success: false, message: "Failed to mark notification as read." };
  }

  return { success: true };
};

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
