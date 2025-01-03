"use client";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Command, CommandList } from "@/components/ui/command";
import { FaCheck } from "react-icons/fa6";
import { Trash2 } from "lucide-react";
import { useSearchParams } from 'next/navigation';

export default function OverDue() {
  const searchParams = useSearchParams();

  const [swiped, setSwiped] = useState<{ [key: number]: boolean }>({});
  const [selectedFilter, setSelectedFilter] = useState<string>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tasks, setAllTasks] = useState<any[]>([]);
  const [error, setError] = useState("");

  const spaceParam = searchParams.get('space')
  const teamParam = searchParams.get('team')
  const sortParam = searchParams.get('sort')
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null); // Track which task's filter is being edited

  const Filters = ["Completed", "In Progress", "Understand"];

  // Swipe handling function
  const handleSwipe = (id: number, direction: "left" | "right") => {
    setSwiped((prev) => ({
      ...prev,
      [id]: direction === "left",
    }));
  };

  // Fetch tasks from the database
  useEffect(() => {
    const fetchTask = async () => {
      let query = supabase.from('tasks').select('*')

      // Apply filter only if `param` is not null or undefined

      if (spaceParam) {
        query = query.eq('space', spaceParam);
      }
      if (teamParam) {
        query = query.eq('team', teamParam);
      }
      if (sortParam && sortParam !== 'None') {
        query = query.order(sortParam, { ascending: false });
      }

      const { data: tasks, error } = await query;

      if (error) {
        setError("Error fetching tasks");
      } else {
        setAllTasks(tasks || []);
      }
    };

    fetchTask();
  }, [searchParams]);

  return (
    <div className=" w-full space-y-4">
      <div className="hidden">
        <span>{error}</span>
        <span>{activeTaskId}</span>
      </div>
      {tasks.map((task: any) => (
        <div
          key={task.id}
          className="relative w-full"
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
               h-32 px-4 transition-transform duration-300 ${swiped[task.id] ? "transform -translate-x-32" : ""
              }`}
          >
            <div>
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
                  setIsDrawerOpen(true);
                }}
                className="text-[#EEA15A] w-20 h-[22px] text-[12px] font-[geist] rounded-[30px] text-center bg-[#F8F0DA] px-[8px] py-[4px]"
              >
                {selectedFilter || task.status || "In Progress"}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Drawer Outside the Map */}
      {isDrawerOpen && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="h-[50%]">
            <DrawerTitle className="pt-[18px] px-5">Filters</DrawerTitle>
            <Command>
              <CommandList>
                <ul className="px-5">
                  <li className="text-black px-5 pt-[22px] absolute left-2 text-sm">
                    Compilation Status
                  </li>
                  <br /><br></br>
                  {Filters.map((status) => (
                    <li
                      key={status}
                      onClick={() => {
                        setSelectedFilter(status);
                        setIsDrawerOpen(false); // Close the drawer on selection
                      }}
                      className={`flex items-center border-b px-5 space-y-5 border-zinc-300 cursor-pointer ${
                        selectedFilter === status
                          ? "text-zinc-950 font-semibold"
                          : "text-blackish"
                      }`}
                    >
                      <span className="w-4 h-4 mr-2 flex justify-center items-center">
                        {selectedFilter === status ? (
                          <FaCheck className="text-blackish w-4 h-4 " />
                        ) : (
                          <span className="w-4 h-4" />
                        )}
                      </span>
                      <p className="text-sm pb-3">{status}</p>
                    </li>
                  ))}
                </ul>
              </CommandList>
            </Command>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
