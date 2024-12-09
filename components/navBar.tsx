import Image from "next/image";
import logo from "@/public/images/Rectangle 14.png";
import userimage from "@/public/images/Subtract.png";
import activelogo from "@/public/images/Ellipse 6.png";

export default function NavBar() {
  return (
    <>
      <header className="flex justify-between items-center bg-navbg p-[18px] ">
        {/* User Profile */}
        <div className="flex items-center">
          <Image
            src={userimage}
            width={44}
            height={44}
            alt="User Image"
            className="rounded"
          />
          <Image src={activelogo} alt="" className="relative right-3  top-4" />
          <div className="pr-[2px]">
            <h3 className="text-sm  text-black font-bold font-geist">John Doe</h3>
            <p className="text-[10px] text-black font-geist font-medium">Solution22</p>
          </div>
        </div>
        {/* Company Logo */}
        <Image src={logo} className="w-[89.872px] h-11" alt="Company Logo" />
      </header>
    </>
  );
}
