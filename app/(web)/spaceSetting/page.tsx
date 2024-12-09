"use client";
import SpaceSetting from '@/app/(web)/components/spaceSetting';
import WebNavbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLoggedInUserData } from '@/app/(signin-setup)/sign-in/action';
import { supabase } from '@/utils/supabase/supabaseClient';

// export default function SettingPage()
// {
//     return 
//     (
//         <>
//         <SpaceSetting/>
//         </>
//     )
    
// }
const SettingsPage = () => {

    const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [loggedUserData, setLoggedUserData] = useState<any>(null);

  useEffect(() => {
    const redirectToTask = () => {
      route.push("/home");
    };

    if (window.innerWidth <= 992) {
      redirectToTask();
      setLoading(false);
      return;
    } else {
      route.push("/spaceSetting");
      setLoading(false);
    }

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

  }, [route]);

  if (loading) {
    return (
      <div className="loader w-full h-screen flex justify-center items-center">
        <div className="flex items-center gap-1">
          <p className="w-5 h-5 bg-black rounded-full animate-bounce"></p>
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </div>
    ); // Simple loader UI
  }

  return (
    <>
        <WebNavbar loggedUserData={loggedUserData as any} />
      <SpaceSetting/> 
    </>
  );
};

export default SettingsPage;