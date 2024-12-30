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
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react";
import Select from "react-select";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";

interface FilterProps {
    teamFilterValue: string;
    setTeamFilterValue: (value: string) => void;
    taskStatusFilterValue: string;
    setTaskStatusFilterValue: (value: string) => void;
    filterFn : () => void
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

const FilterComponent : React.FC<FilterProps> = ({
    teamFilterValue, 
    setTeamFilterValue, 
    taskStatusFilterValue, 
    setTaskStatusFilterValue,
    filterFn
}) => {
  const [teamData, setTeamData] = useState<any>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<any>(null);

  const getTeamData = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_deleted", false);

      if (error) {
        console.error("Error fetching team data:", error);
        return;
      }

      if (data) {
        setTeamData(data);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const allTeamData = teamData.map((team: any) => ({
    value: team.team_name,
    label: team.team_name,
  }));

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
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="px-3 rounded-[10px]">
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
                <Label className="text-sm text-gray-900 block pb-1">Task status</Label>
                <Select
                  className="w-full mt-1"
                  options={taskStatusOptions}
                  onChange={handleSelectStatus} // Log selected team to console
                  value={selectedTaskStatus} // Controlled value
                  isClearable
                  placeholder="Select a team"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-900 block pb-1">Due Date</Label>
              <Input className="w-full mt-1 "  />
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
