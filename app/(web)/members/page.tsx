"use client";
import { useState, useEffect } from "react";
import WebNavbar from "@/app/(web)/components/navbar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, ClipboardPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

interface Member {
  id: string;
  username: string;
  profile_image: string;
  designation: string;
  email: string;
  mobile: string;
  role: string;
}

const Members = () => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [editData, setEditData] = useState({
    id: "",
    username: "",
    profile_image: "",
    designation: "",
    email: "",
    mobile: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch members from Supabase
  const fetchMembers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error fetching members:", error.message);
    } else {
      setMembers(data || []);
    }
  };

  // Add or update a member
  // const handleAddSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     let imageUrl = editData.profile_image;

  //     // Upload the image to Supabase Storage
  //     if (file) {
  //       const { data: uploadData, error: uploadError } = await supabase.storage
  //         .from("profiles")
  //         .upload(`profiles/${file.name}`, file, {
  //           cacheControl: "3600",
  //           upsert: true,
  //         });

  //       if (uploadError)
  //         throw new Error(`Image upload failed: ${uploadError.message}`);

  //       const { data: publicUrlData } = supabase.storage
  //         .from("profiles")
  //         .getPublicUrl(`profiles/${file.name}`);
  //       imageUrl = publicUrlData?.publicUrl || "";
  //     }

  //     if (editData.id) {
  //       // Update existing member
  //       const { error: updateError } = await supabase
  //         .from("users")
  //         .update({
  //           username: editData.username,
  //           profile_image: imageUrl,
  //           designation: editData.designation,
  //           email: editData.email,
  //           mobile: editData.mobile,
  //           role: editData.role,
  //         })
  //         .eq("id", editData.id);

  //       if (updateError)
  //         throw new Error(`Update failed: ${updateError.message}`);
  //     } else {
  //       // Add new member
  //       const { error: insertError } = await supabase.from("users").insert({
  //         username: editData.username,
  //         profile_image: imageUrl,
  //         designation: editData.designation,
  //         email: editData.email,
  //         mobile: editData.mobile,
  //         role: editData.role,
  //       });

  //       if (insertError)
  //         throw new Error(`Insert failed: ${insertError.message}`);
  //     }

  //     // Re-fetch members to update the list
  //     await fetchMembers();
  //   } catch (error: any) {
  //     console.error("Error during submission:", error.message);
  //   }
  // };

  const handleEditClick = (member: Member) => {
    setEditData({
      id: member.id,
      username: member.username,
      profile_image: member.profile_image,
      designation: member.designation,
      email: member.email,
      mobile: member.mobile,
      role: member.role,
    });
    setIsDialogOpen(true); // Open the dialog with pre-filled data
  };
  const handleDelete = async (memberId: string) => {
    try {
      // Delete the member from the database
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", memberId);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }

      // Remove the member from the state to update the UI
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== memberId)
      );
    } catch (error: any) {
      console.error("Error during deletion:", error.message);
    }
  };

  useEffect(() => {
    fetchMembers(); // Load members on component mount
  }, []);
  const validateMobileNumber = (mobile: string) => {
    if (mobile.length < 9) {
      return "Please enter a valid mobile number with at least 9 digits";
    }
    if (mobile.length > 11) {
      return "Please enter a valid mobile number with no more than 11 digits";
    }
    if (!/^[0-9]+$/.test(mobile)) {
      return "Please enter a valid mobile number with no special characters";
    }
    return "";
  };
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const validationError = validateMobileNumber(value);
    setEditData({ ...editData, mobile: value });
    setError(validationError);
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (
      !editData.username.trim() ||
      !editData.designation.trim() ||
      !editData.email.trim() ||
      !editData.mobile.trim() ||
      !editData.role.trim() ||
      (!file && !editData.profile_image)
    ) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    try {
      setError("");
      let imageUrl = editData.profile_image;

      if (file) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(`profiles/${file.name}`, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage
          .from("profiles")
          .getPublicUrl(`profiles/${file.name}`);
        imageUrl = publicUrlData?.publicUrl || "";
      }

      if (editData.id) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            username: editData.username,
            profile_image: imageUrl,
            designation: editData.designation,
            email: editData.email,
            mobile: editData.mobile,
            role: editData.role,
          })
          .eq("id", editData.id);

        if (updateError) throw new Error(`Update failed: ${updateError.message}`);
      } else {
        const { error: insertError } = await supabase.from("users").insert({
          username: editData.username,
          profile_image: imageUrl,
          designation: editData.designation,
          email: editData.email,
          mobile: editData.mobile,
          role: editData.role,
        });

        if (insertError) throw new Error(`Insert failed: ${insertError.message}`);
      }

      await fetchMembers();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error during submission:", error.message);
      setError("An error occurred. Please try again.");
    }
  };


  return (
    <>
      <WebNavbar />
      <div className="px-3">
        <div className="px-3 w-full h-[65px] flex bg-white rounded-[12px] border-none items-center max-w-full">
          <div className="flex justify-between w-full">
            <div className="flex space-x-[10px]">
              <button
                onClick={() => router.push(`/spaceSetting`)}
                className="rounded-lg text-sm text-gray-400 border w-[134px] hover:bg-slate-50 h-[41px]"
              >
                Space Settings
              </button>
              <button className="rounded-lg text-sm border w-[104px] h-[41px] text-white hover:bg-blue-600 hover:text-white bg-primaryColor-700">
                Members
              </button>
              <button className="rounded-lg text-sm border w-[89px] h-[41px] hover:bg-slate-50 text-gray-400">
                Access
              </button>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={() =>
                    setEditData({
                      id: "",
                      username: "",
                      profile_image: "",
                      designation: "",
                      email: "",
                      mobile: "",
                      role: "",
                    })
                  }
                  className="rounded-lg text-sm text-white border flex items-center h-[41px] bg-primaryColor-700 space-x-2 px-5 py-[2.5px]  hover:bg-blue-600 cursor-pointer"
                >
                  <ClipboardPlus className="h-5 w-5" />
                  <span className="leading-none">Add Member</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[534px] font-inter">
                <DialogHeader>
                  <DialogTitle className="text-base  text-gray-500 font-semibold font-geist">
                    {editData.id ? "Edit Member" : "Add Member"}
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="font-inter ">
                    Add a Member Details
                  </DialogDescription>
                <form onSubmit={handleAddSubmit}>
                  <Label
                    htmlFor="name"
                    className="text-gray-900 text-inter font-medium text-sm"
                  >
                    Name:
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter the name"
                    value={editData.username}
                    onChange={(e) =>
                      setEditData({ ...editData, username: e.target.value })
                    }
                    className="mt-1"
                  />
                  <br></br>
                  <Label
                    htmlFor="designation"
                    className="text-gray-900 text-inter font-medium text-sm"
                  >
                    Designation:
                  </Label>
                  <Input
                    id="designation"
                    type="text"
                    placeholder="Enter the designation"
                    value={editData.designation}
                    onChange={(e) =>
                      setEditData({ ...editData, designation: e.target.value })
                    }
                    className="mt-1"
                  />
                  <br></br>
                  <Label
                    htmlFor="email"
                    className="text-gray-900 text-inter font-medium text-sm"
                  >
                    Email:
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter the email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    className="mt-1"
                  />
                  <br></br>
                  <Label
                    htmlFor="number"
                    className="text-gray-900 text-inter font-medium text-sm"
                  >
                    Mobile:
                  </Label>
                  <Input
                    id="number"
                    type="tel"
                    placeholder="+61 0000 0000"
                  
                    value={editData.mobile}
                    onChange={handleMobileChange}
                  className="mt-1"
                  />
                   {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                  <br></br>
                  <Label
                    htmlFor="role"
                    className="text-gray-900 text-inter font-medium text-sm"
                  >
                    Role:
                  </Label>
                  <Input
                    id="role"
                    type="text"
                    placeholder="Enter the role"
                    value={editData.role}
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                    className="mt-1"
                  />
                  <br></br>
                  <Label
                    htmlFor="file"
                    className="text-gray-900 text-inter font-medium text-sm"
                  >
                    Profile Image:
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="mt-1"
                  />
                  <div className="flex justify-between">
                    <Button
                      className="text-sm mt-4 text-gray-700 h-[41px] w-[126px] bg-gray-100 rounded-md hover:bg-gray-200"
                      onClick={() => {
                        // Reset form state
                        setEditData({
                          id: "",
                          username: "",
                          profile_image: "",
                          designation: "",
                          email: "",
                          mobile: "",
                          role: "",
                        });
                        setFile(null);
                        setIsDialogOpen(false); // Close the dialog
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="mt-4 text-white text-sm hover:bg-blue-600 hover:text-white bg-primaryColor-700 h-[41px] w-[126px]"
                    >
                      {editData.id ? "Update Member" : "Add Member"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="pt-[18px] rounded-lg">
          <Table className="border-b border-gray-200 bg-white rounded-[12px]">
            <TableHeader className="bg-gray-50 rounded-[12px]">
              <TableRow>
                <TableHead className="px-4 py-4 text-sm">NAME</TableHead>
                <TableHead className="px-4 py-4 text-sm">DESIGNATION</TableHead>
                <TableHead className="px-4 py-4 text-sm">EMAIL</TableHead>
                <TableHead className="px-4 py-4 text-sm">MOBILE</TableHead>
                <TableHead className="px-4 py-4 text-sm">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="px-4 py-4 text-sm font-semibold text-gray-900">
                    {/* Display Profile Image and Name */}
                    <div className="flex items-center space-x-3">
                      {member.profile_image && (
                        <img
                          src={member.profile_image}
                          alt={`${member.username}'s profile`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span>{member.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-900">
                    {member.designation}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-900">
                    {member.email}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-900">
                    {member.mobile}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="p-2 rounded hover:bg-gray-100"
                              onClick={() => handleEditClick(member)}
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Dialog
                                open={isDeleteDialogOpen}
                                onOpenChange={setIsDeleteDialogOpen}
                              >
                                <DialogTrigger>
                                  <button
                                    className="p-2 rounded hover:bg-gray-100"
                                    onClick={() => {
                                      setMemberToDelete(member.id);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </DialogTrigger>
                                <DialogContent>
                                  <div className="text-center">
                                    <h2 className="text-lg font-semibold">
                                      Are you sure?
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-600">
                                      Do you really want to delete this space
                                    </p>
                                  </div>
                                  <DialogFooter>
                                    <div className="flex justify-end mt-4 space-x-3">
                                      <Button
                                        className="text-white bg-gray-400 hover:bg-gray-500"
                                        onClick={() =>
                                          setIsDeleteDialogOpen(false)
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        className="text-white bg-red-500 hover:bg-red-600"
                                        onClick={() => {
                                          setIsDeleteDialogOpen(false);
                                          if (memberToDelete) {
                                            handleDelete(memberToDelete);
                                          }
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this member?</DialogTitle>
            </DialogHeader>
           
            <div className="flex space-x-3">
              <Button
                className="text-white bg-red-500 hover:bg-red-600"
                onClick={() => handleDelete(members.id)}
              >
                Delete
              </Button>
              <Button
                className="text-white bg-gray-400 hover:bg-gray-500"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog> */}
    </>
  );
};

export default Members;
