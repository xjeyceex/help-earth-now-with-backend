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
  ticket_id?: string;
  shared_with?: string;
}) => {
  const supabase = await createClient();

  let query = supabase.from("ticket_table").select(
    `*, 
      creator_user:ticket_created_by(user_id, user_full_name, user_email),
      approval:approval_table(approval_id, approval_review_status, reviewer:user_table(user_id, user_full_name, user_email)),
      shared_users:ticket_shared_with_table(user_table!ticket_shared_with_table_user_id_fkey(user_id, user_full_name, user_email))`
  );

  // Apply filters
  if (filters.ticket_status) {
    query = query.eq("ticket_status", filters.ticket_status);
  }

  if (filters.ticket_id) {
    query = query.eq("ticket_id", filters.ticket_id);
  }

  if (filters.shared_with) {
    query = query.contains(
      "shared_users->user_table->user_id",
      filters.shared_with
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tickets:", error);
    return {
      error: true,
      message: "An unexpected error occurred while fetching tickets.",
    };
  }

  const tickets: TicketType[] = data.map((ticket) => ({
    ...ticket,
    ticket_created_by: ticket.creator_user?.user_full_name || "Unknown",
    reviewer:
      Array.isArray(ticket.approval) && ticket.approval.length > 0
        ? ticket.approval[0]?.reviewer?.user_full_name || "Reviewer Not Found"
        : "Reviewer Not Found",
    approval_status:
      Array.isArray(ticket.approval) && ticket.approval.length > 0
        ? ticket.approval[0]?.approval_review_status || "Pending"
        : "Pending",
    shared_users: Array.isArray(ticket.shared_users)
      ? ticket.shared_users.map(
          (u: {
            user_table: {
              user_id: string;
              user_full_name?: string;
              user_email?: string;
            };
          }) => ({
            user_id: u.user_table.user_id,
            user_full_name: u.user_table.user_full_name ?? "Unknown",
            user_email: u.user_table.user_email ?? "No Email",
          })
        )
      : [],
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
