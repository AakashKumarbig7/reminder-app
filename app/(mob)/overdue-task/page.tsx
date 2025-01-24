"use client";
import { useGlobalContext } from "@/context/store";
import Image from "next/image";
import profile from "@/public/images/img-placeholder.svg";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { OverdueListSkeleton } from "@/app/(web)/components/skeleton-ui";
import "./style.css";
import { useRouter } from "next/navigation";

const OverdueTaskPage = () => {
  const { userId } = useGlobalContext();
  const route = useRouter();
  const [overdueTasks, setOverdueTasks] = useState<any>([]);
  const [adminOverdueTasks, setAdminOverdueTasks] = useState<any>([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [teamName, setTeamName] = useState<any>([]);
  const [spaceName, setSpaceName] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const fetchTaskData = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_deleted", false);

      if (error) {
        console.error(error);
        setTaskLoading(false);
        return;
      }

      if (data) {
        const filteredTasks = data.filter((task) =>
          task?.mentions?.includes(`@${userId?.entity_name}`)
        );

        const now = new Date().getTime();
        const overdue = filteredTasks.filter(
          (task) => new Date(task.due_date).getTime() < now
        );
        const adminOverdue = data.filter(
          (task) => new Date(task.due_date).getTime() < now
        );

        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("is_deleted", false)
          .in(
            "id",
            overdue.map((task: any) => task.team_id)
          );
        if (teamError) {
          console.error(teamError);
          setTaskLoading(false);
          return;
        }

        if (teamData) {
          setTeamName(teamData);
        }

        const { data: spaceName, error: spaceError } = await supabase
          .from("spaces")
          .select("*")
          .eq("is_deleted", false)
          .in(
            "id",
            overdue.map((task: any) => task.space_id)
          );
        if (spaceError) {
          console.error(spaceError);
          setTaskLoading(false);
          return;
        }
        if (spaceName) {
          setSpaceName(spaceName);
        }

        setOverdueTasks(overdue);
        setAdminOverdueTasks(adminOverdue);
        setTaskLoading(false);
      }
    } catch (err) {
      console.error("Error fetching task data:", err);
      setTaskLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskData();

    if (overdueTasks.length > 0 || adminOverdueTasks.length > 0) {
      setTimeout(() => {
        setTaskLoading(false);
      }, 1000);
    }
  }, [userId]);

  useEffect(() => {
    const redirectToTask = () => {
      route.push("/overdue-task");
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
      <div className="w-full h-screen flex justify-center items-center">
        <div id="wifi-loader">
          <svg className="circle-outer" viewBox="0 0 86 86">
            <circle className="back" cx="43" cy="43" r="40"></circle>
            <circle className="front" cx="43" cy="43" r="40"></circle>
            <circle className="new" cx="43" cy="43" r="40"></circle>
          </svg>
          <svg className="circle-middle" viewBox="0 0 60 60">
            <circle className="back" cx="30" cy="30" r="27"></circle>
            <circle className="front" cx="30" cy="30" r="27"></circle>
          </svg>
          <svg className="circle-inner" viewBox="0 0 34 34">
            <circle className="back" cx="17" cy="17" r="14"></circle>
            <circle className="front" cx="17" cy="17" r="14"></circle>
          </svg>
          <div className="text" data-text="Loading"></div>
        </div>
      </div>
    ); // Simple loader UI
  }

  return (
    <main className="p-[18px]">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Overdue Task</h1>
        <Image
          src={userId?.profile_image || profile}
          width={44}
          height={44}
          alt="User Image"
          className="rounded-full border border-[#D6D6D6]"
        />
      </div>

      <div className="w-full h-[calc(100vh-110px)] overflow-y-scroll playlist-scroll">
        {taskLoading ? (
          <OverdueListSkeleton />
        ) : adminOverdueTasks.length === 0 || overdueTasks.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-[#A6A6A7] text-lg font-medium">
              No Overdue Task
            </p>
          </div>
        ) : (
          (userId?.role === "owner" ? adminOverdueTasks : overdueTasks).map(
            (task: any, index: number) => (
              <div
                key={index}
                className="p-3 w-full bg-white border border-[#E1E1E1] mb-3 rounded-[10px]"
              >
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="flex justify-start items-center gap-2">
                      {teamName.map((team: any) => {
                        if (team.id === task.team_id) {
                          return (
                            <p
                              className="text-[#737373] bg-[#F4F4F8] text-sm font-semibold px-2 py-0.5 rounded-full"
                              key={team.id}
                            >
                              {team.team_name.length > 10
                                ? team.team_name.slice(0, 10) + "..."
                                : team.team_name}
                            </p>
                          );
                        }
                      })}
                      {spaceName.map((space: any) => {
                        if (space.id === task.space_id) {
                          return (
                            <p
                              className="text-[#737373] bg-[#F4F4F8] text-sm font-semibold px-2 py-0.5 rounded-full"
                              key={space.id}
                            >
                              {space.space_name.length > 10
                                ? space.space_name.slice(0, 10) + "..."
                                : space.space_name}
                            </p>
                          );
                        }
                      })}
                    </div>
                    <p className="text-[12px] text-[#A6A6A7] font-medium">
                      {task.time}
                    </p>
                  </div>
                  <p className="text-black mt-2 text-sm">
                    <p className="font-semibold inline-block">
                      {task.mentions}
                    </p>{" "}
                    {task.task_content}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-red-500 font-bold text-[12px]">
                    {new Date(task.due_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    className={`rounded-3xl text-sm font-semibold py-1.5 px-2 ${
                      task.task_status === "todo"
                        ? "text-reddish bg-[#F8DADA]"
                        : task.task_status === "In progress"
                        ? "text-[#EEA15A] bg-[#F8F0DA]"
                        : task.task_status === "feedback"
                        ? "text-[#142D57] bg-[#DEE9FC]"
                        : "text-[#3FAD51] bg-[#E5F8DA]"
                    }`}
                  >
                    {task.task_status}
                  </span>
                </div>
              </div>
            )
          )
        )}
      </div>
    </main>
  );
};

export default OverdueTaskPage;
