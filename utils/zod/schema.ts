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

const FileSchema = z.instanceof(File).refine(
  (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_FILE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    return ALLOWED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE;
  },
  {
    message:
      "Invalid file type or size. Please upload an image file (JPEG, PNG, GIF, WEBP) or PDF less than 5MB.",
  },
);

export const CanvassFormSchema = z.object({
  RfDateReceived: z.date().refine((date) => date !== null, {
    message: "RF Date Received is required.",
  }),
  recommendedSupplier: z.string().min(1, "Recommended Supplier is required"),
  leadTimeDay: z.coerce.number().min(1, "Lead Time Day must be at least 1"),
  totalAmount: z.number().min(0.01, "Price must be greater than 0"),
  paymentTerms: z.string().min(1, "Terms are required"),
  canvassSheet: FileSchema,
  quotations: z
    .array(
      z.object({
        file: z.union([FileSchema, z.undefined()]).optional(),
      }),
    )
    .min(1, "At least one quotation is required")
    .max(4, "Maximum of 4 quotations allowed")
    .refine((quotations) => quotations[0]?.file instanceof File, {
      message: "First quotation is required",
      path: ["0", "file"],
    }),
});
