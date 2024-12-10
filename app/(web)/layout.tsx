
"use client";
import 'rsuite/dist/rsuite-no-reset.min.css';
import { Toaster } from "@/components/ui/toaster";
import WebNavbar from './components/navbar';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { getLoggedInUserData } from '../(signin-setup)/sign-in/action';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [loggedUserData, setLoggedUserData] = useState<any>(null);
    useEffect(() => {
        const getUser = async () => {
            const user = await getLoggedInUserData();
      
            const { data, error } = await supabase
              .from("users")
              .select("*")
              .eq("userId", user?.id)
              .single();
      
            if (error) {
              console.log(error);
              return;
            }
            console.log(data);
            setLoggedUserData(data);
          };
      
          getUser();
    }, []);
    return (
        <div className="min-h-screen h-full w-full bg-webbg text-black font-inter">
            <main className="w-full">
            <Toaster />
                <div className="w-full flex">
                    <div className="w-full">
                    <WebNavbar loggedUserData={loggedUserData as any} />
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
