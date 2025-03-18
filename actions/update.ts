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
