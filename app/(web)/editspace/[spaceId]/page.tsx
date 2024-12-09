"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WebNavbar from "@/app/(web)/components/navbar";
import { Trash2, CirclePlus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
interface Tab {
  id: number;
  space_name: string;
  email: string;
  username: string;
  designation: string;
  role: string;
  department: string;
}
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


export default function EditSpace({ params }: { params: { spaceId: string } }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [spaceNames, setSpaceNames] = useState<string[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>(undefined);
  const [teamName, setTeamName] = useState<string>("");
  const [memberAddDialogOpen, setMemberAddDialogOpen] = useState(false);
  const [teamNameError, setTeamNameError] = useState(false);
  const [teamMemberError, setTeamMemberError] = useState(false);
  const [noUserFound, setNoUserFound] = useState<boolean>(false);
  const [addedMembers, setAddedMembers] = useState<Tab[]>([]);
  const [matchingUsers, setMatchingUsers] = useState<Tab[]>([]);
  const [emailInput, setEmailInput] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [space1Id, setSpaceId] = useState<number | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  
  const router = useRouter();
  const { spaceId } = params;

  // Fetch all spaces from Supabase
  const fetchSpace = async () => {
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .order("space_name", { ascending: true });

    if (error) {
      console.error("Error fetching spaces:", error);
      return;
    }
    setSpaceNames(data.map((space: any) => space.space_name));
  };

  const fetchSpaces = async () => {
    const { data, error } = await supabase.from("spaces")
    .select("*")
    .order("space_name", { ascending: true })
    ;

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
  const handleTabClick = async (id: number) => {
    const {data, error} = await supabase.from("spaces")
    .select("*")
    .eq("id", id)
    .single();

    if (error) {
      console.error("Error fetching space:", error);
      return;
    }

    if (data) {
      console.log(data, " space data");
      setSpaceId(data.id);
    }
    setActiveTab(id);
    setIsEditing(null);
  };


  const handleTabDoubleClick = (id: number) => {
    setIsEditing(id);
  };

  // Fetch selected space and its associated teams based on spaceId
  const fetchSpaceDetails = async () => {
    try {
      const { data: spaceData, error: spaceError } = await supabase
        .from("spaces")
        .select("*")
        .eq("id", spaceId)
        .single(); // Fetch a single space by its ID

      if (spaceError || !spaceData) {
        console.error("Error fetching space:", spaceError);
        return;
      }
      setSelectedSpace(spaceData.space_name);

      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("id, team_name, members")
        .eq("space_id", spaceId) // Fetch teams related to this space
        .order("team_name", { ascending: true });

      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        return;
      }
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching space details:", error);
    }
  };
  const handleUserSelect = (user: Tab) => {
    setTeamMemberError(false);
    console.log(user, " selected user");
    setAddedMembers((prevMembers) => [...prevMembers, user]);
    console.log("Added members:", addedMembers);
    setEmailInput("");
    setHighlightedIndex(-1);
  };
  const handleClose = () => {
    setMemberAddDialogOpen(false);
    setTeamName("");
    setAddedMembers([]);
    setTeamNameError(false);
    setTeamMemberError(false);
  };
  const defaultSpaceData = async () => {
    const { data, error } = await supabase.from("spaces").select("*").eq("id", activeTab).single();

    if (error) {
      console.error("Error fetching spaces:", error);
      return;
    }

    if (data) {
      console.log(data, " space data");
      setSpaceId(data.id);
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
      // const { data: existingTeam, error: checkError } = await supabase
      //   .from("teams")
      //   .select("*")
      //   .eq("team_name", teamName);

      // if (checkError) {
      //   console.error("Error checking existing team:", checkError);
      //   return;
      // }

      // if (existingTeam && existingTeam.length > 0) {
      //   console.log("Team already exists with these members:", existingTeam);
      //   notify("Team already exists with these members", false);
      //   return;
      // }

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
            })),
            space_id: activeTab,
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
        defaultSpaceData();
        notify("Members saved successfully", true);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }
  };
  const getUserData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
    console.log("Email input:", emailInput);

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
        console.log("Matching users:", matchingUsers);
        setMatchingUsers(matchingUsers);
        setNoUserFound(false);
      } else {
        console.log("No users found matching this email input.");
        setNoUserFound(true);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };


  const removeMember = (user: Tab, index: number) => {
    setAddedMembers((prevMembers) =>
      prevMembers.filter(
        (member: any, i: number) => !(member.id === user.id && i === index)
      )
    );
  };
  useEffect(() => {
    fetchSpaces(); // Get all spaces (for the dropdown)
    fetchSpaceDetails(); // Get the details for the selected space
  }, [spaceId]); // Fetch space details when spaceId changes

  return (
    <>
      <WebNavbar />
      <div className="px-3 space-y-[18px]">
        <div className="bg-white w-full h-[65px] rounded-[12px] flex items-center shadow-md">
          <p className="text-center text-lg font-semibold pl-2">Space Setting</p>
          <div className="flex ml-auto space-x-[18px] pr-4">
            <button
              className="border border-gray-200 w-[41px] h-[41px] flex items-center justify-center rounded-[8px]"
              onClick={() => console.log(`Delete space ${spaceId}`)}
            >
              <Trash2 />
            </button>
            <button
              className="text-gray-400 border border-gray-200 rounded-[8px] text-sm w-[87px] h-[41px]"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              className="rounded-lg text-sm text-white w-[134px] h-[41px] bg-primaryColor-700"
              onClick={() => console.log(`Save changes for space ${spaceId}`)}
            >
              Save Changes
            </button>
            <div className="flex gap-2 py-2.5 text-sm text-gray-400 pl-20">
          <Dialog
            open={memberAddDialogOpen}
            onOpenChange={setMemberAddDialogOpen}
          >
            <DialogTrigger asChild>
              <button className="bg-white rounded border-dashed border border-gray-300 px-2 py-0.5 flex items-center gap-2">
                <span className="text-gray-600">
                  <CirclePlus size={16} />
                </span>{" "}
                Add Team
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[534px] font-inter">
              <DialogHeader className="text-gray-500 text-base font-semibold">
                <DialogTitle className="text-base">TEAM SETTING</DialogTitle>
              </DialogHeader>
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
                          {/* <Image
                            src="/public/images/Subtract.png"
                            alt="user image"
                            width={36}
                            height={36}
                            className="w-6 h-6 rounded-full"
                          /> */}
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
              <DialogFooter className="flex items-center w-full">
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
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
          </div>
        </div>

        <div className="rounded-lg bg-white pt-[18px] h-full w-full shadow-md">
          <div className="px-3 flex space-x-60">
            <div className="w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="admin">Admin</Label>
              <Select>
                <SelectTrigger className="w-[610px] text-gray-500 border-gray-300 bg-gray-50">
                  <SelectValue placeholder="Select Admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Laxman Sarav</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="space-name">Select Space</Label>
              <Select onValueChange={(value) => setSelectedSpace(value)} value={selectedSpace}>
                <SelectTrigger className="w-[610px] text-gray-500 border-gray-300 bg-gray-50">
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

          {/* {teams.length > 0 && (
            <div className="mt-4">
              
              <div className="space-y-4 mt-2">
                {teams.map((team) => (
                  <div key={team.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold">{team.team_name}</h4>
                    <p>Members:</p>
                    <ul>
                      {team.members && Array.isArray(team.members) ? (
                        team.members.map((member: any, index: number) => (
                          <li key={index}>
                            {member.name} - {member.role} ({member.department}, {member.designation})
                          </li>
                        ))
                      ) : (
                        <li>No members available</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
