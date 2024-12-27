'use client';

import { getLoggedInUserData } from "@/app/(signin-setup)/sign-in/action";
import { supabase } from "@/utils/supabase/supabaseClient";
import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  mobile: string;
  password: string;
  profile_image: string;
  entity_name: string;
}

interface ContextProps {
  userId: UserData | null;
  setUserId: Dispatch<SetStateAction<UserData | null>>;
}

const GlobalContext = createContext<ContextProps>({
  userId: null,
  setUserId: () => null,
});

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<UserData | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getLoggedInUserData();

        if (!user?.id) {
          console.log("No logged-in user found");
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("userId", user?.id) // Ensure the key matches the actual column name in your table
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }

        setUserId(data);
        console.log("User data:", data);
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
      }
    };

    getUser();
  }, []);

  return (
    <GlobalContext.Provider value={{ userId, setUserId }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
