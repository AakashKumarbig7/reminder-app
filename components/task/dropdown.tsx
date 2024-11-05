"use client";

import { RiArrowDropDownLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { FaEllipsisH } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Command, CommandList } from "@/components/ui/command";

export default function DropDown() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSorting, setSelectedSorting] = useState("");

  const Teams = [
    "Design Team",
    "Development Team",
    "S.E.O Team",
    "WordPress Team",
    "Management",

    "Add new Team",
  ];
  const Sorting = [
    "None",
    "Due Date",
    "Alphabetical",
    "Created on",
    "Modified on",
  ];
  const handleSelected = (sort: any) => {
    setSelectedSorting(sort);
    console.log("Selected Space:", sort);
  };
  const handleSelect = (team: any) => {
    setSelectedTeam(team);
    console.log("Selected Space:", team);
  };
  return (
    <>
      <div className="flex  justify-between ">
        <Drawer>
          <DrawerTrigger>
            <button className="bg-white py-3  rounded-xl border h-[40px] w-[243px] border-gray-300 px-[18px] ">
              <RiArrowDropDownLine className="w-[18px] h-[18px]  text-black ml-auto  " />
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-[70%]">
            <DrawerTitle className="pt-[18px] px-5">Teams</DrawerTitle>
            <Command>
              <CommandList>
                <ul className="mt-4 space-y-3 py-5 px-5 pt-3">
                  {Teams.map((team) => (
                    <li
                      key={team}
                      onClick={() => handleSelect(team)}
                      className={`flex items-center   border-b-[1px] border-zinc-300 cursor-pointer ${
                        selectedTeam === team
                          ? "text-zinc-950 font-semibold"
                          : "text-blackish"
                      }`}
                    >
                      <span className="w-4 h-4 mr-2 flex justify-center items-center">
                        {selectedTeam === team ? (
                          <FaCheck className="text-blackish" />
                        ) : (
                          <span className="w-4 h-4" />
                        )}
                      </span>
                      <p className="text-sm pt-[12px] pr-[10px] flex items-center ">{team}</p>
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

        <div className="w-10 h-10">
          <FiSearch className="absolute mt-3 ml-[12px]  text-zinc-500" />
          <input
            type="text"
            className="w-10 h-10  justify-center items-center gap-[6px] rounded-lg border border-zinc-300 bg-white "
          />
        </div>

        <Drawer>
          <DrawerTrigger>
            <button className="flex w-10 h-10  p-[8px_12px] justify-center items-center gap-[6px] rounded-lg border border-zinc-300 bg-white">
              <FaEllipsisH className="h-4 w-6" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-[70%]">
            <DrawerTitle className="pt-[18px] px-5">Sorting</DrawerTitle>
            <Command>
              <CommandList>
                <ul className="mt-4 space-y-5 px-5 pt-3">
                  {Sorting.map((sort) => (
                    <li
                      key={sort}
                      onClick={() => handleSelected(sort)}
                      className={`flex items-center border-b-[1px]  border-zinc-300 cursor-pointer 
                        ${
                          selectedSorting === sort
                            ? "text-zinc-950 font-semibold"
                            : "text-blackish"
                        }`}
                    >
                      <span className="w-4 h-4 mr-2 flex justify-center items-center">
                        {selectedSorting === sort ? (
                          <FaCheck className="text-blackish" />
                        ) : (
                          <span className="w-4 h-4" />
                        )}
                      </span>
                      <p className="text-sm pt-[10px] pr-[10px]">{sort}</p>
                    </li>
                  ))}
                </ul>
              </CommandList>
            </Command>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
