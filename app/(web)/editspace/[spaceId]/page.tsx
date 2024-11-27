"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import WebNavbar from "@/app/(web)/components/navbar";
import { Trash2, CirclePlus, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import toast, { Toaster } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import AddTeam from "@/app/(web)/components/addteam";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogTrigger, } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Ensure this exists in your project
import TeamCard from "../../components/teamCard";

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

export default function EditSpace({ params }: { params: { spaceId: any } }) {
  // States
  const [spaceNames, setSpaceNames] = useState<string[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>(
    undefined
  );
  // Team-related states
  const [teams, setTeams] = useState<any[]>([]);
  // const [memberAddDialogOpen, setMemberAddDialogOpen] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [matchingUsers, setMatchingUsers] = useState<any[]>([]);
  const [noUserFound, setNoUserFound] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [addedMembers, setAddedMembers] = useState<any[]>([]);
  const [teamMemberError, setTeamMemberError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const { spaceId } = params;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Supabase delete logic
      const { error } = await supabase
        .from("spaces")
        .delete()
        .eq("id", spaceId); // Assuming the primary key column is 'id'

      if (error) throw new Error(error.message);

      // Close the dialog and redirect
      setIsOpen(false);
      router.push("/spaceSetting"); // Update to your actual spaces settings route
    } catch (error: any) {
      console.error("Failed to delete space:", error.message);
    } finally {
      setIsDeleting(false);
    }
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
      }));
      setTeams(teamData as Team[]);
    }
  };

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

  // Fetch space ID by name
  const fetchSpaceIdByName = async (
    spaceName: string
  ): Promise<number | null> => {
    const { data, error } = await supabase
      .from("spaces")
      .select("id")
      .eq("space_name", spaceName)
      .single();

    if (error) {
      console.error("Error fetching space ID:", error);
      return null;
    }
    return data?.id ?? null;
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

  const handleUserSelect = (user: Tab) => {
    setTeamMemberError(false);
    console.log(user, " selected user");
    setAddedMembers((prevMembers) => [...prevMembers, user]);
    console.log("Added members:", addedMembers);
    setEmailInput("");
    setHighlightedIndex(-1);
  };

  const removeMember = (member: any, index: number) => {
    const updatedMembers = [...addedMembers];
    updatedMembers.splice(index, 1);
    setAddedMembers(updatedMembers);
  };

  const handleSaveMembers = async () => {
    // Validate team name
    if (teamName === "") {
      setTeamNameError(true);
      return;
    }

    // Validate added members
    if (addedMembers.length === 0) {
      setTeamMemberError(true);
      return;
    }

    try {
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

      // Insert team data into `teams` table
      const { error: insertError } = await supabase.from("teams").insert({
        team_name: teamName,
        members: fetchedMembers.map((member) => ({
          id: member.id,
          name: member.username, // Ensure your `users` table has this column
          role: member.role,
          department: member.department,
          designation: member.designation,
          email: member.email, // Ensure `email` exists in your table
        })),
        space_id: spaceId, // Assuming `spaceId` is correctly defined in your context
      });

      if (insertError) {
        console.error("Error saving members:", insertError);
        return;
      }

      // Reset states on successful save
      setTeamName("");
      setAddedMembers([]);
      setTeamNameError(false);
      setTeamMemberError(false);

      notify("Members saved successfully", true);
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
      handleUserSelect(matchingUsers[highlightedIndex]);

    }
  };

  useEffect(() => {
    const fetchSelectedSpace = async () => {
      if (!spaceId) return;
      {
        const { data, error } = await supabase
          .from("spaces")
          .select("space_name")
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

  return (
    <>
      <WebNavbar />
      <Toaster />
      <div className="px-3 h-full   space-y-[18px]">
        <div className="bg-white w-full h-[65px] rounded-[12px] flex items-center shadow-md">
          <p className="text-center text-lg font-semibold pl-2">
            Space Setting
          </p>
          <div className="flex ml-auto space-x-[18px] pr-[14px]">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              {/* Trigger for opening the dialog */}
              <DialogTrigger asChild>
                <button
                  className="border border-gray-200 w-[41px] h-[41px] flex items-center justify-center rounded-[8px] cursor-pointer hover:bg-slate-50"
                  onClick={() => setIsOpen(true)}
                >
                  <Trash2 className="h-6 w-6" />
                </button>
              </DialogTrigger>

              {/* Dialog content */}
              <DialogContent>
                <div className="text-center">
                  <h2 className="text-lg font-semibold">Are you sure?</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Do you really want to delete this space? This action cannot
                    be undone.
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
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              className="text-gray-400 border border-gray-200 rounded-[8px] text-sm w-[87px] h-[41px] cursor-pointer hover:bg-slate-50"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              className="rounded-lg text-sm text-white w-[134px] h-[41px] bg-primaryColor-700 cursor-pointer hover:bg-blue-600"
              onClick={() => console.log(`Save changes for space ${spaceId}`)}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white h-full w-full shadow-md">
          <div className="px-3">
            <div className="w-full pt-[12px] items-center">
              <Label htmlFor="space-name">Select Space</Label>
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
            <Carousel
              opts={{ align: "start" }}
              className="w-full max-w-full ">
              <CarouselContent className="flex  ">
                <CarouselItem className="basis-[28%] ">
                  <Card className="border border-gray-300 w-[339px] h-[65px] rounded-[12px] items-center">
                    <CardContent className="px-3 py-3">
                      <AddTeam spaceId={spaceId as number} />
                    </CardContent>
                  </Card>
                </CarouselItem>

                {teams.length > 0 ? (
                  teams.map((team: any) => (
                    <TeamCard team={team} spaceId={spaceId} />
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
}
