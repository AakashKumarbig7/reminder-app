"use client";
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Command, CommandList } from "@/components/ui/command";
import { FaCheck } from "react-icons/fa6";
import { Trash2 } from 'lucide-react';

export default function SwipeableCard() {
  const [swiped, setSwiped] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState();
  const Filters = ["To Do", "In Progress", "Internal Feedback"];

  const handlers = useSwipeable({
    onSwipedLeft: () => setSwiped(true),
    onSwipedRight: () => setSwiped(false),
    preventScrollOnSwipe: true, 
    trackMouse: true,
  });

  const handleSelect = (status:any) => {
    setSelectedFilter(status);
    console.log("Selected status:", status);
  };

  return (
    <div className="relative w-[339px]">
      {/* Background icons revealed on swipe */}
      {swiped && (
        <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-1  rounded-[10px] py-3">
          <button className="flex items-center h-[46px] w-[46px] selection: bg-red-500 text-white rounded-full p-2">
            <Trash2  className="mr-1 h-6 w-6" /> 
          </button>
          <button className="flex items-center h-[46px] w-[46px] selection: bg-green-500 text-white rounded-full p-2">
            <FaCheck className="mr-1 h-6 w-6" /> 
          </button>
        </div>
      )}

      {/* Main card with swipeable functionality */}
      <div
        {...handlers}
        className={`bg-white space-y-2 py-3 rounded-[10px] w-[339px] h-32 px-4 transition-transform duration-300 ${
          swiped ? 'transform -translate-x-32' : ''
        }`}
      >
        <div>
          <p className="text-greyshade font-[geist] text-[12px]">20 Aug 2024</p>
        </div>
        <p className="text-[#000000] text-[16px] font-[geist]">
          Pugazh needs to talk regarding reminder app UI design
        </p>

        <div className="flex justify-between text-center">
          <p className="text-[#EC4949] pt-1 font-[geist] text-[12px]">23 Aug 2024</p>
          <Drawer>
            <DrawerTrigger>
              <div>
                <p className="text-[#EEA15A] w-20 h-[22px] text-[12px] font-[geist] rounded-[30px] text-center bg-[#F8F0DA] px-[8px] py-[4px]">
                  {selectedFilter || "In Progress"}
                </p>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle className="px-5">Filters</DrawerTitle>
              <Command>
                <CommandList>
                  <ul>
                    <li className="text-black px-5 pt-[22px] absolute left-2 text-sm">Compilation Status</li>
                    {Filters.map((status) => (
                      <li
                        key={status}
                        onClick={() => handleSelect(status)}
                        className={`flex items-center border-b px-5 border-zinc-300 cursor-pointer ${
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
                    ))}
                  </ul>
                </CommandList>
              </Command>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
