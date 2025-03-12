import * as z from "zod";

export const TicketFormSchema = z.object({
  ticketItemName: z.string().min(1, "Item Name is required"),
  ticketItemDescription: z.string().min(1, "Description is required"),
  ticketQuantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  ticketSpecification: z.string().optional(),
  ticketNotes: z.string().optional(),
  ticketReviewer: z
    .array(z.string())
    .min(1, "At least one reviewer is required"),
});
