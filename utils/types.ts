export type ReviewerType = {
  user_id: string;
  user_full_name: string;
  user_email: string;
};

export type TicketType = {
  ticket_id: string;
  ticket_item_description: string;
  ticket_status: string;
  ticket_created_by: string;
  ticket_quantity: number;
  ticket_specifications: string;
  reviewer: string;
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
  ticket_item_description: string; // ✅ Fixed field name
};
