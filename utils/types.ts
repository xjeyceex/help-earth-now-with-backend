export type ReviewerType = {
  user_id: string;
  user_full_name: string;
  user_email: string;
};

export type TicketType = {
  ticket_id: string;
  ticket_item_description: string;
  ticket_assigned_to: string;
  ticket_status: string;
  ticket_created_by: string;
  ticket_quantity: number;
  ticket_specifications: string;
};
