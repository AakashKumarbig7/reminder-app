"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Fetch user data
export async function getLoggedInUserData() {
  const supabase = createClient();
  // const { data, error } = await supabase.auth.getUser();

  // if (error) {
  //   console.error("Error fetching user data:", error.message);
  //   return null;
  // }

  // if (data?.user) {
  //   console.log("User ID:", data.user.id);
  //   return data.user;
  // }

  // return null;

  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    return data.user;
  } else {
    return null;
  }
}

// Sign in function
export async function signIn(email : string, password : string) {
  const supabase = createClient();
  console.log("Attempting sign-in with email:", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign-in error:", error.message);
    return { error: error.message };
  }

  console.log("Sign-in successful:", data);

  // Fetch user data
  const user = await getLoggedInUserData();
  if (!user) {
    return { error: "Failed to fetch user data after sign-in." };
  }
  // redirect("/dashboard");

  // console.log(window.innerWidth, " window width");

 // Check the device screen size and redirect accordingly
//  if (typeof window !== "undefined") {

//   // Initial screen size check and redirection
//   const screenWidth = window.innerWidth;

//   if (screenWidth >= 1024) {
//     redirect("/dashboard"); // Large devices
//   } else if (screenWidth <= 1024) {
//     redirect("/home"); // Medium devices
//   }
// }


}
