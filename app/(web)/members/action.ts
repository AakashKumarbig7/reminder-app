"use server";

import { supabase } from "@/utils/supabase/supabaseClient";


export async function createUser1(email : string, password : string) {
    const { data: authData, error: authError } =  await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Correctly passed within the user data object.
      });
    
      if (authError) {
        console.error("Error during update user: ", authError);
        //return ("Error during user data: " + authError);
        return {error : authError};
      }
      return{data : authData as any};

}

