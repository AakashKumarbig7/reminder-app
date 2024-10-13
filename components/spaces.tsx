import { CirclePlus } from "lucide-react";
import Image from "next/image";

export default function Spaces() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-black">Spaces</h4>
        <span className="text-[#14B8A6] cursor-pointer">View all</span>
      </div>
      <div className="flex space-x-2 p-4">
        <button className="rounded-[10px] border border-[#14B8A6] bg-[#E5F4F2]  w-[180px]  flex justify-center p-4 text-[#393939]   font-[500] text-[16px] leading-[16px]  ">
          <CirclePlus className="mr-2 -mt-[1px]" size={18} />
          New Space
        </button>
        <button className="rounded-[10px] border border-[#14B8A6] bg-[#FFF]  w-[180px]  flex justify-center p-4 text-[#393939]  font-[500] text-[16px] leading-[16px]">
          Solution22
        </button>
      </div>
    </div>
  );
}
