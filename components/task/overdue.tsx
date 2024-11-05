"use client";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
 
} from "@/components/ui/drawer";
import { Command, CommandList } from "@/components/ui/command";
import{useState}from 'react';
import { FaCheck } from "react-icons/fa6";
export default function Tasks() {
const [selectedFilter,setSelectedFilter]= useState();

  const Filters = [
    "To Do",
    "Inprogress",
    "Internal Feedback"
  ];
  const handleSelect = (status: any) => {
    setSelectedFilter(status);
    console.log("Selected status:", status);
  };
  return (
    <>
      <div className="bg-white space-y-2 py-3 rounded-[10px] w-[339px] h-32 px-4">
       <div className=""> 
        <p className="text-greyshade font-[geist] text-[12px]  ">20 Aug 2024</p>
        </div>
        <p className="text-[#000000] text-[16px] font-[geist]">Pugazh need to talk reg reminder app ui<br></br> design</p>

        <div className="  flex justify-between text-center">
          <p className="text-[#EC4949] pt-1 font-[geist] text-[12px]">23 Aug 2024</p>
          <Drawer>
            <DrawerTrigger >
              
          <button>
          <p className="text-[#EEA15A] w-20 h-[22px]  text-[12px] font-[geist] rounded-[30px] text-center bg-[#F8F0DA] px-[8px] py-[4px]">In Progress</p> 
          </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Filters</DrawerTitle>
            {/* <DrawerDescription></DrawerDescription> */}
            <Command>
              <CommandList>
                {/* <ul>
                 
                  <li className="">Compilation Status</li>
                  {Filters.map((status:any) => (
                    <li
                      key={status}
                      onClick={() => handleSelect(status)}
                      className={`flex items-center border-b-[1px]  border-zinc-300 cursor-pointer 
                        ${
                          selectedFilter === status
                            ? "text-zinc-950 font-semibold"
                            : "text-blackish"
                        }`}
                    >
                      <span className="w-4 h-4 mr-2 flex justify-center items-center">
                        {selectedFilter === status ? (
                          <FaCheck className="text-blackish" />
                        ) : (
                          <span className="w-4 h-4" />
                        )}
                      </span>
                      <p className="text-sm pt-[10px] pr-[10px]">{status}</p>
                    </li>

                </ul> */}
              </CommandList>
            </Command>
          </DrawerContent>
          </Drawer>
        </div>
        </div>

       
       
    </>
  );
}
