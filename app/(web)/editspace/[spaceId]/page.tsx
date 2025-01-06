"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import WebNavbar from "@/app/(web)/components/navbar";
import { Trash2, CirclePlus, Plus } from "lucide-react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import AddTeam from "@/app/(web)/components/addteam";
import { ToastAction } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Ensure this exists in your project
import TeamCard from "../../components/teamCard";

// const notify = (message: string, success: boolean) =>
//   toast[success ? "success" : "error"](message, {
//     style: {
//       borderRadius: "10px",
//       background: "#fff",
//       color: "#000",
//     },
//     position: "top-right",
//     duration: 3000,
//   });
interface Team {
  id: number;
  team_name: string;
}
interface Tab {
  id: number;
  space_name: string;
  email: string;
  username: string;
  designation: string;
  role: string;
  department: string;
}

const EditSpace = ({ params }: { params: { spaceId: any } }) => {
  // States
  const [spaceNames, setSpaceNames] = useState<string[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>(
    undefined
  );

  // const [selectedTeam, setSelectedTeam] = useState<any>(null); // Store the selected team data
  // const [isSaving, setIsSaving] = useState(false); // For handling the save state (loading)
  // Team-related states
  const [teams, setTeams] = useState<any[]>([]);
  // const [memberAddDialogOpen, setMemberAddDialogOpen] = useState(false);

  // const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState(false);
  // const [emailInput, setEmailInput] = useState("");
  const [matchingUsers, setMatchingUsers] = useState<any[]>([]);
  // const [noUserFound, setNoUserFound] = useState(false);
  // const [highlightedIndex, setHighlightedIndex] = useState(-1);
  // const [addedMembers, setAddedMembers] = useState<any[]>([]);
  // const [teamMemberError, setTeamMemberError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [datafromChild, setdatafromchild] = useState("");
  const [backupData, setBackupData] = useState({ tasks: [], teams: [], space: null });

  const router = useRouter();
  const { spaceId } = params;

  const handleDataFromChild = (data: any) => {
    setdatafromchild(data);
  };

  const handleUpdateTeam = async () => {
    try {
      for (const team of teams) {
        const { data, error } = await supabase
          .from("teams")
          .update({ members: team.members }) // Update members in the database
          .eq("id", team.id)
          .eq("space_id", spaceId);
  
        if (error) {
          console.error("Error updating team:", error);
          // notify("Error saving changes. Please try again.", false);
          return;
        }
      }
  
      // notify(" Teams updated successfully!", true);
      fetchTeams(); // Refresh teams to sync with the database
    } catch (error) {
      console.error("Error saving changes:", error);
      // notify("An error occurred. Please try again.", false);
    }
  };
  

  const handleDelete = async (spaceId:any) => {
    let backupData: {
      tasks: any[];
      teams: any[];
      space: any;
    } = { tasks: [], teams: [], space: null };
    console.log("hi")
  
    // Fetch tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("is_deleted", false)
      .eq("space_id", spaceId);
  
    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      return;
    }
    backupData.tasks = tasks || [];
    // console.log(tasksError)
  
    // Fetch teams
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("*")
      .eq("is_deleted", false)
      .eq("space_id", spaceId);
  
    if (teamsError) {
      console.error("Error fetching teams:", teamsError);
      return;
    }
    backupData.teams = teams || [];
  
    // Fetch space
    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", spaceId)
      .single();
  
    if (spaceError) {
      console.error("Error fetching space:", spaceError);
      return;
    }
    backupData.space = space;
    console.log("hello")
  
    // Mark tasks as deleted
    const { error: tasksDeleteError } = await supabase
      .from("tasks")
      .update({ is_deleted: true })
      .eq("space_id", spaceId);
  
    if (tasksDeleteError) {
      console.error("Error deleting tasks:", tasksDeleteError);
      return;
    }
  
    // Mark teams as deleted
    const { error: teamsDeleteError } = await supabase
      .from("teams")
      .update({ is_deleted: true })
      .eq("space_id", spaceId);
  
    if (teamsDeleteError) {
      console.error("Error deleting teams:", teamsDeleteError);
      return;
    }
  
    // Mark space as deleted
    const { error: spaceDeleteError } = await supabase
      .from("spaces")
      .update({ is_deleted: true })
      .eq("id", spaceId);
  
    if (spaceDeleteError) {
      console.error("Error deleting space:", spaceDeleteError);
      return;
    }
  
    // Update UI
    fetchSpace();
    fetchTeams();
    setIsOpen(false);
  
    
  
    toast({
      title: "Deleted Successfully!",
      description: "Space deleted successfully!",
      action: (
        <ToastAction
          altText="Undo"
          onClick={async () => {
            await handleSpaceUndo(backupData);
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };
  
  // Undo functionality
  const handleSpaceUndo = async (backupData: {
    tasks: any[];
    teams: any[];
    space: any;
  }) => {
    // Restore tasks
    if (backupData.tasks.length > 0) {
      const { error: tasksRestoreError } = await supabase
        .from("tasks")
        .update({ is_deleted: false })
        .in(
          "id",
          backupData.tasks.map((task) => task.id)
        );
  
      if (tasksRestoreError) {
        console.error("Error restoring tasks:", tasksRestoreError);
        return;
      }
    }
  
    // Restore teams
    if (backupData.teams.length > 0) {
      const { error: teamsRestoreError } = await supabase
        .from("teams")
        .update({ is_deleted: false })
        .in(
          "id",
          backupData.teams.map((team) => team.id)
        );
  
      if (teamsRestoreError) {
        console.error("Error restoring teams:", teamsRestoreError);
        return;
      }
    }
  
    // Restore space
    if (backupData.space) {
      const { error: spaceRestoreError } = await supabase
        .from("spaces")
        .update({ is_deleted: false })
        .eq("id", backupData.space.id);
  
      if (spaceRestoreError) {
        console.error("Error restoring space:", spaceRestoreError);
        return;
      }
    }
  
    // Refresh UI
    fetchSpace();
    fetchTeams();
    router.refresh();
    
    toast({
      title: "Undo Successful!",
      description: "Space, tasks, and teams have been restored.",
    });
  };
  

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("is_deleted",false)
      .eq("space_id", spaceId);
     
  
    if (error) {
      console.error("Error fetching teams:", error);
      return;
    }
  
    if (data) {
      setTeams(
        data.map((team:any) => ({
          ...team,
          tasks:[],
          members: team.members || [], // Ensure members array is not null
        }))
      );
    }
  };
  
  // Fetch all spaces from Supabase
  const fetchSpace = async () => {
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("is_deleted",false)
      .order("space_name", { ascending: true });

    if (error) {
      console.error("Error fetching spaces:", error);
      return;
    }
    setSpaceNames(data.map((space: any) => space.space_name));
  };

  // Fetch space ID by name
  const fetchSpaceIdByName = async (
    spaceName: string
  ): Promise<number | null> => {
    const { data, error } = await supabase
      .from("spaces")
      .select("id")
      .eq("is_deleted",false)
      .eq("space_name", spaceName)
      .single();

    if (error) {
      console.error("Error fetching space ID:", error);
      return null;
    }
    return data?.id ?? null;
  };

  const handleSelectChange = async (value: string) => {
    setSelectedSpace(value);

    // Fetch the ID for the selected space
    const id = await fetchSpaceIdByName(value);

    if (id !== null) {
      router.push(`/editspace/${id}`);                         
      // Perform any log

      console.log(`Selected space ID: ${id}`);
    } else {
      console.error("Error fetching space ID");
    }
  };

  useEffect(() => {
    const fetchSelectedSpace = async () => {
      if (!spaceId) return;
      {
        const { data, error } = await supabase
          .from("spaces")
          .select("space_name")
          .eq("is_deleted",false)
          .eq("id", spaceId)
          .single();

        if (error) {
          console.error("Error fetching space name:", error);
          return;
        }

        setSelectedSpace(data?.space_name || "");
      }
    };

    fetchSpace();
    fetchSelectedSpace();
    fetchTeams();
  }, [spaceId]);
  const onAllTeamMembersSavebutton = () => {
    // console.log(teams);
  };
  const onTeamDataTrigger = (user: any, teamId: number, type: string) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members:
                type === "add"
                  ? [...team.members, user] // Add member
                  : team.members.filter((m: any) => m.id !== user.id), // Remove member
            }
          : team
      )
    );
  };
  
  
  return (
    <>
      {/* <WebNavbar /> */}
      {/* <Toaster /> */}
      <div className="px-3 h-max-[500px]   space-y-[18px]">
        <div className="bg-white w-full h-[65px] rounded-[12px] flex items-center shadow-md">
          <div className="px-3 flex w-full items-center justify-between">
            {/* Title Section */}
            <p className="text-lg font-semibold text-center">Space Setting</p>

            {/* Action Buttons */}
            <div className="flex space-x-[18px] items-center">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {/* Trigger for opening the dialog */}
                <DialogTrigger asChild>
                  <button
                    className="border border-gray-200 w-[41px] h-[41px] flex items-center justify-center rounded-[8px] cursor-pointer hover:bg-slate-50"
                    onClick={() => setIsOpen(true)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </DialogTrigger>

                {/* Dialog content */}
                <DialogContent>
                  <div className="text-start">
                    <h2 className="text-lg font-bold">Delete Space</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Do you really want to delete this space
                    </p>
                  </div>
                  <DialogFooter className="flex items-start mt-4">
                    {/* Cancel button */}
                    <button
                      className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      onClick={() => setIsOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>

                    {/* Delete button */}
                    <button
                      className="ml-2 px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                      onClick={() =>handleDelete(spaceId)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Cancel button */}
              <button
                className="text-gray-400 border border-gray-200 rounded-[8px] text-sm w-[87px] h-[41px] cursor-pointer hover:bg-slate-50"
                onClick={() => router.push(`/spaceSetting`)}
              >
                Cancel
              </button>

              {/* Save button */}
              <button
                className="rounded-lg text-sm text-white w-[134px] h-[41px] bg-primaryColor-700 cursor-pointer hover:bg-blue-600"
                onClick={handleUpdateTeam}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white h-full pb-[200px] w-full shadow-md">
          <div className="px-3">
            <div className="w-full pt-[12px] items-center space-y-2">
              <Label
                htmlFor="space-name"
                className="text-gray-900  text-sm font-medium font-inter"
              >
                {" "}
                Space Name
              </Label>
              <Select onValueChange={handleSelectChange} value={selectedSpace}>
                <SelectTrigger className="w-full text-gray-500 border-gray-300 bg-gray-50">
                  <SelectValue placeholder="Select a space" />
                </SelectTrigger>
                <SelectContent>
                  {spaceNames.map((space) => (
                    <SelectItem key={space} value={space}>
                      {space}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="px-3 py-[18px] text-gray-300">
            <hr />
          </div>

          <div className="px-3  flex gap-[18px]">
            <Carousel opts={{ align: "start" }} className="w-full max-w-full ">
              <CarouselContent className="flex  ">
                <CarouselItem className="basis-[28%] ">
                  <Card className="border border-gray-300 w-[339px] h-[65px] rounded-[12px] items-center">
                    <CardContent className="px-3 py-3">
                      <AddTeam
                        spaceId={spaceId as number}
                        sendDataToParent={fetchTeams}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>

                {teams.length > 0 ? (
                  teams.map((team: any) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      spaceId={spaceId}
                      sendDataToParent={onTeamDataTrigger}
                    />
                  ))
                ) : (
                  <div className="w-full min-h-[80vh] flex justify-center items-center">
                    <p className="text-lg font-semibold">No teams found</p>
                  </div>
                )}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </>                      
  );
};
export default EditSpace;