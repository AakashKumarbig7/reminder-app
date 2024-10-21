import { FiHome,  FiUsers } from "react-icons/fi";
import Link from "next/link";
import { ListChecks } from 'lucide-react';
import { BellDot } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="fixed bottom-0 inset-x-0 bg-[#182B29] shadow-md pt-[9px] pr-[18px] pb-[30px] pl-[18px] w-full h-[83px]  flex justify-between align z-50">
      <Link
        href="/home"
        className="flex flex-col items-center text-white gap-[5px] hover:text-teal-500 transition  duration-300"
      >
        <FiHome className="w-[22px] h-[22px] " />
        <p className="text-xs">Home</p>
      </Link>

      <Link
        href="/tasks"
        className="flex flex-col items-center hover:text-teal-500 transition  duration-300 text-white gap-[5px]"
      >
        <ListChecks  className="w-[22px] h-[22px]"/>
        <p className="text-xs">Task</p>
      </Link>

      <Link
        href="/members"
        className="flex flex-col items-center text-white hover:text-teal-500 transition  duration-300 gap-[5px]"
      >
        <FiUsers className="w-[22px] h-[22px]" />
        <p className="text-xs">Members</p>
      </Link>

      <Link
        href="/notifications"
        className="flex flex-col items-center hover:text-teal-500 transition  duration-300 text-white gap-[5px]"
      >
        <BellDot className="w-[22px] h-[22px]" />
        <p className="text-xs">Notification</p>
      </Link>
    </footer>
  );
}
