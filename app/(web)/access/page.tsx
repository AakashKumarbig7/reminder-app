"use client";
import { useEffect, useState } from "react";
import WebNavbar from "../components/navbar";
import { useRouter } from "next/navigation";
import { getLoggedInUserData } from "@/app/(signin-setup)/sign-in/action";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import "./style.css";

const AccessPage = () => {
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [loggedUserData, setLoggedUserData] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [employeesData, setEmployeesData] = useState<any>([]);
  const [saveLoader, setSaveLoader] = useState(false);
  const [cancelLoader, setCancelLoader] = useState(false);

  const getEmployeesData = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }
    setEmployeesData(
      data.map((emp) => ({
        ...emp,
        access: emp.access || {
          space: false,
          team: false,
          task: false,
          all: false,
        },
      }))
    );
    return data;
  };

  const handleCheckboxChange = (employeeId: number, accessKey: string) => {
    setEmployeesData((prev: any) =>
      prev.map((emp: any) =>
        emp.id === employeeId
          ? {
              ...emp,
              access: { ...emp.access, [accessKey]: !emp.access[accessKey] },
            }
          : emp
      )
    );
  };

  const handleUpdate = async () => {
    setSaveLoader(true);
    try {
      const updates = employeesData.map((emp: any) => ({
        id: emp.id,
        access: emp.access,
      }));

      const { error } = await supabase.from("users").upsert(updates);

      if (error) {
        console.error("Error updating access:", error);
        setSaveLoader(false);
        return;
      }
      setSaveLoader(false);
      toast({
        title: "Access Updated Successfully!",
        description: "Access has been updated successfully.",
      });
    } catch (err) {
      console.error("Error during update:", err);
      setSaveLoader(false);
    }
  };

  const filteredEmployees = employeesData.filter((employee: any) =>
    employee.username.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const redirectToTask = () => {
      route.push("/home");
    };

    if (window.innerWidth <= 992) {
      redirectToTask();
      setLoading(false);
      return;
    } else {
      route.push("/access");
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
      // localStorage.setItem("user", data);
      setLoggedUserData(data);
    };

    getEmployeesData();
    getUser();
  }, [route]);

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
      <Toaster />
      <WebNavbar
        loggedUserData={loggedUserData as any}
        navbarItems={false}
        searchValue=""
        setSearchValue=""
        teamFilterValue=""
        setTeamFilterValue=""
        taskStatusFilterValue=""
        setTaskStatusFilterValue=""
        filterFn=""
      />

      <div className="px-3">
        <div className="px-3 w-full h-[65px] flex bg-white rounded-[12px] border-none items-center max-w-full">
          <div className="flex justify-between w-full">
            <div className="flex space-x-[10px]">
              <button
                onClick={() => route.push(`/spaceSetting`)}
                className="rounded-lg text-sm text-gray-400 border w-[134px] hover:bg-slate-50 h-[41px]"
              >
                Space Settings
              </button>
              <button
                onClick={() => route.push(`/members`)}
                className="rounded-lg text-sm text-gray-400 border w-[134px] hover:bg-slate-50 h-[41px]"
              >
                Members
              </button>
              <button className="rounded-lg text-sm border w-[89px] h-[41px] hover:bg-blue-600 bg-primaryColor-700 text-white">
                Access
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5">
          <div className="relative">
            <Search
              size={14}
              className="absolute top-3.5 left-2.5 text-gray-500"
            />
            <Input
              placeholder="Search"
              value={searchValue}
              className="w-[384px] h-[42px] pl-8 pr-7 bg-white shadow-none font-medium justify-start gap-3 rounded-[10px] flex items-center"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <X
              size={14}
              className="absolute top-3.5 right-2.5 cursor-pointer text-gray-500"
              onClick={() => setSearchValue("")}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCancelLoader(true);
                setTimeout(() => {
                  route.push("/dashboard");
                  setCancelLoader(false);
                }, 2000);
              }}
              disabled={cancelLoader}
              className="w-[90px] h-10 border border-gray-300 rounded-md hover:bg-gray-200 text-sm text-center"
            >
              {cancelLoader ? (
                <svg
                  className="animate-spin h-5 w-5 m-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#1A56DB"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-100"
                    fill="#1A56DB"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Cancel"
              )}
            </button>
            <Button
              onClick={handleUpdate}
              disabled={saveLoader}
              className="bg-primaryColor-700 hover:bg-primaryColor-700 text-white hover:text-white w-[90px] h-10"
            >
              {saveLoader ? (
                <svg
                  className="animate-spin h-5 w-5"
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
                    className="opacity-100"
                    fill="#fff"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>

        <Table className="block w-[98vw] max-h-[500px] overflow-y-auto playlist-scroll bg-white rounded-[10px] my-5 font-inter">
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead className="text-left w-[18%] pl-4 text-sm font-semibold text-gray-500 py-5">
                NAME
              </TableHead>
              <TableHead className="text-left w-[20%] text-sm font-semibold text-gray-500 py-5">
                DESIGNATION
              </TableHead>
              <TableHead className="text-center w-[20%] text-sm font-semibold text-gray-500 py-5">
                SPACE CRUD
              </TableHead>
              <TableHead className="text-center w-[20%] text-sm font-semibold text-gray-500 py-5">
                TEAM CRUD
              </TableHead>
              <TableHead className="text-center w-[20%] text-sm font-semibold text-gray-500 py-5">
                TASK CRUD
              </TableHead>
              <TableHead className="text-center w-[20%] pr-4 text-sm font-semibold text-gray-500 py-5">
                ALL
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee: any) => (
                <TableRow key={employee.id}>
                  <TableCell className="pl-4 text-sm font-semibold text-gray-900 capitalize py-4">
                    {employee.username}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {employee.designation || "N/A"}
                  </TableCell>
                  {["space", "team", "task", "all"].map((accessKey) => (
                    <TableCell key={accessKey} className="text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={employee.access[accessKey]}
                        onChange={() =>
                          handleCheckboxChange(employee.id, accessKey)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 text-base py-4">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AccessPage;
