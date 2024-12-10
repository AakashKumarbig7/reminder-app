"use client";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { logout } from "@/app/(signin-setup)/logout/action";
import { getLoggedInUserData } from "@/app/(signin-setup)/sign-in/action";
import { supabase } from "@/utils/supabase/supabaseClient";

interface loggedUserDataProps {
  loggedUserData : any
}

const WebNavbar : React.FC<loggedUserDataProps> = ({ loggedUserData}) => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  // const [loggedUserData, setLoggedUserData] = useState<any>(null);

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoggingOut(true); // Show loader when logging out
    await logout();
    setIsLoggingOut(false); // Hide loader after logout completes
  };

  console.log(loggedUserData, " loggedUserData");


  return (
    <>
      <div className="flex items-center justify-between w-full py-2 px-3">
        <Image
          src="/images/menu-top_bar.png"
          alt="Logo"
          width={84}
          height={44}
          className="w-[84px] h-[44px]"
        />
        <div className="flex items-center gap-2">
          {/* <Button className="bg-white text-black hover:bg-gray-50"><LogOut /></Button> */}

          <Select>
            <SelectTrigger className="w-[200px] h-[44px] bg-white focus-visible:border-none focus-visible:outline-none text-sm font-bold shadow-none pl-2 justify-start gap-1">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-1">
            <Image
                  src={loggedUserData?.profile_image}
                  alt="Logo"
                  width={36}
                  height={36}
                  className="w-[32px] h-[32px] rounded-full"
                />
              <SelectValue className="" placeholder={loggedUserData?.username.length > 14 ? loggedUserData?.username.slice(0, 14) + "..." : loggedUserData?.username} />
              </div>
                <p><ChevronDown size={20} /></p>
                </div>
            </SelectTrigger>
            <SelectContent className="w-[200px] py-3">
              <div className="flex items-center justify-start gap-1.5 px-3">
                <Image
                  src={loggedUserData?.profile_image}
                  alt="Logo"
                  width={36}
                  height={36}
                  className="w-[32px] h-[32px] rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">{loggedUserData?.username.length > 16 ? loggedUserData?.username.slice(0, 16) + "..." : loggedUserData?.username}</p>
                  <p className="text-sm font-normal">{loggedUserData?.email.length > 16 ? loggedUserData?.email.slice(0, 16) + "..." : loggedUserData?.email}</p>
                </div>
              </div>
              <div className="py-3 my-3 text-gray-700 border-t border-b border-gray-200 px-3 cursor-pointer">
                <p className="text-sm font-normal pb-3">Your Profile</p>
                <p className="text-sm font-normal">Settings</p>
              </div>
              <form onSubmit={handleLogout} className="flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        typeof="submit"
                        className="rounded bg-button_orange text-white cursor-pointer hover:bg-button_orange relative"
                      >
                        <p className="text-sm text-[#F05252] px-3 flex items-center gap-2 cursor-pointer">
                          <LogOut size={20} />
                          Sign Out
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </form>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default WebNavbar;
