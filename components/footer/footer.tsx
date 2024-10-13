import { FiHome, FiList, FiUsers, FiBell } from "react-icons/fi";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="fixed bottom-0 inset-x-0 bg-[#182B29] shadow-md p-[18px] flex justify-between z-30">
      <Link
        href="/home"
        className="flex flex-col items-center text-white gap-[5px]"
      >
        <FiHome size={30} />
        <span className="text-sm">Home</span>
      </Link>

      <Link
        href="/tasks"
        className="flex flex-col items-center text-white gap-[5px]"
      >
        <FiList size={30} />
        <span className="text-sm">Task</span>
      </Link>

      <Link
        href="/members"
        className="flex flex-col items-center text-white gap-[5px]"
      >
        <FiUsers size={30} />
        <span className="text-sm">Members</span>
      </Link>

      <Link
        href="/notifications"
        className="flex flex-col items-center text-white gap-[5px]"
      >
        <FiBell size={30} />
        <span className="text-sm">Notification</span>
      </Link>
    </footer>
  );
}
