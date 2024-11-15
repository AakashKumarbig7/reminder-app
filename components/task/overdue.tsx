"use client";
import {supabase} from "@/lib/supabase/client";
// import {supabase} from '@/lib/utils';
import { useEffect, useState } from 'react';
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

type CardData = {
  id: number;
  content: string;
  date: string;
  status: string;
};

export default function OverDue() {
  const [swiped, setSwiped] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tasks, setAllTasks] = useState<any>([]);
  const [error, setError] = useState("");


  const Filters = ["Completed", "In Progress", "Understand"];
  
  const handlers = useSwipeable({
    onSwipedLeft: () => setSwiped(true),
    onSwipedRight: () => setSwiped(false),
    preventScrollOnSwipe: true, 
    trackMouse: true,
    delta: 10,
  });

  const handleSelect = (status: string) => {
    setSelectedFilter(status);
    setIsDrawerOpen(false);
  };

  // Fetch data from API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('https://api.example.com/tasks');
  //       const data: CardData[] = await response.json(); // Expecting an array of tasks
  //       setCardData(data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchTask = async () => {
      let { data: tasks, error } = await supabase.from("tasks").select("*");
      if (error) {
        setError("Error");
      } else {
        setAllTasks(tasks);
      }
    };
    fetchTask();
  },[]);
  return (
         <div className="relative w-[339px] space-y-4">
      {tasks.map((task:any) => (
        <div key={task.id} className="">
          <div className="relative w-[339px]">
            {swiped && (
              <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-1 ease-in-out rounded-[10px] py-3">
                <button className="flex items-center h-[46px] w-[46px] bg-green-500 text-white rounded-full p-2">
                  <FaCheck className="mr-1 h-6 w-6" />
                </button>
                <button className="flex items-center h-[46px] w-[46px] bg-red-500 text-white rounded-full p-2">
                  <Trash2 className="mr-1 h-6 w-6" />
                </button>
              </div>
            )}

            <div
              {...handlers}
              className={`bg-white space-y-2 py-3 rounded-[10px] w-[339px] h-32 px-4 transition-transform duration-300 ${
                swiped ? "transform -translate-x-32" : ""
              }`}
            >
              <div>
                <p className="text-greyshade font-[geist] text-[12px]">
                  {task?.time|| "Loading..."}
                </p>
              </div>
              <p className="text-[#000000] text-[16px] font-[geist]">
                {task?.task_content || "Loading..."}
              </p>

              <div className="flex justify-between text-center">
                <p className="text-[#EC4949] pt-1 font-[geist] text-[12px]">
                  {task?.time || "Loading.."}
                </p>
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger onClick={() => setIsDrawerOpen(true)}>
                    <div>
                      <p className="text-[#EEA15A] w-20 h-[22px] text-[12px] font-[geist] rounded-[30px] text-center bg-[#F8F0DA] px-[8px] py-[4px]">
                        {selectedFilter || tasks.status || "In Progress"}
                      </p>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent className="h-[50%]">
                    <DrawerTitle className="pt-[18px] px-5">Filters</DrawerTitle>
                    <Command>
                      <CommandList>
                        <ul className="px-5">
                          <li className="text-black px-5 pt-[22px] absolute left-2 text-sm">
                            Compilation Status
                          </li>
                          <br />
                          {Filters.map((status) => (
                            <li
                              key={status}
                              onClick={() => handleSelect(status)}
                              className={`flex items-center border-b px-5 space-y-5 border-zinc-300 cursor-pointer ${
                                selectedFilter === status
                                  ? "text-zinc-950 font-semibold"
                                  : "text-blackish"
                              }`}
                            >
                              <span className="w-4 h-4 mr-2 flex justify-center items-center">
                                {selectedFilter === status ? (
                                  <FaCheck className="text-blackish w-4 h-4 pb-[5px]" />
                                ) : (
                                  <span className="w-4 h-4" />
                                )}
                              </span>
                              <p className="text-sm">{status}</p>
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
        </div>
      ))}
    </div>
  
  
  );
}