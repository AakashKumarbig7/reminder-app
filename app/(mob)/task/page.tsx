"use client";
import NavBar from "@/components/task/navBar";
import AllTask from"@/components/task/alltask";
import DropDown from "@/components/task/dropdown";
import Tasks from "@/components/task/overdue";
import Emoji from "@/components/emoji";
import {NewTask} from "@/components/newTask"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TaskPage()
{
    const route = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToTask = () => {
      route.push("/task");
    };

    if (window.innerWidth <= 992) {
      redirectToTask();
      setLoading(false);
      return;
    } else {
      route.push("/dashboard");
      setLoading(false);
    }
  }, [route]);

  if (loading) {
    return (
        <div className="loader w-full h-screen flex justify-center items-center">
        <div className="flex items-center gap-1">
          <p className="w-5 h-5 bg-black rounded-full animate-bounce"></p>
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </div>
    )
  }

    return (
        <>
        <NavBar/>
        <div className="flex flex-col bg-navbg px-[18px] min-h-screen space-y-[18px] font-geist">
        <DropDown/>
        <AllTask/>
        <Tasks/>
        <Emoji/>
        <NewTask/>
        
        </div>
        </>
    )
}