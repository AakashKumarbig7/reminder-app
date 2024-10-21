import {CirclePlus} from "lucide-react";
import Image from "next/image"

export default function Teams()
{
    return(
        <div >
        <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-black">Teams</h4>
        <p className="text-teal-500 cursor-pointer">View all</p>
        </div>
        <div className="flex py-3 space-x-2">
        <button className="rounded-[10px] border border-[#14B8A6]  bg-teambg   flex justify-center p-4   font-[500]  h-10  text-base space-x-2  w-[148px] py-2 px-4 leading-[16px] ">
          <CirclePlus className="flex text-greyblack justify-center " />
        <p className="text-base">New Team</p> 
        </button>
        <button className="rounded-[10px] border border-[#14B8A6] bg-white    flex justify-center p-4 text-[#393939]  font-[500]  h-10  text-base space-x-2  w-[148px] py-2 px-4 leading-[16px] ">
        
        <p className="text-base text-greyblack ">Development </p> 
        </button>
      </div>
      </div>
    )
}