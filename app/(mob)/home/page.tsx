"use client";
import SearchBar from "@/components/searchBar";
import NavBar from "@/components/navBar";
import { NewTask } from "@/components/newTask";
import OverDue from "@/components/overDue";
import TaskStatus from "@/components/taskStatus";
import Spaces from "@/components/spaces";
import Teams from "@/components/teams";
import Emoji from "@/components/emoji";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// interface Mention {
//   id: number;
//   name: string;
// }

export default function HomePage() {
  const route = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToTask = () => {
      route.push("/home");
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
      <NavBar />
      <div className="flex flex-col bg-[#f4f4f8] px-[18px] pb-[100px] space-y-[18px]">
        <SearchBar />
        <NewTask />
        <TaskStatus />
        <OverDue />
        <Spaces />
        <Teams />
        <Emoji />
      </div>
    </>
  );
}
