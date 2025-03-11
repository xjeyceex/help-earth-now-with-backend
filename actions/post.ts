"use server";

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function userLogin(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/auth/callback");
}

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
        emailError: true,
        message: "Email is already taken",
      };
    }

    console.log(error);

    return {
      error: true,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
};
