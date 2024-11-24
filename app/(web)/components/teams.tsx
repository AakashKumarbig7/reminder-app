"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Ellipsis, Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import WebMentionInput from "./webMentions";
import { Carousel1, CarouselContent1, CarouselItem1 } from "./webCarousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "react-datepicker/dist/react-datepicker.css";
import TaskDateUpdater from "./dueDate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  spaceId: number;
}

interface Team {
  id: number;
  team_name: string;
  tasks: { id: number; inputValue: string }[];
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

const SpaceTeam: React.FC<SearchBarProps> = ({ spaceId }) => {
  const styledInputRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [text, setText] = useState<string>("");
  const [taskErrorMessage, setTaskErrorMessage] = useState({
    status: false,
    errorId: 0,
  });
  const [taskStatus, setTaskStatus] = useState<string>("In Progress");
  const [createTask, setCreateTask] = useState<{
    status: boolean;
    taskId: any;
  }>({
    status: false,
    taskId: 0,
  });
  const [taskStatusShow, setTaskStatusShow] = useState({
    status: false,
    taskId: 0,
  });
  const [allTasks, setAllTasks] = useState<any>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [teamNameDialogOpen, setTeamNameDialogOpen] = useState(false);
  const [teamNameSheetOpen, setTeamNameSheetOpen] = useState(false);
  const [updateOptionStates, setUpdateOptionStates] = useState<any>({});
  const [addedMembers, setAddedMembers] = useState<any[]>([]);
  const [matchingUsers, setMatchingUsers] = useState<Tab[]>([]);
  const [noUserFound, setNoUserFound] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Helper function to toggle options for a specific team
  const toggleUpdateOption = (teamId: any) => {
    setUpdateOptionStates((prev: any) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("space_id", spaceId);

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      const teamData = data.map((team) => ({
        ...team,
        tasks: [], // Initialize each team with an empty tasks array
      }));
      setTeams(teamData as Team[]);
    }
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };

    return date.toLocaleDateString("en-GB", options); // 'en-GB' gives the format "23 Aug 2024"
  };

  const handleAddTask = async (teamId: any, spaceId: number) => {
    // setCreateTask({ status: true, teamId: teamId });
    // Update the state to add the new task at the beginning of the team's tasks
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              tasks: [
                { id: team.tasks.length + 1, inputValue: "" }, // Add the new task at the beginning
                ...team.tasks,
              ],
            }
          : team
      )
    );

    // Insert the new task into the database
    try {
      const { data: insertedTask, error: insertError } = await supabase
        .from("tasks")
        .insert({
          time: formatDate(new Date()),
          status: taskStatus,
          team_id: teamId,
          space_id: spaceId,
          due_date: formatDate(new Date()),
        })
        .select()
        .order("id", { ascending: false });

      if (insertError) {
        throw insertError;
      }
      console.log(
        insertedTask.map((task: any) => task.id),
        " added task id"
      );
      console.log(insertedTask, "added task");
      setCreateTask({ status: true, taskId: insertedTask[0] });

      // Fetch updated tasks for the team
      const { data: fetchedTasks, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("space_id", spaceId)
        .eq("team_id", teamId);

      if (fetchError) {
        console.error(fetchError);
        return;
      }

      if (fetchedTasks) {
        console.log(fetchedTasks, "team data");
        fetchTasks();
      }
    } catch (error) {
      console.error("Error adding or fetching tasks:", error);
    }
  };

  const handleDeleteTask = async (teamId: number, taskId: number) => {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) throw error;

    console.log(data, " deleted task");
    fetchTasks();
  };

  //  const handleUpdateTask = async (teamId: number, taskId: number) => {
  //   try {
  //     let mentions = text.match(/@\w+/g) || [];
  //     let content = text.replace(/@\w+/g, "").trim();

  //     const {data, error} = await supabase
  //     .from("tasks")
  //     .select("*")
  //     .eq("id", taskId)
  //     .eq("team_id", teamId)
  //     .single();

  //     if (error) {
  //       console.error("Error fetching task:", error);
  //       throw error;
  //     }

  //     if (data) {
  //       console.log(data.task_content, "task data");
  //       console.log(data, "current task data");
  //     }
  //     if(data.task_content === null && (data.mentions.length === 0 || data.mentions === null)) {
  //       setTaskErrorMessage({ status: true, errorId: taskId });
  //       return;
  //     }
  //     const { data: updatedTask, error: updateError } = await supabase
  //       .from("tasks")
  //       .update({
  //         task_content: content,
  //         mentions: mentions,
  //       })
  //       .eq("id", taskId)
  //       .eq("team_id", teamId)
  //       .select();

  //     if (updateError) {
  //       throw updateError;
  //     }

  //     if (updatedTask) {
  //       console.log(updatedTask, "updated task");
  //       setTaskErrorMessage({ status: false, errorId: taskId });
  //       setText("");
  //       fetchTasks();
  //     }
  //   }
  //   catch (error) {
  //     console.error("Error adding or fetching tasks:", error);
  //   }
  //  }

  const handleUpdateTask = async (teamId: number, taskId: number) => {
    try {
      const mentions = text.match(/@\w+/g) || []; // Extract mentions
      const content = text.replace(/@\w+/g, "").trim(); // Remove mentions and trim content

      console.log(taskId, "taskId");

      // Fetch the current task by ID and Team ID
      const { data: taskData, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .eq("team_id", teamId)
        .single();

      if (fetchError) {
        console.error("Error fetching task:", fetchError);
        throw fetchError;
      }

      if (taskData) {
        console.log(taskData.task_content, "task data");
        console.log(taskData, "current task data");

        // Validate if both content and mentions are empty
        if (!content && mentions.length === 0) {
          setTaskErrorMessage({ status: true, errorId: taskId });
          console.warn("Please enter both content and mentions.");
          return;
        }

        // Reset the error message state if validation passes
        setTaskErrorMessage({ status: false, errorId: taskId });

        console.log(mentions, content, "parsed text");

        // Update the task in the database
        const { data: updatedTask, error: updateError } = await supabase
          .from("tasks")
          .update({
            mentions,
            task_content: content,
          })
          .eq("team_id", teamId)
          .eq("id", taskId);

        if (updateError) {
          console.error("Error updating task:", updateError);
          throw updateError;
        }

        console.log(updatedTask, "updated task");

        // Handle styled input and UI updates
        const styledInput = styledInputRef.current;
        if (styledInput && !styledInput.innerText.trim()) {
          console.warn("Styled input is empty.");
          return;
        }

        console.log("Task:", styledInput?.innerText);
        // styledInput.innerText = ""; // Clear the styled input
        setText(""); // Clear the text state
        setCreateTask({ status: false, taskId: taskId }); // Hide the task creation UI
        setTaskStatusShow({ status: false, taskId: taskId }); // Show task status
      }
    } catch (error) {
      console.error("Error in handleUpdateTask:", error);
    }
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    if (data) {
      setAllTasks(data);
    }
  };

  const handleClose = () => {
    setTeamNameSheetOpen(false);
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      const { error } = await supabase.from("teams").delete().eq("id", teamId);
      if (error) {
        console.error("Error deleting team:", error);
        return;
      }
      setTeamNameDialogOpen(false);
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleUpdateTeamName = async (teamId: number, spaceId: number) => {
    console.log(teamId, spaceId);
    try {
      const { data, error } = await supabase
        .from("teams")
        .update({ team_name: teamName, members: addedMembers })
        .eq("id", teamId)
        .eq("space_id", spaceId)
        .single();

      if (error) {
        console.error("Error updating team name:", error);
        return;
      }

      // if (data) {
      console.log("Team name updated successfully:", data);
      fetchTeams();
      setTeamNameSheetOpen(false);
      // }
    } catch (error) {
      console.error("Error updating team name:", error);
    }
  };

  const getTeamData = async (teamId: number) => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      if (data) {
        console.log("User data:", data);
        setAddedMembers(data.members);
        return data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const removeMember = (user: any, index: number) => {
    setAddedMembers((prevMembers) =>
      prevMembers.filter(
        (member: any, i: number) => !(member.id === user.id && i === index)
      )
    );
  };

  const handleUserSelect = (user: Tab) => {
    setAddedMembers((prevMembers) => [...prevMembers, user]);

    setEmailInput("");
    setHighlightedIndex(-1);
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
      // Select highlighted user on Enter
      handleUserSelect(matchingUsers[highlightedIndex]);
    }
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

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [highlightedIndex, matchingUsers]);

  useEffect(() => {
    fetchTeams();
    fetchTasks();
  }, [spaceId]);

  return (
    <>
      {teams.length > 0 ? (
        <div className="w-full py-4 px-0">
          <Carousel1 opts={{ align: "start" }} className="w-full max-w-full">
            <CarouselContent1 className="flex space-x-1">
              {teams.map((team, index) => (
                <CarouselItem1
                  key={team.id}
                  className="w-[339px] h-auto min-h-[200px] basis-[28%]"
                >
                  <Card key={index}>
                    <CardContent key={index} className="p-[18px] w-full h-full">
                      <div className="flex justify-between items-center relative">
                        <p className="text-lg font-semibold text-black font-geist">
                          {team.team_name}
                        </p>
                        <DropdownMenu
                        // open={updateOptionStates}
                        // onOpenChange={setUpdateOptionStates}
                        >
                          <DropdownMenuTrigger>
                            <Ellipsis size={18} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <p>
                              <Dialog
                                open={teamNameDialogOpen}
                                onOpenChange={setTeamNameDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="border-none w-full"
                                    variant="outline"
                                  >
                                    Delete
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Delete Team</DialogTitle>
                                    <DialogDescription>
                                      Do you want to delete this team?
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="flex justify-center items-center w-full gap-4">
                                    <Button
                                    variant='outline'
                                      className="w-1/3"
                                      type="submit"
                                      onClick={() =>
                                        setTeamNameDialogOpen(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      className="bg-red-600 hover:bg-red-500 w-1/3"
                                      type="button"
                                      onClick={() => handleDeleteTeam(team.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </p>
                            <p>
                              <Sheet
                                open={teamNameSheetOpen}
                                onOpenChange={setTeamNameSheetOpen}
                              >
                                <SheetTrigger asChild>
                                  <Button
                                    className="border-none w-full"
                                    variant="outline"
                                    onClick={() => getTeamData(team.id)}
                                  >
                                    Edit
                                  </Button>
                                </SheetTrigger>
                                <SheetContent
                                  className="min-h-screen overflow-y-scroll"
                                  style={{ maxWidth: "500px" }}
                                >
                                  <SheetHeader>
                                    <SheetTitle>Edit profile</SheetTitle>
                                  </SheetHeader>
                                  <div className="mt-2">
                                    <label
                                      htmlFor="name"
                                      className="text-sm text-[#111928] font-medium"
                                    >
                                      Team Name
                                    </label>
                                    <Input
                                      className="mb-3 mt-1"
                                      type="text"
                                      placeholder="Team Name"
                                      defaultValue={team.team_name}
                                      onChange={(e) => {
                                        setTeamName(e.target.value);
                                      }}
                                    />
                                    <div className="mt-4 relative">
                                      {matchingUsers.length > 0 &&
                                        emailInput.length > 0 &&
                                        !noUserFound && (
                                          <div className="absolute bottom-[-28px] max-h-[160px] h-auto overflow-y-auto w-full bg-white border border-gray-300 rounded-md">
                                            {matchingUsers.length > 0 && (
                                              <ul>
                                                {matchingUsers.map(
                                                  (user, index) => (
                                                    <li
                                                      key={user.id}
                                                      className={`p-2 cursor-pointer ${
                                                        index ===
                                                        highlightedIndex
                                                          ? "bg-gray-200"
                                                          : "hover:bg-gray-100"
                                                      }`}
                                                      onClick={() =>
                                                        handleUserSelect(user)
                                                      }
                                                      onMouseEnter={() =>
                                                        setHighlightedIndex(
                                                          index
                                                        )
                                                      }
                                                    >
                                                      {user.email}
                                                    </li>
                                                  )
                                                )}
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
                                      autoComplete="off"
                                        id="members"
                                        placeholder="Add guest email"
                                        className="text-gray-500 mt-1.5 h-12 px-2 bg-gray-50 border border-gray-300 rounded-md focus-visible:ring-transparent"
                                        onChange={getUserData}
                                      />
                                    </div>
                                    {addedMembers.length > 0 && (
                                      <div className="mt-2 p-2 flex flex-wrap items-center gap-2 w-full border border-gray-300 rounded-md">
                                        {addedMembers.map((member, index) => (
                                          <div
                                            key={member.id}
                                            className="flex justify-between items-center gap-2 py-1 px-2 w-full text-sm text-gray-500"
                                          >
                                            <div className="flex items-center gap-1">
                                              {/* <Image
                            src="/public/images/Subtract.png"
                            alt="user image"
                            width={36}
                            height={36}
                            className="w-6 h-6 rounded-full"
                          /> */}
                                              <span>{(member.username) || member.name}</span>
                                            </div>
                                            <span
                                              className={`${
                                                member.role === "superadmin"
                                                  ? "text-[#0E9F6E]"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              {member.designation?.length > 25
                                                ? `${member.designation?.slice(
                                                    0,
                                                    26
                                                  )}...`
                                                : member.designation}
                                            </span>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                removeMember(member, index);
                                              }}
                                              className="focus:outline-none space_delete_button text-gray-400"
                                            >
                                              <Trash2
                                                className="text-black"
                                                size={18}
                                              />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex justify-center gap-4 mt-5">
                                    {/* <Button variant='outline' className="w-1/3" onClick={handleClose}>
                                      Cancel
                                    </Button> */}
                                    <Dialog
                                open={teamNameDialogOpen}
                                onOpenChange={setTeamNameDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="border-none w-1/2 bg-red-600 hover:bg-red-500 hover:text-white text-white" 
                                    variant="outline"
                                  >
                                    Delete
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Delete Team</DialogTitle>
                                    <DialogDescription>
                                      Do you want to delete this team?
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="flex justify-center items-center w-full gap-4">
                                    <Button
                                    variant='outline'
                                      className="w-1/3"
                                      type="submit"
                                      onClick={() =>
                                        setTeamNameDialogOpen(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      className="bg-red-600 hover:bg-red-500 w-1/3"
                                      type="button"
                                      onClick={() => handleDeleteTeam(team.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                                    <Button
                                    className="w-1/2"
                                      onClick={() =>
                                        handleUpdateTeamName(team.id, spaceId)
                                      }
                                    >
                                      Save changes
                                    </Button>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </p>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <Dialog
                        open={teamNameDialogOpen}
                        onOpenChange={setTeamNameDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Settings onClick={async() => {
                              const {data, error } = await supabase
                              .from('teams')
                              .select('team_name')
                              .eq('id', team.id)
                              .single();

                              if (error) {
                                console.log(error);
                              }

                              if (data) {
                                setTeamName(data.team_name);
                              }
                            }} size={20} className="cursor-pointer" />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Team</DialogTitle>
                              <p>{team.team_name}</p>
                              <p>{team.id}</p>
                            </DialogHeader>
                            <div>
                              <Input
                                className="mb-3"
                                type="text"
                                placeholder="Team Name"
                                value={team.team_name}
                                onChange={(e) => {
                                  setTeamName(e.target.value);
                                }}
                              />
                            </div>
                            <DialogFooter>
                              <Button onClick={handleClose}>Cancel</Button>
                              <Button onClick={() => handleUpdateTeamName(team.id, spaceId)}>Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog> */}
                        {/* <Menubar>
                          <MenubarMenu>
                            <MenubarTrigger><Ellipsis size={18} /></MenubarTrigger>
                            <MenubarContent>
                              <MenubarItem>
                                <Sheet open={teamNameDialogOpen}
                        onOpenChange={setTeamNameDialogOpen}>
                                  <SheetTrigger asChild>
                                    <Button variant="outline">Edit</Button>
                                  </SheetTrigger>
                                  <SheetContent>
                                    <SheetHeader>
                                      <SheetTitle>Edit profile</SheetTitle>
                                      <SheetDescription>
                                        Make changes to your profile here. Click
                                        save when you're done.
                                      </SheetDescription>
                                    </SheetHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="name"
                                          className="text-right"
                                        >
                                          Name
                                        </Label>
                                        <Input
                                          id="name"
                                          value="Pedro Duarte"
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="username"
                                          className="text-right"
                                        >
                                          Username
                                        </Label>
                                        <Input
                                          id="username"
                                          value="@peduarte"
                                          className="col-span-3"
                                        />
                                      </div>
                                    </div>
                                    <SheetFooter>
                                      <SheetClose asChild>
                                        <Button type="submit">
                                          Save changes
                                        </Button>
                                      </SheetClose>
                                    </SheetFooter>
                                  </SheetContent>
                                </Sheet>
                              </MenubarItem>
                              <MenubarItem>Delete</MenubarItem>
                            </MenubarContent>
                          </MenubarMenu>
                        </Menubar> */}
                      </div>
                      <Button
                        variant={"outline"}
                        className="mt-3 border-dashed border-gray-500 text-gray-500 text-sm font-medium w-full"
                        onClick={() => {
                          console.log("Team ID:", team.id);
                          handleAddTask(team.id, spaceId);
                        }}
                      >
                        <Plus size={18} />
                        Add Task
                      </Button>
                      {allTasks.map(
                        (task: any) =>
                          task.team_id === team.id && (
                            <div
                              key={task.id}
                              className="flex flex-col gap-2.5 mt-3"
                            >
                              {/* {task.team_id === team.id && ( */}
                              <div
                                key={task.id}
                                className="flex-1 border border-[#ddd] rounded-lg p-3 font-geist"
                              >
                                <div className="flex justify-between items-center">
                                  {/* <p>{task.id}</p> */}
                                  <p className="text-xs font-semibold text-[#A6A6A7]">
                                    {formatDate(new Date())}
                                  </p>
                                  <Trash2
                                    size={18}
                                    className="text-[#EC4949] cursor-pointer"
                                    onClick={() => {
                                      console.log(
                                        "Deleting Task ID:",
                                        task.id,
                                        "for Team ID:",
                                        team.id
                                      );
                                      handleDeleteTask(team.id, task.id);
                                    }}
                                  />
                                </div>
                                <WebMentionInput
                                  text={text}
                                  setText={setText}
                                  taskErrorMessage={taskErrorMessage}
                                  setTaskErrorMessage={setTaskErrorMessage}
                                  allTasks={allTasks}
                                  teamId={team.id}
                                  taskId={task.id}
                                />
                                <div className="flex justify-between items-center">
                                  <TaskDateUpdater
                                    team={team}
                                    task={task}
                                    fetchTasks={fetchTasks}
                                  />

                                  {createTask && (
                                    <Button
                                      variant={"outline"}
                                      className="bg-primaryColor-700 text-white rounded-full py-2 h-7 px-3 text-sm font-inter font-medium hover:bg-blue-600 hover:text-white"
                                      onClick={() => {
                                        handleUpdateTask(team.id, task.id);
                                      }}
                                    >
                                      Create {createTask.taskId}
                                    </Button>
                                  )}
                                  {taskStatusShow && (
                                    <Select
                                      defaultValue="In progress"
                                      onValueChange={(value) => {
                                        console.log(
                                          "Task Status Changed for Task ID:",
                                          task.id,
                                          "Team ID:",
                                          team.id,
                                          "New Status:",
                                          value
                                        );
                                        setTaskStatus(value);
                                      }}
                                    >
                                      <SelectTrigger className="w-[164px] pt-2 pr-[10px] text-[#9B9B9B] text-center border-[#E2E2E2] bg-[#E2E2E2] rounded-[30px]">
                                        <SelectValue placeholder="status" />
                                      </SelectTrigger>
                                      <SelectContent className="text-[#9B9B9B]">
                                        <SelectItem value="todo">
                                          To Do
                                        </SelectItem>
                                        <SelectItem value="In progress">
                                          In Progress
                                        </SelectItem>
                                        <SelectItem value="Internal feedback">
                                          Internal feedback
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              </div>
                              {/* )} */}
                            </div>
                          )
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem1>
              ))}
            </CarouselContent1>
          </Carousel1>
        </div>
      ) : (
        <div className="w-full min-h-[80vh] flex justify-center items-center">
          <p className="text-lg font-semibold">No teams found</p>
        </div>
      )}
    </>
  );
};

export default SpaceTeam;
