"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { TicketFormSchema } from "@/utils/zod/schema";

type LoginError = {
  email?: string;
  password?: string;
  form?: string;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function userLogin(
  formData: FormData
): Promise<{ error?: LoginError }> {
  const supabase = await createClient();

  // Validate input data
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return {
      error: {
        email: result.error.flatten().fieldErrors.email?.[0],
        password: result.error.flatten().fieldErrors.password?.[0],
      },
    };
  }

  // Attempt login
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    console.error("Login Error:", error.message);
    return {
      error: { form: "Incorrect email or password. Please try again." },
    };
  }

  // Refresh cache and redirect on success
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export const userLogout = async () => {
  const supabase = await createClient();

  const { error: logoutError } = await supabase.auth.signOut();

  if (logoutError) {
    return {
      error: true,
      message: "Failed to logout!",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const userRegister = async (formData: FormData) => {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.name,
      },
    },
  });

  if (error) {
    // If error includes "already registered", it means email exists
    if (error.message.toLowerCase().includes("already registered")) {
      return {
        error: true,
        emailError: true,
        message: "Email is already taken",
      };
    }
    return {
      error: true,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
};

export const updateDisplayName = async (newDisplayName: string) => {
  const supabase = await createClient();

  // Update user metadata in Supabase
  const { error } = await supabase.auth.updateUser({
    data: { displayname: newDisplayName },
  });

  if (error) {
    console.error("Error updating display name:", error.message);
    return { error: true, message: error.message };
  }

  // Refetch the user to get updated metadata
  const { data: refreshedUser, error: fetchError } =
    await supabase.auth.getUser();

  if (fetchError) {
    console.error("Error fetching updated user:", fetchError.message);
    return { error: true, message: fetchError.message };
  }

  // Revalidate the page so the UI updates
  revalidatePath("/", "layout");

  return { success: true, user: refreshedUser.user };
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const supabase = await createClient();

  // Get the currently logged-in user
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError?.message);
    return { error: true, message: "User not authenticated." };
  }

  const userEmail = user?.user?.email;
  if (!userEmail) {
    return { error: true, message: "User email not found." };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: oldPassword,
  });

  if (signInError) {
    console.error("Reauthentication failed:", signInError.message);
    return { error: true, message: "Old password is incorrect." };
  }

  // Update the password after successful reauthentication
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error("Error changing password:", error.message);
    return { error: true, message: error.message };
  }

  return { success: true };
};

export const createTicket = async (
  values: z.infer<typeof TicketFormSchema>,
  userId: string
) => {
  const supabase = await createClient();
  const validatedData = TicketFormSchema.parse(values);

  const { data: ticket, error: ticketError } = await supabase
    .from("ticket_table")
    .insert({
      ticket_item_name: validatedData.ticketItemName,
      ticket_item_description: validatedData.ticketItemDescription,
      ticket_quantity: validatedData.ticketQuantity,
      ticket_specifications: validatedData.ticketSpecification,
      ticket_notes: validatedData.ticketNotes,
      ticket_created_by: userId,
    })
    .select()
    .single();

  if (ticketError) {
    return {
      success: false,
      message: "Failed to create ticket",
    };
  }

  return { success: true, ticket_id: ticket.ticket_id };
};

export const updateProfilePicture = async (file: File) => {
  const supabase = await createClient();

  // Get logged-in user
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    console.error("Error fetching user:", userError?.message);
    return { error: "User not authenticated." };
  }

  const userId = user.user.id;

  // Fetch current avatar URL
  const { data: userData, error: fetchError } = await supabase
    .from("user_table")
    .select("user_avatar")
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching user avatar:", fetchError.message);
    return { error: fetchError.message };
  }

  // Remove old avatar if it exists
  const oldFilePath = userData?.user_avatar?.replace(
    /^.*\/avatars\//,
    "avatars/"
  );
  if (oldFilePath) await supabase.storage.from("avatars").remove([oldFilePath]);

  // Upload new avatar
  const filePath = `avatars/${userId}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Upload error:", uploadError.message);
    return { error: uploadError.message };
  }

  // Get new public URL
  const publicUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
    .data?.publicUrl;
  if (!publicUrl) return { error: "Failed to retrieve image URL" };

  // Update user profile
  const { error: updateError } = await supabase
    .from("user_table")
    .update({ user_avatar: publicUrl })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Database update error:", updateError.message);
    return { error: updateError.message };
  }

  return { success: true, url: publicUrl };
};

export const shareTicket = async (ticket_id: string, user_id: string) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError.message);
    throw new Error("Failed to fetch current user.");
  }

  const { error } = await supabase.rpc("share_ticket", {
    _ticket_id: ticket_id,
    _shared_user_id: user_id,
    _assigned_by: user?.id,
  });

  if (error) {
    console.error("Error sharing ticket:", error.message);
    throw new Error("Failed to share ticket");
  }
};

export const createCanvass = async ({
  supplierName,
  quotationPrice,
  quotationTerms,
  canvassSheet,
  quotation,
  ticketId,
}: {
  supplierName: string;
  quotationPrice: number;
  quotationTerms: string;
  canvassSheet: File;
  quotation: File;
  ticketId: string;
}) => {
  try {
    const BUCKET_NAME = "canvass-attachments";
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return {
        error: true,
        message: "User not authenticated.",
      };
    }

    const userId = user.id;

    // Helper function to upload a file and get its URL
    const uploadFile = async (file: File, fileType: string) => {
      const extension = file.name.split(".").pop();
      const fileName = `${fileType}_${uuidv4()}.${extension}`;
      const filePath = `${ticketId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Failed to upload ${fileType}: ${uploadError.message}`);
      }

      const { data: urlData } = await supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return {
        path: filePath,
        publicUrl: urlData?.publicUrl,
      };
    };

    // Upload files
    const [canvassSheetResult, quotationResult] = await Promise.all([
      uploadFile(canvassSheet, "canvass_sheet"),
      uploadFile(quotation, "quotation"),
    ]);

    // Store canvass form data
    const { error: canvassFormError, data: canvassFormData } = await supabase
      .from("canvass_form_table")
      .insert({
        canvass_form_ticket_id: ticketId,
        canvass_form_supplier_name: supplierName,
        canvass_form_quotation_price: quotationPrice,
        canvass_form_quotation_terms: quotationTerms,
        canvass_form_attachment_url: quotationResult.publicUrl,
        canvass_form_submitted_by: userId,
      })
      .select()
      .single();

    if (canvassFormError) {
      throw new Error(
        `Failed to insert canvass form: ${canvassFormError.message}`
      );
    }

    const canvassFormId = canvassFormData?.canvass_form_id;

    console.log(canvassFormId);

    // Prepare attachments data
    const attachments = [
      {
        canvass_attachment_canvass_form_id: canvassFormId,
        canvass_attachment_type: "CANVASS_SHEET",
        canvass_attachment_url: canvassSheetResult.publicUrl,
      },
      {
        canvass_attachment_canvass_form_id: canvassFormId,
        canvass_attachment_type: "QUOTATION",
        canvass_attachment_url: quotationResult.publicUrl,
      },
    ];

    // Insert all attachments at once
    const { error: attachmentsError } = await supabase
      .from("canvass_attachment_table")
      .insert(attachments);

    if (attachmentsError) {
      throw new Error(
        `Failed to insert attachments: ${attachmentsError.message}`
      );
    }

    // Revalidate paths to reflect changes
    revalidatePath(`/canvass/${canvassFormId}`);
    revalidatePath(`/canvass`);

    return {
      success: true,
      message: "Canvass created successfully",
      canvassFormId,
    };
  } catch (error) {
    console.error("Error creating canvass:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
