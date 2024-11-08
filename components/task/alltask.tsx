"use client";
// import { FaLessThan } from "react-icons/fa6";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi"
// import { FaGreaterThan } from "react-icons/fa6";

export default function AllTask() {
  return (
    <>
      <div className="flex justify-between  items-center">
        <h4 className="font-[600px] font-geist text-[18px] text-black text-center  flex justify-center">
          All Task
        </h4>
        <div>
          <div className="flex space-x-2">
            <button className="flex w-10 h-10    justify-center items-center gap-[6px] rounded-[10px] border border-zinc-300 bg-white">
            <FiChevronLeft  className="w-6 h-6"/>
            </button>
            <div>
              <button className="flex w-[110px] h-[40px] py-3 px-4 font-geist p-[8px_13px] justify-center items-center gap-[6px] rounded-[10px] border border-zinc-300 bg-white text-[#09090B]">
                Today
              </button>
            </div>
            <div>
              <button className="flex w-10 h-10    justify-center items-center gap-[6px] rounded-[10px] border border-zinc-300 bg-white">
              <FiChevronRight  className="w-6 h-6"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
