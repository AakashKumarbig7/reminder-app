"use client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import Select from "react-select";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { getLoggedInUserData } from "@/app/(signin-setup)/sign-in/action";
import { format } from "date-fns";
interface FilterProps {
  teamFilterValue: string;
  loggedUserData: any;
  setTeamFilterValue: (value: string) => void;
  taskStatusFilterValue: string;
  setTaskStatusFilterValue: (value: string) => void;
  filterFn: () => void;
}

const taskStatusOptions = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "Todo",
    label: "Todo",
  },
  {
    value: "Inprogress",
    label: "Inprogress",
  },
  {
    value: "Feedback",
    label: "Feedback",
  },
  {
    value: "Completed",
    label: "Completed",
  },
];

const FilterComponent: React.FC<FilterProps> = ({
  teamFilterValue,
  loggedUserData,
  setTeamFilterValue,
  taskStatusFilterValue,
  setTaskStatusFilterValue,
  filterFn,
}) => {
  const [teamData, setTeamData] = useState<any>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<any>(null);
  const [date, setDate] = useState<any>(null);
  const[UserData, setUserData] = useState<any>(null);

  let spaceData: any;
  spaceData = sessionStorage.getItem("spaceData");
  spaceData = JSON.parse(spaceData);
  const getTeamData = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_deleted", false)
        .eq("space_id", spaceData?.id);
   
      if (error) {
        console.error("Error fetching team data:", error);
        return;
      }

      if (data) {
        if (loggedUserData?.role === "admin") {
          setTeamData(data);}
          else
          {
        let filteredTeam = [];
        for (let i = 0; i < data.length; i++) {
          // for (let j = 0; j < data[i].members.length; j++) {
          //   if (data[i].members[j].name == loggedUserData?.name) {
          //     filteredTeam.push(data[i]);
              
          //   }
          if(data[i].members.some((member: any) => member.name === UserData.entity_name)){
            filteredTeam.push(data[i]);
          }
        }
        // console.log("Team data:", data);
        console.log(filteredTeam);
        setTeamData(filteredTeam);
      }
    }
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const allTeamData = teamData.map((team: any) => ({
    value: team.team_name,
    label: team.team_name,
  }));
  useEffect(() => {
    const getUser = async () => {
      const user:any = await getLoggedInUserData();
      console.log("userAakash",user);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("userId", user?.id)
        .single();

      if (error) {
        console.log(error);
        return;
      }
      // console.log(data);
      setUserData(data);
    };

    getUser();

    // localStorage.setItem("user", JSON.stringify(loggedUserData));
  }, []);
  const handleSelectChange = (selectedOption: any) => {
    setSelectedTeam(selectedOption);
    setTeamFilterValue(selectedOption?.value || "");
    console.log("Selected Team:", selectedOption);
  };

  const handleSelectStatus = (selectedOption: any) => {
    setSelectedTaskStatus(selectedOption);
    setTaskStatusFilterValue(selectedOption?.value || "");
    console.log("Selected Task Status:", selectedOption);
  };

  useEffect(() => {
    getTeamData();
  }, []);
  // handleCloseCancel = () => {
  //   setSelectedTeam(null);
  //   setSelectedTaskStatus(null);
  //   setDate(null);
  // }
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" onClick={getTeamData} className="px-3 rounded-[10px]">
            <Filter size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent className="font-inter">
          <SheetHeader>
            <SheetTitle className="text-[#6B7280] text-base">
              FILTER OPTION
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col justify-between w-full h-full">
            <div>
              <div className="py-3">
                <Label className="text-sm text-gray-900 block pb-1">Team</Label>
                <Select
                  className="w-full mt-1"
                  options={allTeamData}
                  onChange={handleSelectChange} // Log selected team to console
                  value={selectedTeam} // Controlled value
                  isClearable
                  placeholder="Select a team"
                />
              </div>

              <div className="pb-3">
                <Label className="text-sm text-gray-900 block pb-1">
                  Task status
                </Label>
                <Select
                  className="w-full mt-1"
                  options={taskStatusOptions}
                  onChange={handleSelectStatus} // Log selected team to console
                  value={selectedTaskStatus} // Controlled value
                  isClearable
                  placeholder="Select a team"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-900 block pb-1">
                  Due Date
                </Label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="flex items-center justify-between w-full px-3 py-2 border rounded-lg text-left focus:outline-none"
                        type="button"
                      >
                        {date ? (
                          <span>{format(date, "dd/MMM/yyyy")}</span>
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-2" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <SheetFooter className="w-full flex gap-2 pb-4">
              <Button className="w-1/2" variant="outline">
                Cancel
              </Button>
              <Button
                className="w-1/2 bg-primaryColor-700 text-white hover:bg-primaryColor-700 hover:text-white"
                variant="outline"
                onClick={filterFn}
              >
                Update
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FilterComponent;
