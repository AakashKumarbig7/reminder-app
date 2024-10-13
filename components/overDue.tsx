"use client";

import Image from "next/image"; 

export default function () {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-black">Overdue Task</h4>
        <span className="text-[#14B8A6] cursor-pointer">View all</span>
      </div>
      <div className="  pt-[18px]">
        <div className="  flex  space-x-2  justify-evenly ">
          <div className="bg-white shadow-md pl-[12px] p-4 space-x-2 rounded-lg w-full mr-2 ">
            <div className="">
              <p className="bg-[#f4f4f8] text-[#737373] text-[12px] font-semibold  border-gray-300 rounded-full inline-block px-2 py-1">
                Design Team
              </p>
            </div>
            <div>
            <p className="text-[#000000] py-3 font-[16px]">
              @Pugazh need to talk reg reminder app ui...
            </p>
            </div>
            <div className="flex justify-around">
              <span className="text-red-500 pr-[20px] font-[12px] mt-2">Yesterday</span>
              <span className="border bg-[#F8DADA] rounded-xl text-[#EE5A5A] py-1 mt-1 px-1 ">
                Todo
              </span>
            </div>
          </div>

          <div className="bg-white shadow-md  p-4 rounded-lg w-full mr-2">
            <div className="bg-[#f4f4f8]  text-[#737373] text-[12px] font-semibold  border-gray-300 rounded-full inline-block px-2 py-1">Wordpress Team</div>
            <p className="text-[#000000] mt-2 ">@shiji new project to talk</p>
            {/* Added margin-top to create the gap */}
            <div className="flex justify-around mt-2">
              <span className="text-red-500 font-[12px] mt-8">Today</span>
              <span className="border bg-[#F8DADA] rounded-xl text-[#EE5A5A] py-1 mt-7 px-1">
                Todo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
