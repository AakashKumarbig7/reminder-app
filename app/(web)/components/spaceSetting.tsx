"use client";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WebNavbar from "@/app/(web)/components/navbar";
import { ClipboardPlus, Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/supabaseClient";
import Image from "next/image";
import { DividerVerticalIcon } from "@radix-ui/react-icons";
interface Space {
  id: string;
  name: string;
  teams?: string[]; // Teams property added
}

export default function SpaceSetting({}) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]);

  const router = useRouter();

  // Fetch spaces from Supabase
  const fetchSpaces = async () => {
    try {
      const { data, error } = await supabase
        .from("spaces")
        .select("id, space_name")
        .eq("is_deleted", false);

      if (error) {
        alert("Failed to fetch spaces. Please try again.");
        console.error("Error fetching spaces:", error.message);
        return;
      }

      setSpaces(
        data.map((space: any) => ({ id: space.id, name: space.space_name }))
      );
    } catch (err) {
      alert("Unexpected error occurred.");
      console.error("Unexpected error:", err);
    }
  };

  // Add a new space
  const addSpace = async () => {
    if (newSpaceName.trim() !== "") {
      try {
        const { data, error } = await supabase
          .from("spaces")
          .insert([{ space_name: newSpaceName, is_deleted: false }])
          .select();

        if (error) {
          alert("Failed to create space. Please try again.");
          console.error("Error inserting space:", error.message);
          return;
        }
        setIsDialogOpen(false);
        fetchSpaces();
      } catch (err) {
        alert("Unexpected error occurred.");
        console.error("Unexpected error:", err);
      }
    }
  };
  const SpaceCreateDialogClose = async () => {
    setNewSpaceName(""); // Clear the input
    setIsDialogOpen(false); // Close the dialog
    fetchSpaces(); // Refresh the spaces after insertion
  };
  // Delete a space
  const deleteSpace = async (id: string) => {
    console.log("space id ", id);
    let backupData: {
      tasks: any[];
      teams: any[];
      space: any;
    } = { tasks: [], teams: [], space: null };
    console.log("hi");

    // Fetch tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("is_deleted", false)
      .eq("space_id", id);

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
      .eq("space_id", id);

    if (teamsError) {
      console.error("Error fetching teams:", teamsError);
      return;
    }
    backupData.teams = teams || [];

    // Fetch space
    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", id)
      .single();

    if (spaceError) {
      console.error("Error fetching space:", spaceError);
      return;
    }
    backupData.space = space;
    console.log("hello");

    // Mark tasks as deleted
    const { error: tasksDeleteError } = await supabase
      .from("tasks")
      .update({ is_deleted: true })
      .eq("space_id", id);

    if (tasksDeleteError) {
      console.error("Error deleting tasks:", tasksDeleteError);
      return;
    }

    // Mark teams as deleted
    const { error: teamsDeleteError } = await supabase
      .from("teams")
      .update({ is_deleted: true })
      .eq("space_id", id);

    if (teamsDeleteError) {
      console.error("Error deleting teams:", teamsDeleteError);
      return;
    }

    // Mark space as deleted
    const { error: spaceDeleteError } = await supabase
      .from("spaces")
      .update({ is_deleted: true })
      .eq("id", id);

    if (spaceDeleteError) {
      console.error("Error deleting space:", spaceDeleteError);
      return;
    }

    // Update UI
    fetchSpaces();
    fetchSpacesWithTeams();
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
    fetchSpaces();
    fetchSpacesWithTeams();
    router.refresh();

    toast({
      title: "Undo Successful!",
      description: "Space, tasks, and teams have been restored.",
    });
  };

  const handleDeleteDialogClose = async () => {
    setIsOpen(false);
    fetchSpaces();
  };
  const fetchSpacesWithTeams = async () => {
    try {
      // Step 1: Fetch spaces from Supabase
      const { data: spacesData, error: spacesError } = await supabase
        .from("spaces")
        .select("id, space_name") // Fetch space ID and name
        .eq("is_deleted", false);

      if (spacesError) {
        alert("Failed to fetch spaces. Please try again.");
        console.error("Error fetching spaces:", spacesError.message);
        return;
      }

      if (!spacesData) {
        setSpaces([]); // If no data, set spaces to an empty array
        return;
      }

      // Step 2: Map spaces to their basic structure
      const spaces = spacesData.map((space: any) => ({
        id: space.id,
        name: space.space_name,
      }));

      // Step 3: Fetch teams associated with these spaces
      const spaceIds = spaces.map((space: any) => space.id); // Extract space IDs

      const { data: teamsData, error: teamsError } = await supabase
        .from("teams") // Assuming "teams" table exists
        .select("id, team_name, space_id,members") // Fields to fetch
        .eq("is_deleted", false)
        .in("space_id", spaceIds); // Filter teams by space IDs
      console.log("teamdata", teamsData);
      if (teamsError) {
        alert("Failed to fetch teams. Please try again.");
        console.error("Error fetching teams:", teamsError.message);
        return;
      }

      // Step 4: Map teams by their associated space ID
      const teamsBySpaceId: Record<string, string[]> = {}; // Initialize mapping
      if (teamsData) {
        console.log(teamsData);
        setTeamData(teamsData);
        teamsData.forEach((team: any) => {
          if (!teamsBySpaceId[team.space_id]) {
            teamsBySpaceId[team.space_id] = [];
          }
          teamsBySpaceId[team.space_id].push(team.team_name); // Add team name under the space ID
        });
      }

      // Step 5: Combine spaces with their teams
      const enrichedSpaces = spaces.map((space: any) => ({
        ...space,
        teams: teamsBySpaceId[space.id] || [], // Default to empty array if no teams
      }));

      // Step 6: Update state with enriched spaces
      setSpaces(enrichedSpaces);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }; // Fetch spaces on component mount
  useEffect(() => {
    fetchSpaces();
    fetchSpacesWithTeams();
  }, []);
  // const fetchMembers = async (team_id: string[]) => {
  // console.log("teamid=",team_id)
  //   try {
  //     // Query users from Supabase based on team IDs
  //     const { data, error } = await supabase
  //       .from('users')
  //       .select('id, username, profile_image')
  //       .in('team_id', team_id); // Filter by team IDs

  //     if (error) {
  //       throw error;
  //     }

  //     return data; // Returns the list of members
  //   } catch (error) {
  //     console.error("Error fetching members:", error);
  //     return [];
  //   }
  // };

  // // Fetch members for all spaces and their teams
  // useEffect(() => {
  //   const getMembers = async () => {
  //     const allMembers: any[] = [];

  //     for (const space of spaces) {
  //       if (space.teams) {
  //         // Fetch members for each team in the space
  //         const spaceMembers = await fetchMembers(space.teams);
  //         allMembers.push(...spaceMembers);
  //       }
  //     }

  //     setMembers(allMembers); // Store all members in state
  //   };

  //   getMembers(); // Fetch members when component mounts or spaces change
  // }, [spaces]);

  return (
    <>
      {/* <WebNavbar /> */}
      <div className="px-3">
        {/* Header with navigation and New Space button */}
        <div className="px-3 w-full h-[65px] flex bg-white rounded-[12px] border-none items-center max-w-full">
          <div className="flex space-x-[10px]">
            <button className="rounded-lg text-sm text-white border w-[134px] h-[41px] bg-primaryColor-700">
              Space Settings
            </button>
            <button
              onClick={() => router.push(`/members`)}
              className="rounded-lg text-sm border w-[104px] h-[41px] text-gray-400"
            >
              Members
            </button>
            <button
              onClick={() => router.push(`/access`)}
              className="rounded-lg text-sm border w-[89px] h-[41px] text-gray-400"
            >
              Access
            </button>
          </div>

          {/* New Space button triggered by dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="rounded-lg text-sm text-white border flex items-center h-[41px] bg-primaryColor-700 space-x-2 ml-auto px-5 py-[2.5px]">
                <ClipboardPlus className="h-5 w-5" />
                <span className="leading-none">New Space</span>
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[534px] font-inter">
              <DialogHeader className="text-gray-500 text-base font-semibold">
                <DialogTitle className="text-base">Space Setting</DialogTitle>
              </DialogHeader>

              <div>
                <Label
                  htmlFor="name"
                  className="text-sm text-[#111928] font-medium"
                >
                  Space Name:
                </Label>
                <Input
                  id="name"
                  placeholder="Space Name"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  className="text-gray-500 mt-1.5 py-3 px-2 bg-gray-50 border border-gray-300 rounded-md focus-visible:ring-transparent"
                />
              </div>

              <DialogFooter className="flex justify-between ">
                <Button
                  type="button"
                  onClick={SpaceCreateDialogClose}
                  className=" text-gray-700  bg-gray-100 h-[36px] w-[117.61px] hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={addSpace}
                  className="bg-primaryColor-700 hover:bg-blue-600 text-white"
                >
                  Create Space
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table displaying spaces */}
        <div className="pt-[18px] pb-[18px]">
          <Table className="border-b   overflow-y-auto playlist-scroll border-gray-200 bg-white rounded-[10px]">
            <TableHeader className=" sticky top-0">
              <TableRow>
                <TableHead className="px-4 py-4 font-semibold text-gray-500 text-sm">
                  SPACE NAME
                </TableHead>
                <TableHead className="px-4 py-4 font-semibold text-gray-500 text-sm">
                  CREATED BY
                </TableHead>
                <TableHead className="px-4 py-4 font-semibold text-gray-500 text-sm">
                  TEAMS
                </TableHead>
                <TableHead className="px-4 py-4  font-semibold text-gray-500 text-sm">
                  MEMBERS
                </TableHead>
                <TableHead className="px-4 py-4 text-right font-semibold text-gray-500 text-sm">
                  ACTION
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spaces.length > 0 ? (
                spaces.map((space) => (
                  <TableRow key={space.id}>
                    <TableCell className="px-4 py-4 text-sm text-gray-900">
                      {space.name}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-gray-500">
                      Laxman Sarav
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {space.teams && space.teams.length > 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate block max-w-[150px] cursor-pointer">
                                {space.teams.slice(0, 2).join(", ")}
                                {space.teams.length > 2 && `, ...`}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className=" w-[172px] h-auto">
                              <div className="px-[10px] py-[10px] text-xs font-inter font-normal">
                                {space.teams.join(", ")}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        "No teams"
                      )}
                    </TableCell>
                    {/* <TableCell>
                      {spaces.length > 0 ? (
                        spaces.map((team: any, index: number) => (
                          <div key={index} className="flex">
                            {Array.isArray(team?.members) &&
                            team.members.length > 0 ? (
                              <>
                                {team.members
                                  .slice(0, 6)
                                  .map((member: any, idx: number) => (
                                    <Image
                                      key={idx}
                                      src={member.profile_image}
                                      alt={member.name}
                                      width={30}
                                      height={30}
                                      className={`w-[32px] h-[32px] rounded-full ${
                                        team.members.length === 1
                                          ? "mr-2.5"
                                          : team.members.length > 0
                                          ? "-mr-2.5"
                                          : ""
                                      } border-2 border-white`}
                                    />
                                  ))}
                                {team.members.length > 6 && (
                                  <div className="bg-gray-900 text-white rounded-full w-[32px] h-[32px] flex items-center justify-center text-xs border-2 border-white">
                                    +{team.members.length - 6}
                                  </div>
                                )}
                              </>
                            ) : (
                              <p className="text-gray-900 font-inter text-sm">
                                No Members Found
                              </p>
                            )}
                          </div>
                        ))
                      ) }
                    </TableCell> */}
                    <TableCell className="px-4 py-4 text-sm text-gray-500">
                      <div className="flex">
                        {teamData && teamData.length > 0 ? (
                          <>
                            {teamData
                              .filter((team: any) => team.space_id === space.id) // Get teams for this space
                              .flatMap((team: any) => team?.members || []) // Flatten all members
                              .slice(0, 6) // Limit to first 6 members
                              .map((member: any, index: number) => (
                                <Image
                                  key={index}
                                  src={member.profile_image}
                                  alt={member.name}
                                  width={30}
                                  height={30}
                                  className={`w-[32px] h-[32px] rounded-full ${
                                    teamData.length === 1
                                      ? "mr-2.5"
                                      : teamData.length > 0
                                      ? "-mr-2.5"
                                      : ""
                                  } border-2 border-white`}
                                />
                              ))}
                            {teamData
                              .filter((team: any) => team.space_id === space.id)
                              .flatMap((team: any) => team?.members || [])
                              .length > 6 && (
                              <div className="bg-gray-900 text-white rounded-full w-[32px] h-[32px] flex items-center justify-center text-xs border-2 border-white">
                                +
                                {teamData
                                  .filter(
                                    (team: any) => team.space_id === space.id
                                  )
                                  .flatMap((team: any) => team?.members || [])
                                  .length - 6}
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-900 font-inter text-sm">
                            No Members Found
                          </p>
                        )}
                      </div>
                    </TableCell>

                   
                    <TableCell className="px-4 py-4 items-center">
                      <div className="flex justify-end">
                      <button
                        onClick={() => router.push(`/editspace/${space.id}`)}
                      >
                        <Pencil className="h-5 w-5 " />
                      </button>
                      <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>
                          <div
                            onClick={() => {
                              console.log(space.id);
                              setSpaceToDelete(space.id);
                              setIsOpen(true);
                            }}
                            className="py-4 px-4"
                          >
                            <Trash2 className="h-5 w-5 items-center" />
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <div className="">
                            <h2 className="text-lg font-semibold">
                              Are you sure?
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                              Do you really want to delete this{" "}
                              <span className="font-bold">{space.name}</span>
                            </p>
                          </div>
                          <DialogFooter className="flex justify-end mt-4">
                            {/* Cancel button */}
                            <button
                              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                              onClick={handleDeleteDialogClose}
                              disabled={isDeleting}
                            >
                              Cancel
                            </button>

                            {/* Delete button */}
                            <Button
                              className="ml-2 px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                              onClick={() => {
                                if (spaceToDelete) {
                                  deleteSpace(spaceToDelete);
                                }
                              }}
                              disabled={isDeleting}
                            >
                              {/* {isDeleting ? "Deleting..." : "Delete"} */}
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-4"
                  >
                    No spaces available. Click "New Space" to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
