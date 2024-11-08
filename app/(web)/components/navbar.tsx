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

const WebNavbar = () => {
  return (
    <>
      <div className="flex items-center justify-between w-full py-2 px-3">
        <Image
          src="/images/menu-top_bar.png"
          alt="Logo"
          width={84}
          height={36}
        />
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
    </>
  );
};

export default WebNavbar;
