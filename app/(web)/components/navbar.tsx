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
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { logout } from "@/app/(signin-setup)/logout/action";

const WebNavbar = () => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoggingOut(true); // Show loader when logging out
    await logout();
    setIsLoggingOut(false); // Hide loader after logout completes
  };

  return (
    <>
      <div className="flex items-center justify-between w-full py-2 px-3">
        <Image
          src="/images/menu-top_bar.png"
          alt="Logo"
          width={84}
          height={36}
        />
        <div className="flex items-center gap-2">
        {/* <Button className="bg-white text-black hover:bg-gray-50"><LogOut /></Button> */}
        <form onSubmit={handleLogout} className="flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      typeof="submit"
                      className="rounded bg-button_orange text-white cursor-pointer hover:bg-button_orange relative"
                      style={
                        isLoggingOut
                          ? { pointerEvents: "none", opacity: 0.6 }
                          : {}
                      }
                    >
                      {isLoggingOut ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      ) : (
                        <LogOut className="bg-white w-[32px] h-[32px] p-1.5 rounded-sm text-black hover:bg-gray-50" size={20} />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>
        <Select>
          <SelectTrigger className="w-[200px] bg-white focus-visible:border-none focus-visible:outline-none text-sm font-bold shadow-none">
            <SelectValue className="" placeholder="Laxman Sarav" />
          </SelectTrigger>
          <SelectContent className="w-[200px] py-3">
            <div className="flex items-center justify-start gap-1 px-3">
              <Image
                src="/images/subtract.png"
                alt="Logo"
                width={36}
                height={36}
                className="rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">Laxman Sarav</p>
                <p className="text-sm font-normal">Laxman@gmail.com</p>
              </div>
            </div>
            <div className="py-3 my-3 text-gray-700 border-t border-b border-gray-200 px-3 cursor-pointer">
              <p className="text-sm font-normal pb-3">Your Profile</p>
              <p className="text-sm font-normal">Settings</p>
            </div>
            <p className="text-sm text-[#F05252] px-3 flex items-center gap-2 cursor-pointer">
              <LogOut size={20} />
              Sign Out
            </p>
          </SelectContent>
        </Select>
        </div>
      </div>
    </>
  );
};

export default WebNavbar;
