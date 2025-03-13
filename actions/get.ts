"use server";

import { User } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/server";
import { ReviewerType, TicketType } from "@/utils/types";

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

  const { data: userData, error: userError } = await supabase
    .from("user_table")
    .select("*")
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
    data: userData as User,
  };
};

export const getTickets = async (filters: {
  user_role?: string;
  ticket_status?: string;
  assigned_to?: string;
}) => {
  const supabase = await createClient();

  let query = supabase.from("ticket_table").select(
    `*, 
      assigned_user:ticket_assigned_to(user_id, user_full_name, user_email), 
      creator_user:ticket_created_by(user_id, user_full_name, user_email)`
  ); // ✅ Corrected table joins

  // Apply user role filtering only if the user is NOT an admin
  if (filters.user_role && filters.user_role !== "ADMIN") {
    query = query.eq("user_role", filters.user_role);
  }
  if (filters.ticket_status) {
    query = query.eq("ticket_status", filters.ticket_status);
  }
  if (filters.assigned_to) {
    query = query.eq("ticket_assigned_to", filters.assigned_to);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tickets:", error);
    return {
      error: true,
      message: "An unexpected error occurred while fetching tickets.",
    };
  }

  // Replace `ticket_assigned_to` and `ticket_created_by` UUIDs with user details
  const tickets = data.map((ticket) => ({
    ...ticket,
    ticket_assigned_to: ticket.assigned_user?.user_full_name || "Unassigned",
    ticket_created_by: ticket.creator_user?.user_full_name || "Unknown",
  }));

  return tickets as TicketType[];
};

export const getReviewers = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_table")
    .select("user_id, user_full_name, user_email")
    .eq("user_role", "REVIEWER");

  if (error) {
    return {
      error: true,
      message: "An unexpected error occurred whiel fetching user data.",
    };
  }

  return data as ReviewerType[];
};
