import { CirclePlus } from "lucide-react";


export default function Spaces() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-black">Spaces</h4>
        <span className="text-teal-500 cursor-pointer">View all</span>
      </div>
      <div className="flex py-3 space-x-2">
        <button className="rounded-[10px] border border-teal-500 bg-teambg    flex justify-center p-4 text-[#393939]  font-[500]  h-10  text-base space-x-2  w-[148px] py-2 px-4 leading-[16px] ">
          <CirclePlus className="flex justify-center " />
        <p className="text-base text-greyblack">New Space</p> 
        </button>
        <button className="rounded-[10px] border border-teal-500 bg-white    flex justify-center p-4 text-[#393939]  font-[500]  h-10  text-base space-x-2  w-[148px] py-2 px-4 leading-[16px] ">
        
        <p className="text-base text-greyblack">Solution22</p> 
        </button>
      </div>
    </div>
  );
}
