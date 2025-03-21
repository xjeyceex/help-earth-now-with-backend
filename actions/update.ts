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

export const updateApprovalStatus = async ({
  approval_ticket_id,
  approval_review_status,
  approval_reviewed_by,
}: {
  approval_ticket_id: string;
  approval_review_status: string;
  approval_reviewed_by: string;
}) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("approval_table")
    .update({
      approval_review_status,
      approval_review_date: new Date(),
    })
    .eq("approval_ticket_id", approval_ticket_id)
    .eq("approval_reviewed_by", approval_reviewed_by);

  if (error) {
    console.error("Error updating approval status:", error.message);
    return { success: false, message: "Failed to update approval status." };
  }

  return { success: true };
};
