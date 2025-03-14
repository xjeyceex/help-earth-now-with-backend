"use server";

import { CanvassDetail } from "@/app/(protected)/tickets/[ticket_id]/page";
import { User } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/server";
import { DashboardTicketType, DropdownType, ReviewerType } from "@/utils/types";

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

export const getAllMyTickets = async ({
  user_id,
}: {
  user_id: string;
  ticket_status?: string;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_all_my_tickets", {
    user_id,
  });

  if (error) {
    console.error("Supabase Error:", error.message);
    return [];
  }

  return data || [];
};

export const getAllUsers = async (ticket_id: string) => {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching current user:", userError?.message);
    return {
      error: true,
      message: "Failed to fetch current user.",
    };
  }

  const currentUserId = user.id;

  // Get ticket creator and shared users in parallel
  const [ticketResponse, sharedUsersResponse] = await Promise.all([
    supabase
      .from("ticket_table")
      .select("ticket_created_by")
      .eq("ticket_id", ticket_id)
      .maybeSingle(),
    supabase
      .from("ticket_shared_with_table")
      .select("shared_user_id")
      .eq("ticket_id", ticket_id),
  ]);

  const { data: ticket, error: ticketError } = ticketResponse;
  const { data: sharedUsers, error: sharedUsersError } = sharedUsersResponse;

  if (ticketError || !ticket?.ticket_created_by) {
    console.error("Error fetching ticket:", ticketError?.message);
    return {
      error: true,
      message: "Failed to fetch ticket data.",
    };
  }

  if (sharedUsersError) {
    console.error("Error fetching shared users:", sharedUsersError.message);
    return {
      error: true,
      message: "Failed to fetch shared users.",
    };
  }

  const ticketCreatorId = ticket.ticket_created_by;
  const sharedUserIds = sharedUsers.map((user) => user.shared_user_id);

  // Exclude current user and ticket creator
  const idsToExclude =
    currentUserId === ticketCreatorId
      ? [currentUserId]
      : [currentUserId, ticketCreatorId];

  // Fetch all users except current user and creator
  const { data, error } = await supabase
    .from("user_table")
    .select("user_id, user_full_name, user_email")
    .not("user_id", "in", `(${idsToExclude.join(",")})`);

  if (error) {
    console.error("Error fetching users:", error.message);
    return {
      error: true,
      message: "An unexpected error occurred while fetching user data.",
    };
  }

  const formattedUsers = data
    .filter((user) => !sharedUserIds.includes(user.user_id))
    .map((user) => ({
      value: user.user_id,
      label: user.user_full_name,
    }));

  return formattedUsers as DropdownType[];
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

export const getCanvassDetails = async ({
  ticketId,
}: {
  ticketId: string;
}): Promise<CanvassDetail[]> => {
  const supabase = await createClient();

  const { data: canvassDetails, error } = await supabase
    .from("canvass_form_table")
    .select(
      `
      *,
      submitted_by:user_table!canvass_form_table_canvass_form_submitted_by_fkey (
        user_id,
        user_full_name,
        user_email,
        user_avatar
      ),
      attachments:canvass_attachment_table (
        canvass_attachment_id,
        canvass_attachment_type,
        canvass_attachment_url,
        canvass_attachment_created_at
      )
    `
    )
    .eq("canvass_form_ticket_id", ticketId);

  if (error) {
    throw new Error(`Error fetching canvass details: ${error.message}`);
  }

  return canvassDetails || [];
};
