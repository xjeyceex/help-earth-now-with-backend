export type UserType = {
  user_id: string;
  user_role: string;
  user_full_name: string;
  user_email: string;
  user_avatar: string;
};

export type ReviewerType = {
  user_id: string;
  user_full_name: string;
  user_email: string;
};

export type DropdownType = {
  value: string;
  label: string;
};

export type TicketDetailsType = {
  ticket_id: string;
  ticket_item_description: string;
  ticket_status: string;
  ticket_created_by: string;
  ticket_quantity: number;
  ticket_specifications: string;
  ticket_created_by_name: string;
  reviewers: {
    reviewer_id: string;
    reviewer_name: string;
    approval_status: string;
  }[];
  approval_status: string;
  ticket_date_created: string;
  ticket_last_updated: string;
  shared_users: {
    user_id: string;
    user_full_name: string;
    user_email: string;
  }[];
};

export type DashboardTicketType = {
  ticket_id: string;
  ticket_status: string;
  ticket_item_description: string;
};

export type MyTicketType = {
  ticket_id: string;
  ticket_status: string;
  ticket_item_description: string;
  ticket_created_by: string;
  shared_user_id: string | null;
  approval_status: string | null;
  approval_reviewed_by: string | null;
  reviewers: {
    reviewer_id: string;
    reviewer_name: string;
    approval_status: string;
  }[];
  shared_users?: { user_id: string; user_full_name: string }[];
};
