import { RiArrowDropDownLine } from "react-icons/ri";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { FaEllipsisH } from "react-icons/fa";
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
export default function DropDown() {
  return (
    <>
      <div className="flex  justify-between ">
        <div  className="w-[243px] h-10" >
          <button className="bg-white py-3  rounded-xl border  w-[243px] border-gray-300 px-[18px] ">
          
            <RiArrowDropDownLine className="relative  ml-3 " />
          </button>
        </div>
       
        <div className="w-10 h-10">
          <FiSearch  className="absolute mt-3 ml-[12px]  text-gray-400" />
          <input
            type="text"
          
           className="w-10 h-10  justify-center items-center gap-[6px] rounded-lg border border-gray-300 bg-white "
          />
        </div>
    
     
        <div>
          <button className="flex w-[40px] h-[40px]  p-[8px_12px] justify-center items-center gap-[6px] rounded-lg border border-gray-300 bg-white">
            <FaEllipsisH />
          </button>
        </div> 
        </div>
      
    </>
  );
}
