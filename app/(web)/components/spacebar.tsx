"use client";
import { supabase } from "@/utils/supabase/supabaseClient";
import {
  CirclePlus,
  CircleX,
  Ellipsis,
  EllipsisVertical,
  Route,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import toast, { Toaster } from "react-hot-toast";
import SpaceTeam from "./teams";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface Tab {
  id: number;
  space_name: string;
  email: string;
  username: string;
  designation: string;
  role: string;
  department: string;
  profile_image: string;
}

interface loggedUserDataProps {
  loggedUserData: any;
}

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

const SpaceBar: React.FC<loggedUserDataProps> = ({ loggedUserData }) => {
  const route = useRouter();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [matchingUsers, setMatchingUsers] = useState<Tab[]>([]);
  const [noUserFound, setNoUserFound] = useState<boolean>(false);
  const [addedMembers, setAddedMembers] = useState<Tab[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [teamName, setTeamName] = useState<string>("");
  const [memberAddDialogOpen, setMemberAddDialogOpen] = useState(false);
  const [teamNameError, setTeamNameError] = useState(false);
  const [teamMemberError, setTeamMemberError] = useState(false);
  const [spaceId, setSpaceId] = useState<number | null>(null);
  const [teamData, setTeamData] = useState(() => ({}));
  const [updatedSpaceName, setUpdatedSpaceName] = useState<string>("");
  const [spaceEditDialogOpen, setSpaceEditDialogOpen] = useState(false);
  const [spaceDetails, setSpaceDetails] = useState<any[]>([]);
  const [spaceName, setSpaceName] = useState<string>("");
  const [deletedSpace, setDeletedSpace] = useState<any[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<any[]>([]);
  const [deletedTeams, setDeletedTeams] = useState<any[]>([]);

  useEffect(() => {
    fetchSpaces();
  }, []);

  // const handleOpenChange = (open: boolean) => {
  //   setSpaceEditDialogOpen({ status: open, id: tab.id });
  // };

  const updateSpaceTab = async (id: any) => {
    try {
      const { error } = await supabase
        .from("spaces")
        .update({ space_name: updatedSpaceName || spaceName })
        .eq("id", id);

      if (error) {
        console.error("Error updating space:", error);
        return;
      }

      const { data: taskData, error: taskError } = await supabase
        .from("tasks")
        .update({is_deleted: true})
        .in(
          "team_id",
          deletedSpace.map((member: any) => member.id)
        );

      if (taskError) {
        console.error("Error deleting tabs:", taskError);
        return;
      }

      const { data, error: spaceError } = await supabase
        .from("teams")
        .update({is_deleted: true})
        .in(
          "id",
          deletedSpace.map((member: any) => member.id)
        );

      if (spaceError) {
        console.error("Error deleting tabs:", spaceError);
        return;
      }

      // notify("Space updated successfully", true);
      fetchSpaces();
      fetchTeamData();
      setSpaceEditDialogOpen(false);
      const newTabs = tabs.filter((tab) => tab.id !== id);
      setTabs(newTabs);
      if (newTabs.length > 0) {
        setActiveTab(newTabs[0].id); // Set first tab as active if any left
      } else {
        setActiveTab(null);
      }

      // Optional: Refresh spaces list if needed
    } catch (error) {
      console.error("Error updating space:", error);
    }
  };

  const deleteTeam = async (user: any, index: number) => {
    setSpaceDetails((prevMembers) => {
      // Find the team to delete based on user id and index
      const deletedTeam = prevMembers.find(
        (member: any, i: number) => member.id === user.id && i === index
      );
      if (deletedTeam) {
        console.log("Deleted Team:", deletedTeam);
        setDeletedSpace((prevMembers) => [...prevMembers, deletedTeam]);
      }

      return prevMembers.filter(
        (member: any, i: number) => !(member.id === user.id && i === index)
      );
    });
  };

  // Fetch spaces from database
  const fetchSpaces = async () => {
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("is_deleted", false)
      .order("space_name", { ascending: true });
    if (error) {
      console.error("Error fetching spaces:", error);
      return;
    }

    if (data) {
      setTabs(data);
      if (data.length > 0) {
        setActiveTab(data[0].id); // Set the first tab as active initially
      }
    }
  };

  // Handle clicking a tab
  const handleTabClick = async (id: number) => {
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", id)
      // .eq("is_deleted", false)
      .single();

    if (error) {
      console.error("Error fetching space:", error);
      return;
    }

    if (data) {
      setSpaceId(data.id);
      setSpaceName(data.space_name);
      const { data: spaceId, error: spaceError } = await supabase
        .from("teams")
        .select("*")
        .eq("is_deleted", false)
        .eq("space_id", data.id);

      if (spaceError) {
        console.error("Error fetching space:", spaceError);
        return;
      }

      if (spaceId) {
        setSpaceDetails(spaceId);
        console.log("Space data: ", spaceId);
      }
    }
    setActiveTab(id);
  };

  // Add a new tab in database and UI
  const addNewTab = async () => {
    const { data, error } = await supabase
      .from("spaces")
      .insert({ space_name: "New Space", is_deleted: false })
      .select();

    if (error) {
      console.error("Error adding new space:", error);
      return;
    }

    if (data && data[0]) {
      const newTab = data[0];
      setTabs((prevTabs) => [...prevTabs, newTab]);
      setActiveTab(newTab.id);
    }
  };

  // Delete a tab from database and UI
  const deleteTab = async (id: number) => {
    let backupData: {
      tasks: any[];
      teams: any[];
      space: any;
    } = { tasks: [], teams: [], space: null };
  
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
    fetchTeamData();
  
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (newTabs.length > 0) {
      setActiveTab(newTabs[0].id); // Set first tab as active if any left
    } else {
      setActiveTab(null);
    }
  
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
    fetchTeamData();
    route.refresh();
    const newTabs = tabs.filter((tab) => tab.id !== backupData.space.id);
    setTabs(newTabs);
    if (newTabs.length > 0) {
      setActiveTab(newTabs[0].id); // Set first tab as active if any left
    } else {
      setActiveTab(null);
    }
    toast({
      title: "Undo Successful!",
      description: "Space, tasks, and teams have been restored.",
    });
  };
  

  const getUserData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);

    try {
      // Fetch all users from the database
      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      // Filter users whose email includes the input value
      const matchingUsers =
        data?.filter((user) => user.email.includes(emailInput)) || [];

      if (matchingUsers.length > 0 || emailInput === "") {
        setMatchingUsers(matchingUsers);
        setNoUserFound(false);
      } else {
        setNoUserFound(true);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleUserSelect = (user: Tab) => {
    setTeamMemberError(false);

    setAddedMembers((prevMembers) => [...prevMembers, user]);

    setEmailInput("");
    setHighlightedIndex(-1);
  };

  const removeMember = (user: Tab, index: number) => {
    setAddedMembers((prevMembers) =>
      prevMembers.filter(
        (member: any, i: number) => !(member.id === user.id && i === index)
      )
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (matchingUsers.length === 0) return;

    if (e.key === "ArrowDown") {
      // Move highlight down
      setHighlightedIndex((prevIndex) =>
        prevIndex < matchingUsers.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      // Move highlight up
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : matchingUsers.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      setTeamMemberError(false);
      // Select highlighted user on Enter
      handleUserSelect(matchingUsers[highlightedIndex]);
    }
  };

  const defaultSpaceData = async () => {
    if (!activeTab) return;
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", activeTab)
      .single();

    if (error) {
      console.error("Error fetching spaces:", error);
      return;
    }

    if (data) {
      setSpaceId(data.id);
    }
  };

  const fetchTeamData = async () => {
    if (!spaceId) return;
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("is_deleted", false)
      .eq("space_id", spaceId);

    if (error) {
      console.log(error);
      return;
    }
  };

  const handleSaveMembers = async () => {
    if (teamName === "") {
      setTeamNameError(true);
      return;
    } else if (addedMembers.length === 0) {
      setTeamMemberError(true);
      return;
    } else {
      // Fetch selected user details based on `id`
      const { data: fetchedMembers, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .in(
          "id",
          addedMembers.map((member) => member.id)
        );

      if (fetchError) {
        console.error("Error fetching members:", fetchError);
        return;
      }

      // Check if there are any members already in the team
      const { data: existingTeam, error: checkError } = await supabase
        .from("teams")
        .select("*")
        .eq("team_name", teamName);

      if (checkError) {
        console.error("Error checking existing team:", checkError);
        return;
      }

      if (existingTeam && existingTeam.length > 0) {
        console.log("Team already exists with these members:", existingTeam);
        // notify("Team already exists with these members", false);
        return;
      }

      try {
        // Insert selected user details as array of objects into the `teams` table
        const { data: insertedData, error: insertError } = await supabase
          .from("teams")
          .insert({
            team_name: teamName,
            members: fetchedMembers.map((member) => ({
              id: member.id,
              name: member.username, // Assuming `name` is a field in your `users` table
              role: member.role,
              department: member.department,
              designation: member.designation,
              email: member.email, // Assuming `email` is a field in your `users` table
              entity_name: member.entity_name,
              profile_image: member.profile_image,
            })),
            space_id: activeTab,
            is_deleted: false,
          });

        if (insertError) {
          console.error("Error saving members:", insertError);
          return;
        }
        setTeamName("");
        setAddedMembers([]);
        setTeamNameError(false);
        setTeamMemberError(false);
        setMemberAddDialogOpen(false);
        fetchTeamData();
        // notify("Members saved successfully", true);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }
  };

  const handleClose = () => {
    setMemberAddDialogOpen(false);
    setTeamName("");
    setAddedMembers([]);
    setTeamNameError(false);
    setTeamMemberError(false);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [highlightedIndex, matchingUsers]);

  useEffect(() => {
    defaultSpaceData();
    setTeamData(fetchTeamData());
  }, [activeTab]);

  return (
    <div className="px-3">
      
      <div className="mb-4 flex justify-between items-center text-center bg-white px-3 border-none rounded-[12px] overflow-x-auto w-full max-w-full h-[62px]">
        <div className="flex gap-2 py-2.5 text-sm text-gray-400 mr-60">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`space_input max-w-44 min-w-fit relative flex items-center gap-2 rounded border pl-3 py-1 pr-8 cursor-pointer h-10 ${
                activeTab === tab.id
                  ? "bg-[#1A56DB] text-white border-none"
                  : "bg-white border-gray-300"
              }`}
            >
              <span>{tab.space_name}</span>

              <Sheet
              // open={spaceEditDialogOpen}
              // onOpenChange={setSpaceEditDialogOpen}
              >
                <SheetTrigger asChild>
                  <EllipsisVertical
                    className={`absolute right-2 focus:outline-none space_delete_button ${
                      activeTab === tab.id
                        ? "text-white border-none"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                    size={16}
                  />
                </SheetTrigger>
                <SheetContent
                  className="pt-2.5 p-3 font-inter flex flex-col justify-between"
                  style={{ maxWidth: "415px" }}
                >
                  <div>
                    <SheetHeader>
                      <SheetTitle className="text-gray-500 uppercase text-base">
                        space setting
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-3">
                      <Label htmlFor="name" className="text-sm text-gray-900">
                        Space Name
                      </Label>
                      <Input
                        id="name"
                        defaultValue={tab.space_name}
                        className="w-full mt-1"
                        onChange={(e) => setUpdatedSpaceName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="pt-2">
                      <Label htmlFor="name" className="text-sm text-gray-900">
                        Teams
                      </Label>
                      <div className="border border-gray-300 mt-1 rounded p-3 min-h-40 h-[70vh] max-h-[70vh] overflow-auto playlist-scroll">
                        {spaceDetails.length > 0 ? (
                          spaceDetails.map((team: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between mb-2"
                            >
                              <p className="text-gray-900 font-inter text-sm">
                                {team.team_name.length > 16
                                  ? team.team_name.slice(0, 16) + "..."
                                  : team.team_name}
                              </p>
                              <div className="flex">
                                {team.members.length > 0 ? (
                                  <>
                                    {team.members
                                      .slice(0, 6)
                                      .map((member: any, index: number) => (
                                        <Image
                                          key={index}
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

                              <Trash2
                                size={16}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTeam(team, index);
                                }}
                              />
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-base font-inter">
                            No Team Found
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/3 border border-red-500 text-red-500 text-sm hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTab(tab.id);
                      }}
                    >
                      Delete Space
                    </Button>
                    <SheetClose asChild>
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-1/3 text-sm"
                      >
                        Cancel
                      </Button>
                    </SheetClose>
                    <Button
                      type="submit"
                      className="bg-primaryColor-700 text-white hover:bg-primaryColor-700 text-sm w-1/3"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateSpaceTab(tab.id);
                      }}
                    >
                      Update
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          ))}
          {loggedUserData?.role === "owner" && (
            <button
              onClick={addNewTab}
              className="bg-white rounded border-dashed border border-gray-300 px-2 py-0.5 flex items-center gap-2 h-10 min-w-fit"
              style={{ width: "max-content" }}
            >
              Add New Space <CirclePlus size={16} />
            </button>
          )}
        </div>
        {loggedUserData?.role === "owner" && (
          <div className="flex gap-2 py-2.5 text-sm text-gray-400 ml-20">
            <Sheet
              open={memberAddDialogOpen}
              onOpenChange={setMemberAddDialogOpen}
            >
              <SheetTrigger asChild>
                <button
                  className="bg-white rounded border-dashed border border-gray-300 px-2 py-0.5 flex items-center gap-2 h-10"
                  style={{ width: "max-content" }}
                >
                  <span className="text-gray-600">
                    <CirclePlus size={16} />
                  </span>{" "}
                  Add Team
                </button>
              </SheetTrigger>
              <SheetContent
                className="min-h-screen overflow-y-scroll"
                style={{ maxWidth: "500px" }}
              >
                <SheetHeader>
                  <SheetTitle className="text-base">TEAM SETTING</SheetTitle>
                </SheetHeader>
                <div className="py-2">
                  <label
                    htmlFor="name"
                    className="text-sm text-[#111928] font-medium"
                  >
                    Team Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Development Name"
                    className="text-gray-500 mt-1.5 py-3 px-2 bg-gray-50 border border-gray-300 rounded-md focus-visible:ring-transparent"
                    onChange={(e: any) => {
                      setTeamName(e.target.value);
                      setTeamNameError(false);
                    }}
                  />
                  {teamNameError && (
                    <p className="text-red-500 text-sm mt-1">
                      Please fill the field
                    </p>
                  )}
                  <div className="mt-8 relative">
                    {matchingUsers.length > 0 &&
                      emailInput.length > 0 &&
                      !noUserFound && (
                        <div className="absolute bottom-[-28px] max-h-[160px] h-auto overflow-y-auto w-full bg-white border border-gray-300 rounded-md">
                          {matchingUsers.length > 0 && (
                            <ul>
                              {matchingUsers.map((user, index) => (
                                <li
                                  key={user.id}
                                  className={`p-2 cursor-pointer ${
                                    index === highlightedIndex
                                      ? "bg-gray-200"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onClick={() => handleUserSelect(user)}
                                  onMouseEnter={() =>
                                    setHighlightedIndex(index)
                                  }
                                >
                                  {user.email}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    {noUserFound && (
                      <div className="absolute bottom-[-28px] max-h-[160px] h-auto overflow-y-auto w-full bg-white border border-gray-300 rounded-md">
                        <ul>
                          <li className="p-2 cursor-pointer hover:bg-gray-100">
                            No User Found
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="members"
                      className="text-sm text-[#111928] font-medium"
                    >
                      Members
                    </label>
                    <Input
                      id="members"
                      placeholder="Add guest email"
                      className="text-gray-500 mt-1.5 h-12 px-2 bg-gray-50 border border-gray-300 rounded-md focus-visible:ring-transparent"
                      onChange={getUserData}
                    />

                    {/* <Button className="absolute right-[30px] bottom-[38px] rounded-[10px] border border-zinc-300 bg-primaryColor-700 text-white text-xs font-medium hover:bg-primaryColor-700">
                    <Plus size={16} />
                    Add
                  </Button> */}
                  </div>
                  {teamMemberError && (
                    <p className="text-red-500 text-sm mt-1">
                      Please fill the field
                    </p>
                  )}
                  {addedMembers.length > 0 && (
                    <div className="mt-2 p-2 flex flex-wrap items-center gap-2 w-full border border-gray-300 rounded-md">
                      {addedMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className="flex justify-between items-center gap-2 py-1 px-2 w-full text-sm text-gray-500"
                        >
                          <div className="flex items-center gap-1">
                            <Image
                              src={member.profile_image}
                              alt="user image"
                              width={36}
                              height={36}
                              className="w-[32px] h-[32px] rounded-full"
                            />
                            <span>{member.username}</span>
                          </div>
                          <span
                            className={`${
                              member.role === "superadmin"
                                ? "text-[#0E9F6E]"
                                : "text-gray-500"
                            }`}
                          >
                            {member.designation?.length > 25
                              ? `${member.designation?.slice(0, 26)}...`
                              : member.designation}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMember(member, index);
                            }}
                            className="focus:outline-none space_delete_button text-gray-400"
                          >
                            <Trash2 className="text-black" size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <SheetFooter className="mt-5">
                  <Button
                    type="submit"
                    variant={"outline"}
                    className="w-1/2 border border-gray-200 text-gray-800 font-medium"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-1/2 bg-primaryColor-700 hover:bg-blue-600 text-white"
                    onClick={handleSaveMembers}
                  >
                    Save
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
      <SpaceTeam
        spaceId={spaceId as number}
        teamData={teamData}
        setTeamData={fetchTeamData}
        loggedUserData={loggedUserData as any}
      />
    </div>
  );
};

export default SpaceBar;
