import * as z from "zod";

export const TicketFormSchema = z.object({
  ticketItemName: z.string().min(1, "Item Name is required"),
  ticketItemDescription: z.string().min(1, "Description is required"),
  ticketQuantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  ticketSpecification: z.string().optional(),
  ticketNotes: z.string().optional(),
  ticketRfDateReceived: z.date().refine((date) => date !== null, {
    message: "RF Date Received is required.",
  }),
  ticketReviewer: z
    .array(z.string())
    .min(1, "At least one reviewer is required"),
});

export const CanvassFormSchema = z.object({
  RfDateReceived: z.date().refine((date) => date !== null, {
    message: "RF Date Received is required.",
  }),
  recommendedSupplier: z.string().min(1, "Recommended Supplier is required"),
  leadTimeDay: z.coerce.number().min(1, "Lead Time Day must be at least 1"),
  quotationPrice: z.number().min(0.01, "Price must be greater than 0"),
  quotationTerms: z.string().min(1, "Terms are required"),
  canvassSheet: z.instanceof(File).refine(
    (file) => {
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      const ALLOWED_FILE_TYPES = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ];
      return (
        ALLOWED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
      );
    },
    {
      message:
        "Invalid file type or size. Please upload an image file (JPEG, PNG, GIF, or WEBP) less than 5MB.",
    }
  ),
  quotation: z.instanceof(File).refine(
    (file) => {
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      const ALLOWED_FILE_TYPES = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ];
      return (
        ALLOWED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
      );
    },
    {
      message:
        "Invalid file type or size. Please upload an image file (JPEG, PNG, GIF, or WEBP) less than 5MB.",
    }
  ),
});
