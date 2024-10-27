"use client";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import profile from "@/public/images/Ellipse 7.png";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Command,
  CommandList,
} from "@/components/ui/command";

export default function NavBar() {
  const [selectedSpace, setSelectedSpace] = useState("");

  const spaces = [
    "Solution22",
    "Big7Solution",
    "Grafity",
    "One Tusk Event",
    "Badminton Group",
    "Family",
    "Add new Team",
  ];

  const handleSelect = (space:any) => {
    setSelectedSpace(space);
    console.log("Selected Space:", space);
  };

  return (
    <>
      <header className="flex justify-between items-center bg-bgmain p-[18px] pt-2">
        {/* Drawer Trigger */}
        <Drawer>
          <DrawerTrigger>
            <button className="flex w-10 h-10 justify-center items-center rounded-[10px] border border-zinc-300 bg-bgwhite">
              <RiBarChartHorizontalLine className="text-black h-6 w-6" />
            </button>
          </DrawerTrigger>

          {/* Drawer Content */}
          <DrawerContent className="h-[70%]">
            <DrawerTitle className="pt-[18px] px-5">Spaces</DrawerTitle>

            <Command>
              <CommandList>
                <ul className="mt-4 space-y-5 px-5 pt-3">
                  {spaces.map((space) => (
                    <li
                      key={space}
                      onClick={() => handleSelect(space)}
                      className={`flex items-center border-b-[1px] border-zinc-300 cursor-pointer ${
                        selectedSpace === space ? "text-zinc-950 font-semibold" : "text-blackish"
                      }`}
                    >
                      <span className="w-4 h-4 mr-2 flex justify-center items-center">
                        {selectedSpace === space ? (
                          <FaCheck className="text-blackish" />
                        ) : (
                          <span className="w-4 h-4" />  
                        )}
                      </span>
                      <p className="text-sm pt-[10px] pr-[10px]">{space}</p>
                    </li>
                  ))}
                </ul>
              </CommandList>
            </Command>

            <DrawerFooter>
              <button className="mt-[18px] p-2 mb-10 border w-[340px] h-10 border-teal-500 text-teal-500 rounded-lg bg-lightskyblue">
                Manage Teams
              </button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Space Title */}
        <div className="w-[180px] h-6 text-center">
          <h2 className="text-lg text-blackish text-center">{selectedSpace || "Solution22"}</h2>
        </div>

        {/* Profile Image */}
        <Image src={profile} alt="Profile" className="rounded-full" />
      </header>
    </>
  );
}
