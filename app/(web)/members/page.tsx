"use client";
import { useState, useEffect, use } from "react";
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
import { supabase } from "@/utils/supabase/supabaseClient";
import { createUser1 } from "./action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getLoggedInUserData } from "@/app/(signin-setup)/sign-in/action";

interface Member {
  id: string;
  username: string;
  profile_image: string;
  designation: string;
  email: string;
  mobile: string;
  role: string;
  password: string;
}

const formSchema = z.object({
  picture: z
    .any()
    .refine(
      (file) => file?.length === 1,
      "*Supported image formats include JPEG, PNG"
    )
    .refine(
      (file) => file[0]?.type === "image/png" || file[0]?.type === "image/jpeg",
      "Must be a png or jpeg"
    )
    .refine((file) => file[0]?.size <= 5000000, "Max file size is 5MB."),
  companyName: z.string().min(2, {
    message: "Company name is not recognised. Please try again.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  mobile: z
    .string()
    .min(9, {
      message: "Please enter a valid mobile number with at least 9 digits",
    })
    .max(11, {
      message: "Please enter a valid mobile number with no more than 11 digits",
    })
    .regex(/^[0-9]+$/, {
      message: "Please enter a valid mobile number with no special characters",
    }),
});

const Members = () => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoader, setSaveLoader] = useState(false);
  const [loggedUserData, setLoggedUserData] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      picture: "",
      companyName: "",
      email: "",
      mobile: "",
    },
  });

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
    const redirectToTask = () => {
      router.push("/home");
    };

    if (window.innerWidth <= 992) {
      redirectToTask();
      setLoading(false);
      return;
    } else {
      router.push("/members");
      setLoading(false);
    }

    const getUser = async () => {
      const user = await getLoggedInUserData();

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("userId", user?.id)
        .single();

      if (error) {
        console.log(error);
        return;
      }
      console.log(data);
      setLoggedUserData(data);
    };

    getUser();
    fetchMembers(); // Load members on component mount
  }, [router]);

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

  if (loading) {
    return (
      <div className="loader w-full h-screen flex justify-center items-center">
        <div className="flex items-center gap-1">
          <p className="w-5 h-5 bg-black rounded-full animate-bounce"></p>
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </div>
    ); // Simple loader UI
  }

  return (
    <>
      <WebNavbar
       loggedUserData={loggedUserData as any}
       navbarItems={false}
       searchValue=''
       setSearchValue=''
       teamFilterValue=''
       setTeamFilterValue=''
       taskStatusFilterValue=''
       setTaskStatusFilterValue=''
       filterFn=''
        />
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
              <button onClick={() => router.push(`/access`)} className="rounded-lg text-sm border w-[89px] h-[41px] hover:bg-slate-50 text-gray-400">
                Access
              </button>
            </div>
            <Button
              className="rounded-lg text-sm text-white border flex items-center max-w-[142px] w-[142px] h-[41px] bg-primaryColor-700 space-x-2 px-5 py-[2.5px]  hover:bg-blue-600 cursor-pointer"
              onClick={() => {
                setSaveLoader(true);
                setTimeout(() => {
                  router.push("/add-member");
                  setSaveLoader(false);
                }, 1000);
              }}
              disabled={saveLoader}
            >
              {saveLoader ? (
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#fff"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="#fff"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <ClipboardPlus className="h-5 w-5" />
                  Add member
                </>
              )}
            </Button>
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
                              onClick={() => {
                                router.push(`/edit-member/${member.id}`);
                              }}
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
