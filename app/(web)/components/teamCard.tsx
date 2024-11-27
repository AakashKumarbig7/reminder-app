"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

interface Tab {
    id: number;
    space_name: string;
    email: string;
    username: string;
    designation: string;
    role: string;
    department: string;
}

const TeamCard: React.FC<{ team: any, spaceId: any }> = ({ team, spaceId }) => {
    const [teamName, setTeamName] = useState(team.team_name);
    const [teamNameError, setTeamNameError] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [matchingUsers, setMatchingUsers] = useState<any[]>([]);
    const [noUserFound, setNoUserFound] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [addedMembers, setAddedMembers] = useState<any[]>(team.members ?? []);
    const [teamMemberError, setTeamMemberError] = useState(false);

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


    const handleDeleteTeam = async (teamId: number) => {
        try {
            const { error } = await supabase.from("teams").delete().eq("id", teamId);
            if (error) {
                console.error("Error deleting team:", error);
                return;
            }
            // setTeamNameDialogOpen(false);
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    const handleClose = () => {
        // setMemberAddDialogOpen(false);
        setTeamName("");
        setAddedMembers([]);
        setTeamNameError(false);
        setTeamMemberError(false);
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
                            <Trash2
                                size={20}
                                className="cursor-pointer"
                                onClick={() => handleDeleteTeam(team.id)}
                            />
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
                                                            className={`p-2 cursor-pointer ${index === highlightedIndex
                                                                ? "bg-gray-200"
                                                                : "hover:bg-gray-100"
                                                                }`}
                                                            onClick={() =>
                                                                handleUserSelect(user)
                                                            }
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

                            {addedMembers.length > 0 && (
                                <div className="mt-2 p-2 flex flex-wrap items-center gap-2 w-full border border-gray-300 rounded-md">
                                    {addedMembers.map((member, index) => (
                                        <div
                                            key={member.id}
                                            className="flex justify-between items-center gap-2 py-1 px-2 w-full text-sm text-gray-500"
                                        >
                                            <div className="flex items-center gap-1">

                                                <span>
                                                    {member.username || member.name}
                                                </span>
                                            </div>
                                            <span
                                                className={`${member.role === "superadmin"
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
                        <div className="flex items-center justify-between w-full">
                            <Button
                                type="submit"
                                variant={"outline"}
                                className="w-[120px] border border-gray-200 text-gray-800 font-medium"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="w-[120px] bg-primaryColor-700 hover:bg-blue-600 text-white"
                                onClick={handleSaveMembers}
                            >
                                Save
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </>
        </CarouselItem>
    );
};

export default TeamCard;
