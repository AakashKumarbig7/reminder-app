"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Userimage from "@/public/images/Ellipse 7.png";
import EditPage from "@/app/(web)/editspace/[spaceId]/page";
const notify = (message: string, success: boolean) =>
  toast[success ? "success" : "error"](message, {
    style: {
      borderRadius: "10px",
      background: "#fff",
      color: "#000",
    },
    position: "top-right",
    duration: 3000,
  });
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

const TeamCard: React.FC<{
  team: any;
  spaceId: any;
  sendDataToParent: any;
}> = ({ team, spaceId, sendDataToParent }) => {
  const [teamName, setTeamName] = useState(team.team_name);
  const [teamNameError, setTeamNameError] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [matchingUsers, setMatchingUsers] = useState<any[]>([]);
  const [noUserFound, setNoUserFound] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [addedMembers, setAddedMembers] = useState<any[]>(team.members ?? []);
  const [teamMemberError, setTeamMemberError] = useState(false);
  const [isopen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      }));
      setTeams(teamData as Team[]);
    }
  };
  const getUserData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setEmailInput(inputValue);

    if (inputValue.trim() === "") {
      setMatchingUsers([]);
      setNoUserFound(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      const matchingUsers =
        data?.filter((user) => user.email.includes(inputValue)) || [];

      if (matchingUsers.length > 0) {
        setMatchingUsers(matchingUsers);
        setNoUserFound(false);
      } else {
        setMatchingUsers([]);
        setNoUserFound(true);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };
  // const handleUpdateTeam = async (teamId: number, spaceId: number) => {
  //   console.log(teamId, spaceId);
  //   if (addedMembers.length === 0) {
  //     setTeamNameError(true);
  //     return;
  //   } else if (addedMembers.length > 0) {
  //     try {
  //       const { data, error } = await supabase
  //         .from("teams")
  //         .update({  members: addedMembers })
  //         .eq("id", teamId)
  //         .eq("space_id", spaceId)
  //         .single();

  //       if (error) {
  //         console.error("Error updating team name:", error);
  //         return;
  //       }

  //       // if (data) {
  //       console.log("Team name updated successfully:", data);
  //       fetchTeams();
  //       // setTeamNameSheetOpen(false);
  //       setTeamNameError(false);
  //       notify("Team updated successfully", true);
  //       // }
  //     } catch (error) {
  //       console.error("Error updating team name:", error);
  //     }
  //   }
  // };
  const handleUserSelect = (user: Tab, teamId: any) => {
    setTeamMemberError(false);

    // Check if the user is already added
    const isAlreadyAdded = addedMembers.some((member) => member.id === user.id);

    if (isAlreadyAdded) {
      notify("User is already added to this team", false);
      return;
    }
    // else
    // {
    //   sendDataToParent(user,teamId,"add");
    // }

    setAddedMembers((prevMembers) => [...prevMembers, user]);
    sendDataToParent(user, teamId, "add");

    // setAddedMembers( Array.from(
    //   new Set(addedMembers.map(member => member.id))
    // ).map(id => addedMembers.find(member => member.id === id)!))

    // sendDataToParent(user,teamId,"add");

    setEmailInput("");
    setHighlightedIndex(-1);
    console.log(addedMembers);
  };

  const removeMember = (user: any, index: number, teamId: any) => {
    sendDataToParent(user, teamId, "delete");
    setAddedMembers((prevMembers) =>
      prevMembers.filter(
        (member: any, i: number) => !(member.id === user.id && i === index)
      )
    );
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      // Delete tasks associated with the team first
      const { error: taskError } = await supabase
        .from("tasks")
        .delete()
        .eq("team_id", teamId);

      if (taskError) {
        console.error("Error deleting tasks:", taskError);
        return;
      }

      console.log("Tasks deleted successfully.");

      // Now delete the team
      const { error: teamError } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);

      if (teamError) {
        console.error("Error deleting team:", teamError);
        return;
      }

      console.log("Team deleted successfully.");

      // Additional cleanup actions
      setIsOpen(false);
      fetchTeams();
      notify("Team deleted successfully", true);
     
    } catch (error) {
      console.error("Unexpected error during deletion:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // const handleClose = () => {
  //     // setMemberAddDialogOpen(false);
  //     setTeamName("");
  //     setAddedMembers([]);
  //     setTeamNameError(false);
  //     setTeamMemberError(false);
  // };

  // const handleSaveMembers = async () => {
  //   // Validate team name
  //   if (teamName === "") {
  //     setTeamNameError(true);
  //     return;
  //   }

  //   // Validate added members
  //   if (addedMembers.length === 0) {
  //     setTeamMemberError(true);
  //     return;
  //   }

  //   try {
  //     // Fetch selected user details based on `id`
  //     const { data: fetchedMembers, error: fetchError } = await supabase
  //       .from("users")
  //       .select("*")
  //       .in(
  //         "id",
  //         addedMembers.map((member) => member.id)
  //       );

  //     if (fetchError) {
  //       console.error("Error fetching members:", fetchError);
  //       return;
  //     }

  //     // Insert team data into `teams` table
  //     const { error: insertError } = await supabase.from("teams").insert({
  //       team_name: teamName,
  //       members: fetchedMembers.map((member) => ({
  //         id: member.id,
  //         name: member.username, // Ensure your `users` table has this column
  //         role: member.role,
  //         department: member.department,
  //         designation: member.designation,
  //         email: member.email, // Ensure `email` exists in your table
  //       })),
  //       space_id: spaceId, // Assuming `spaceId` is correctly defined in your context
  //     });

  //     if (insertError) {
  //       console.error("Error saving members:", insertError);
  //       return;
  //     }

  //     // Reset states on successful save
  //     setTeamName("");
  //     setAddedMembers([]);
  //     setTeamNameError(false);
  //     setTeamMemberError(false);
  // fetchTeams();
  //     notify("Members saved successfully", true);
  //     console.log("save clicked")

  //   }

  //   catch (err) {
  //     console.error("Unexpected error:", err);
  //   }
  // };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [highlightedIndex, matchingUsers]);
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
      setTeamMemberError(false);
      handleUserSelect(matchingUsers[highlightedIndex], "");
    }
  };

  return (
    <CarouselItem
      key={team.id}
      className="w-[339px] h-auto min-h-[200px] basis-[28%]"
    >
      <>
        <Card>
          <CardContent className="p-[18px] w-full h-full">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-black font-geist">
                {team.team_name}
              </p>
              <Dialog open={isopen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Trash2
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  />
                </DialogTrigger>
                <DialogContent>
                  <div className="text-center">
                    <h2 className="text-lg font-semibold">Are you sure?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Do you really want to delete this{" "}
                      <span>{team.team_name}</span>
                    </p>
                  </div>
                  <DialogFooter className="flex justify-end mt-4">
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
                      onClick={() => handleDeleteTeam(team.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="py-2">
              <label
                htmlFor="name"
                className="text-sm text-[#111928] font-medium"
              >
                Team Name
              </label>
              <Input
                id="name"
                placeholder=""
                defaultValue={team.team_name}
                className="text-gray-500 mt-1.5 py-3 px-2 bg-gray-50 border border-gray-300 rounded-md focus-visible:ring-transparent"
              />

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
                              onClick={() => handleUserSelect(user, team.id)}
                              onMouseEnter={() => setHighlightedIndex(index)}
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
                  value={emailInput}
                  autoComplete="off"
                  id="members"
                  placeholder="Add guest email"
                  className="text-gray-500 mt-1.5 h-12 px-2 bg-gray-50 border border-gray-300 rounded-md focus-visible:ring-transparent"
                  onChange={getUserData}
                />
              </div>
              {teamMemberError && (
                <p className="text-red-500 text-sm mt-1">
                  Please fill the field
                </p>
              )}

              {/* {addedMembers.length > 0 && (
                <div className="mt-2 p-2 flex flex-wrap items-center gap-2 w-full border border-gray-300 rounded-md">
                  {addedMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="flex justify-between items-center gap-2 py-1 px-2 w-full text-sm text-gray-500"
                    >
                      <div className="flex items-center gap-1">
                        <Image
                          src={Userimage}
                          alt="user image"
                          width={36}
                          height={36}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{member.username || member.name}</span>
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
                          removeMember(member, index, team.id);
                        }}
                        className="focus:outline-none space_delete_button text-gray-400"
                      >
                        <Trash2 className="text-black" size={18} />
                      </button>
                    </div>
                  ))}
                  {teamNameError && (
                    <p className="text-red-500 text-sm mt-1">
                      Please fill the field
                    </p>
                  )}
                </div>
              )} */}
              {addedMembers.length > 0 && (
  <div className="mt-2 p-2 flex flex-wrap items-center gap-2 w-full border border-gray-300 rounded-md">
    {addedMembers
      .filter((member, index, self) =>
        self.findIndex(m => m.id === member.id) === index // Filter unique IDs
      )
      .map((member, index) => (
        <div
          key={member.id}
          className="flex justify-between items-center gap-2 py-1 px-2 w-full text-sm text-gray-500"
        >
          <div className="flex items-center gap-1">
            <Image
              src={Userimage}
              alt="user image"
              width={36}
              height={36}
              className="w-6 h-6 rounded-full"
            />
            <span>{member.username || member.name}</span>
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
              removeMember(member, index, team.id);
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
            <div className=" items-end pl-[200px]  w-full">
              {/* <Button
                                type="submit"
                                variant={"outline"}
                                className="w-[120px] border border-gray-200 text-gray-800 font-medium"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button> */}

              {/* <button
                type="submit"
                className="w-[120px] h-[40px]  font-medium rounded-lg   bg-primaryColor-700 hover:bg-blue-600 text-white cursor-pointer"
                onClick={() =>
                    handleUpdateTeam(team.id, spaceId,
                     )
                  }
              >
                Save
              </button> */}
            </div>
          </CardContent>
        </Card>
      </>
    </CarouselItem>
  );
};

export default TeamCard;
