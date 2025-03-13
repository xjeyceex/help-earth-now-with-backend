"use server";

import { User } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/server";
import { DashboardTicketType, ReviewerType } from "@/utils/types";

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
      message: "An unexpected error occurred while fetching user data.",
      success: false,
    };
  }

  return {
    success: true,
    data: userData as User,
  };
};

export const getDashboardTickets = async (user_id?: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_dashboard_tickets", {
    _user_id: user_id || null,
  });

  if (error) {
    console.error("Supabase Error:", error.message);
    return [];
  }

  return data as DashboardTicketType[];
};

export const getTicketDetails = async (ticket_id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_ticket_details", {
    ticket_uuid: ticket_id,
  });

  if (error) {
    console.error(" Supabase Error:", error.message);
    return null;
  }

  return data;
};

export const getAllMyTickets = async (filters: {
  user_id: string;
  user_role: string;
  ticket_status?: string;
  ticket_id?: string;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_all_my_tickets", {
    user_id: filters.user_id,
    user_role: filters.user_role,
    ticket_status: filters.ticket_status || null,
    ticket_uuid: filters.ticket_id || null,
  });

  if (error) {
    console.error(" Supabase Error:", error.message);
    return { error: true, message: error.message };
  }

  return data || [];
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
