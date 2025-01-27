"use client";
import AllTaskFetch from "@/components/allTaskFetch";
import DateChangePicker from "@/components/dateChangePicker";

import DropDown from "@/components/taskDropDown";
import TaskNavBar from "@/components/taskNavBar";
import { RiArrowDropDownLine, RiBarChartHorizontalLine } from "react-icons/ri";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { useGlobalContext } from "@/context/store";
import { useState, useEffect } from "react";
import profile from "@/public/images/img-placeholder.svg";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Command, CommandList } from "@/components/ui/command";
import { supabase } from "@/utils/supabase/supabaseClient";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { FaEllipsisH } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Trash2 } from "lucide-react";

const Task = () => {
  const { userId } = useGlobalContext();
  const [selectedSpace, setSelectedSpace] = useState<string>(""); // Space name
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>(""); // Space ID
  const [isSpaceDrawerOpen, setIsSpaceDrawerOpen] = useState(false);
  const [spacesList, setSpacesList] = useState<any[]>([]);
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>(""); // Team name
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<any>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [swiped, setSwiped] = useState<{ [key: number]: boolean }>({});
  const [selectedFilter, setSelectedFilter] = useState<string>();
  const [isStatusDrawerOpen, setIsStatusDrawerOpen] = useState(false);
  const [tasks, setAllTasks] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [activeTaskId, setActiveTaskId] = useState<number | null>(null); // Track which task's filter is being edited

  const Filters = ["Completed", "In Progress", "Understand"];

  // Fetch spaces and select the first one by default
  const fetchSpaces = async () => {
    const { data, error } = await supabase
      .from("spaces")
      .select("id, space_name") // Fetch both `id` and `space_name`
      .eq("is_deleted", false);

    if (error) {
      console.error("Error fetching spaces:", error);
      return;
    }

    if (data) {
      console.log("Fetched spaces:", data);
      setSpacesList(data); // Save the full objects (with `id` and `space_name`) in the state
      if (data.length > 0) {
        const firstSpace = data[0];
        setSelectedSpace(firstSpace.space_name); // Set the space name
        setSelectedSpaceId(firstSpace.id); // Set the space ID
        fetchTeams(firstSpace.id); // Fetch teams for the first space
      }
    }
  };

  // Fetch teams for a given space ID
  const fetchTeams = async (spaceId: string) => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_deleted",false)
        .eq("space_id", spaceId);
  
      if (error) {
        console.error("Error fetching teams:", error.message);
        return;
      }
  
      if (data && data.length > 0) {
        console.log("Fetched teams:", data);
  
        // Set the team data and default selection
        setTeams(data);
        setSelectedTeam(data[0].team_name); // Set the first team as default
      } else {
        console.log("No teams found for the provided space ID.");
        setTeams([]); // Clear the team state if no teams are found
        setSelectedTeam(""); // Clear the default selection
      }
    } catch (err) {
      console.error("Unexpected error fetching teams:", err);
    }
  };

  // Fetch spaces on component mount
  useEffect(() => {
    fetchSpaces();
  }, []);

  // Fetch teams when the selected space changes
  useEffect(() => {
    if (selectedSpaceId) {
      fetchTeams(selectedSpaceId);
    }
  }, [selectedSpaceId]);

  // Handle space selection from the drawer
  const handleSelectedSpace = (spaceId: string, spaceName: string) => {
    setSelectedSpace(spaceName);
    setSelectedSpaceId(spaceId);
    setIsSpaceDrawerOpen(false);
    fetchTeams(spaceId); // Fetch teams for the selected space
  };

  // Handle team selection from the drawer
  const handleSelectedTeam = (team:string) => {
    setSelectedTeam(team);
    setIsTeamDrawerOpen(false);
  };
  const adminTaskStatusOptions = [
    {
      value: "todo",
      label: "todo",
    },
    {
      value: "In progress",
      label: "In progress",
    },
    {
      value: "feedback",
      label: "feedback",
    },
    {
      value: "Completed",
      label: "Completed",
    },
  ];
  const taskStatusOptions = [
    {
      value: "todo",
      label: "todo",
    },
    {
      value: "In progress",
      label: "In progress",
    },
    {
      value: "feedback",
      label: "feedback",
    },
  ];
  useEffect(() => {
    const fetchTask = async () => {
      let query = supabase.from("tasks").select("*");

      // Apply filter only if `param` is not null or undefined

      const { data: tasks, error } = await query;

      if (error) {
        setError("Error fetching tasks");
      } else {
        setAllTasks(tasks || []);
      }
    };

    fetchTask();
  }, []);
  const handleSwipe = (id: number, direction: "left" | "right") => {
    setSwiped((prev) => ({
      ...prev,
      [id]: direction === "left",
    }));
  };

  return (
    <div className="flex flex-col bg-navbg px-[18px] space-y-[18px] pb-8">
      {/* {userId?.entity_name} */}
      <header className="flex justify-between items-center bg-navbg pt-[18px]">
        {/* Space Drawer Trigger */}
        <Drawer open={isSpaceDrawerOpen} onOpenChange={setIsSpaceDrawerOpen}>
  <DrawerTrigger onClick={() => setIsSpaceDrawerOpen(true)}>
    <div className="flex w-10 h-10 justify-center items-center rounded-[10px] border border-zinc-300 bg-bgwhite">
      <RiBarChartHorizontalLine className="text-black h-6 w-6" />
    </div>
  </DrawerTrigger>

  <DrawerContent className="h-[70%]">
    <DrawerTitle className="pt-[18px] px-5">Spaces</DrawerTitle>
    <Command>
      <CommandList>
        {userId?.role === "owner" ? (
          <ul className="mt-4 space-y-5 px-5 pt-3">
            {spacesList.map((space: any) => (
              <li
                key={space.id}
                onClick={() => handleSelectedSpace(space.id, space.space_name)}
                className={`flex items-center border-b-[1px] border-zinc-300 cursor-pointer ${
                  selectedSpace === space.space_name
                    ? "text-zinc-950 font-semibold"
                    : "text-greywithblack"
                }`}
              >
                <span className="w-4 h-4 mr-2 flex justify-center items-center">
                  {selectedSpace === space.space_name ? (
                    <FaCheck className="text-blackish" />
                  ) : (
                    <span className="w-4 h-4" />
                  )}
                </span>
                <p className="text-lg font-geist text-greywithblack pt-[10px] pr-[10px]">
                  {space.space_name}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-4 space-y-5 px-5 pt-3">
            {spacesList
              .filter((space: any) =>
                teams.some(
                  (team: any) =>
                    team.space_id === space.id && // Match the team's space ID with the current space's ID
                    team.members?.some(
                      (member: { entity_name: string }) =>
                        member.entity_name === userId?.entity_name // Check if the user is a member of the team
                    )
                )
              )
              .map((space: any) => (
                <li
                  key={space.id}
                  onClick={() => handleSelectedSpace(space.id, space.space_name)}
                  className={`flex items-center border-b-[1px] border-zinc-300 cursor-pointer ${
                    selectedSpace === space.space_name
                      ? "text-zinc-950 font-semibold"
                      : "text-greywithblack"
                  }`}
                >
                  <span className="w-4 h-4 mr-2 flex justify-center items-center">
                    {selectedSpace === space.space_name ? (
                      <FaCheck className="text-blackish" />
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                  </span>
                  <p className="text-lg font-geist text-greywithblack pt-[10px] pr-[10px]">
                    {space.space_name}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </CommandList>
    </Command>
  </DrawerContent>
</Drawer>



        {/* Space Title */}
        <div className="w-[180px] h-6 text-center">
          <h2 className="text-lg font-bold font-gesit text-blackish text-center">
            {selectedSpace}
          </h2>
        </div>

        {/* Profile Image */}
        <Image
          src={userId?.profile_image || profile}
          alt="Profile"
          className="rounded-full"
          width={40}
          height={40}
        />
      </header>

      {/* Team Drawer */}
      <div className="flex justify-between">
      <Drawer open={isTeamDrawerOpen} onOpenChange={setIsTeamDrawerOpen}>
  <DrawerTrigger>
    <div className="bg-white py-3 rounded-xl border h-[40px] w-[243px] border-gray-300 px-[18px] flex items-center">
      <p>{selectedTeam || "Select a Team"}</p>
      <RiArrowDropDownLine className="w-[18px] h-[18px] text-black ml-auto" />
    </div>
  </DrawerTrigger>

  <DrawerContent className="h-[70%]">
    <DrawerTitle className="pt-[18px] px-5">Teams</DrawerTitle>
    <Command>
      <CommandList>
        <ul className="mt-4 space-y-3 py-5 px-5 pt-3">
          {userId?.role === "owner" ? (
            // For owner, show all teams
            teams.map((team: any) => (
              <li
                key={team.id}
                onClick={() => handleSelectedTeam(team)}
                className={`flex items-center border-b-[1px] border-zinc-300 cursor-pointer ${
                  selectedTeam === team.name
                    ? "text-zinc-950 font-semibold"
                    : "text-blackish"
                }`}
              >
                <span className="w-4 h-4 mr-2 flex justify-center items-center">
                  {selectedTeam === team.name ? (
                    <FaCheck className="text-blackish" />
                  ) : (
                    <span className="w-4 h-4" />
                  )}
                </span>
                <p className="text-sm pt-[12px] pr-[10px] flex items-center">
                  {team.name}
                </p>
              </li>
            ))
          ) : (
            // For users, filter teams based on selected space and user membership
            teams
              .filter((team: any) =>
                team.space_id === selectedSpaceId && // Match the team's space_id with the selected space's id
                team.members?.some(
                  (member: { entity_name: any }) =>
                    member.entity_name === userId?.entity_name // Check if the user is a member of the team
                )
              )
              .map((team:any, index: number) => (
                <li
                  key={team.id}
                  onClick={() => handleSelectedTeam(team.id)}
                  className={`flex items-center border-b-[1px] border-zinc-300 cursor-pointer ${
                    selectedTeam === team.name
                      ? "text-zinc-950 font-semibold"
                      : "text-blackish"
                  }`}
                >
                  <span className="w-4 h-4 mr-2 flex justify-center items-center">
                    {selectedTeam === team.name ? (
                      <FaCheck className="text-blackish" />
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                  </span>
                  <p className="text-sm pt-[12px] pr-[10px] flex items-center">
                    {team.name}
                  </p>
                </li>
              ))
          )}
        </ul>
      </CommandList>
    </Command>
  </DrawerContent>
</Drawer>

        <div className="w-10 h-10">
          <FiSearch className="absolute mt-3 ml-[12px]  text-zinc-500" />
          <input
            type="text"
            className="w-10 h-10  justify-center items-center gap-[6px] rounded-lg border border-zinc-300 bg-white "
          />
        </div>
        <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
          <DrawerTrigger onClick={() => setIsFilterDrawerOpen(true)}>
            <div className="flex w-10 h-10  p-[8px_12px] justify-center items-center gap-[6px] rounded-lg border border-zinc-300 bg-white">
              <FaEllipsisH className="h-4 w-6" />
            </div>
          </DrawerTrigger>
          <DrawerContent className="h-[70%]">
            <DrawerTitle className="pt-[18px] px-5">Filter</DrawerTitle>
            <Command>
              <CommandList>
                {/* <ul className="mt-4 space-y-5 px-5 pt-3">
                          {filter.map((sort) => (
                            <li
                              key={sort}
                              onClick={() => handleSelected(sort)}
                              className={`flex items-center border-b-[1px] pt-[10px] pr-[10px] border-zinc-300 cursor-pointer 
                                ${selectedSorting === sort
                                  ? "text-zinc-950 font-semibold"
                                  : "text-blackish"
                                }`}
                            >
                              <span className="w-4 h-4 mr-2 flex justify-center items-center">
                                {selectedSorting === sort ? (
                                  <FaCheck className="text-blackish " />
                                ) : (
                                  <span className="w-4 h-4" />
                                )}
                              </span>
                              <p className="text-sm pb-1 ">{sort}</p>
                            </li>
                          ))}
                        </ul> */}
                <p> {userId?.role}</p>
                <ul className="mt-4 space-y-5 px-5 pt-3">
                  {userId?.role === "owner" &&
                    adminTaskStatusOptions.map((status) => (
                      <li
                        key={status.value}
                        onClick={() => {
                          setSelectedTaskStatus(status.value);
                          setIsFilterDrawerOpen(false); // Close the drawer on selection
                        }}
                        className={`flex items-center border-b-[1px] border-zinc-300 cursor-pointer ${
                          selectedTaskStatus === status.value
                            ? "text-zinc-950 font-semibold"
                            : "text-blackish"
                        }`}
                      >
                        {status.label}
                      </li>
                    ))}

                  {userId?.role === "user" &&
                    taskStatusOptions.map((status: any) => {
                      console.log("Rendering status:", status.label);
                      return (
                        <li
                          key={status.value}
                          onClick={() => {
                            setSelectedTaskStatus(status.value);
                            setIsFilterDrawerOpen(false); // Close the drawer on selection
                          }}
                          className={`flex items-center border-b-[1px] border-zinc-300 cursor-pointer ${
                            selectedTaskStatus === status.value
                              ? "text-zinc-950 font-semibold"
                              : "text-blackish"
                          }`}
                        >
                          {status.label}
                        </li>
                      );
                    })}
                </ul>
              </CommandList>
            </Command>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="flex justify-between  items-center">
        <h4 className="font-[600px] font-geist text-[18px] text-black text-center  flex justify-center">
          All Task
        </h4>
        <div>
          <div className="flex space-x-2">
            <button className="flex w-10 h-10    justify-center items-center gap-[6px] rounded-[10px] border border-zinc-300 bg-white">
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex w-[110px] h-[40px] py-3 px-4 font-geist p-[8px_13px] justify-center items-center gap-[6px] rounded-[10px] border border-zinc-300 bg-white text-[#09090B]"></div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar className="w-4 h-4" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <button className="flex w-10 h-10    justify-center items-center gap-[6px] rounded-[10px] border border-zinc-300 bg-white">
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col  ">
        {/* Scrollable Task List */}

        <div className="overflow-y-auto w-full space-y-2 h-[280px]  ">
          {tasks.map((task: any) => (
            <div
              key={task.id}
              className="relative w-full "
              onTouchStart={(e) => {
                const startX = e.touches[0].clientX;
                const handleTouchMove = (moveEvent: TouchEvent) => {
                  const endX = moveEvent.touches[0].clientX;
                  if (startX - endX > 50) {
                    // Swipe left
                    handleSwipe(task.id, "left");
                    document.removeEventListener("touchmove", handleTouchMove);
                  } else if (endX - startX > 50) {
                    // Swipe right
                    handleSwipe(task.id, "right");
                    document.removeEventListener("touchmove", handleTouchMove);
                  }
                };
                document.addEventListener("touchmove", handleTouchMove);
              }}
            >
              {swiped[task.id] && (
                <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-1 ease-in-out rounded-[10px] py-3">
                  <button className="flex items-center h-[46px] w-[46px] bg-green-500 text-white rounded-full p-2">
                    <FaCheck className=" h-6 w-6 ml-1" />
                  </button>
                  <button className="flex items-center h-[46px] w-[46px] bg-red-500 text-white rounded-full p-2">
                    <Trash2 className=" h-6 w-6 ml-1" />
                  </button>
                </div>
              )}

              <div
                className={`bg-white space-y-2 py-3 rounded-[10px] w-full
                 h-32 px-4 transition-transform duration-300 ${
                   swiped[task.id] ? "transform -translate-x-32" : ""
                 }`}
              >
                <div className="overflow-auto w-full playlist-Scroll block top-0">
                  <p className="text-greyshade font-[geist] text-[12px]">
                    {task?.time || "Loading..."}
                  </p>
                </div>
                <p className="text-[#000000] text-[16px] font-[geist]">
                  {task?.task_content || "Loading..."}
                </p>

                <div className="flex justify-between text-center">
                  <p className="text-[#EC4949] pt-1 font-[geist] text-[12px]">
                    {task?.time || "Loading.."}
                  </p>
                  <button
                    onClick={() => {
                      setActiveTaskId(task.id);
                      setIsStatusDrawerOpen(true);
                    }}
                    className="text-[#EEA15A] min-w-[100px] max-w-[150px] h-[32px] text-[12px] font-inter rounded-[30px] text-center bg-[#F8F0DA] px-[8px] py-[4px] overflow-hidden whitespace-nowrap"
                    title={selectedFilter || task.status || "In Progress"}
                  >
                    {selectedFilter || task.status || "In Progress"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     
    </div>
  );
};

export default Task;
