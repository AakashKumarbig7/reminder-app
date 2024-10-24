import { RiBarChartHorizontalLine } from "react-icons/ri";
import profile from "@/public/images/Ellipse 7.png";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
// import { Button } from './ui/button';

export default function NavBar() {
  return (
    <>
      <header className="flex justify-between items-center bg-[#f4f4f8] p-[18px] pt-2 ">
        
          <Drawer>
            <DrawerTrigger  className="w-full" asChild>
              <button className="flex w-10 h-10 justify-center items-center  rounded-[10px] border border-[#D4D4D8] bg-[#FFF]">
                <RiBarChartHorizontalLine className="text-black h-6 w-6" />
              </button>
            </DrawerTrigger>
            <DrawerContent  className="h-[70%] p-4">
            <DrawerHeader className=" ">
              <DrawerTitle className="pt-[18px] text-start text-[16px] pr-[-10px]">Spaces</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>

            {/* Teams List */}
            <div className="">
              <ul className="mt-4 space-y-6">
                <li className=" flex   border-b-2 border-[#D4D4D8] text-black">
                
                  <FaCheck className="px-[10px]  pt-[10px]" />
                  <p className="text-sm">Solution22</p>
                </li>
                <li className="text-black border-b-2 border-[#D4D4D8] ">
                 
                <p className="text-sm">Big7Solution</p>
                </li>
                <li className="text-black border-b-2 border-[#D4D4D8]">
                <p className="text-sm">Grafity</p>
                </li>
                <li className="text-black border-b-2 border-[#D4D4D8]">
                <p className="text-sm">one Tusk Event</p>
                </li>
                <li className="text-black border-b-2 h-[40px] border-[#D4D4D8]">
                <p className="text-sm ">Badminton Group</p>
                </li>
                <li className="text-black border-b-2 h-[40px] border-[#D4D4D8]">
                <p className="text-sm">Family</p>
                </li>
               
                <li className="text-gray-300 border-b-2 border-[#D4D4D8]">
                  Add new Team
                </li>
              </ul>
            </div>
            </DrawerDescription>
            <DrawerFooter>
              <button className="mt-6 p-2 mb-[40px] border w-[320px] h-[40px] border-teal-500 text-teal-500  rounded-lg bg-[#e5f9f6]">
                Manage Teams
              </button>
            </DrawerFooter>
            </DrawerContent>
          </Drawer>
      

        <div className="w-[180px] h-6 text-center">
          <h2 className="text-lg text-black text-center">Solution22</h2>
        </div>

        <Image src={profile} alt="" />
      </header>
    </>
  );
}
