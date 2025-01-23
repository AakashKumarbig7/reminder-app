"use client";
import { OverdueSkeleton } from "@/app/(web)/components/skeleton-ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGlobalContext } from "@/context/store";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";

export default function OverDue() {
  const { userId } = useGlobalContext();

  const [overdueTasks, setOverdueTasks] = useState<any>([]);
  const [adminOverdueTasks, setAdminOverdueTasks] = useState<any>([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [teamName, setTeamName] = useState<any>([]);

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
          .in("id", overdue.map((task: any) => task.team_id))
          ;

        if (teamError) {
          console.error(teamError);
          setTaskLoading(false);
          return;
        }

        if (teamData) {
          setTeamName(teamData);
          console.log(teamData, " teamData");
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

  return (
    <div className="px-[18px] font-geist">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold text-black">
          Overdue Tasks
        </h4>
        <p className="text-teal-500 font-medium text-sm cursor-pointer">
          View all
        </p>
      </div>

      {taskLoading ? (
        <OverdueSkeleton />
      ) : overdueTasks.length > 0 || adminOverdueTasks.length > 0 ? (
        <Carousel opts={{ align: "start" }} className="w-full max-w-sm">
          <CarouselContent>
            {(userId?.role === "owner" ? adminOverdueTasks : overdueTasks).map(
              (task: any, index: number) => (
                <CarouselItem
                  key={task.id || index}
                  className="basis-[62%] md:basis-1/2 lg:basis-1/3 flex-none pl-2"
                >
                  <div className="p-1 w-[260px]">
                    <Card>
                      <CardContent className="aspect-square p-3 w-full flex flex-col justify-between h-[156px]">
                        <div className="w-full">
                          <div className="flex justify-between items-center">
                            {teamName.map((team: any) => {
                              if (team.id === task.team_id) {
                                return (
                                  <p
                                    className="text-[#737373] bg-[#F4F4F8] text-sm font-semibold px-3 py-0.5 rounded-full"
                                    key={team.id}
                                  >
                                    {team.team_name.length > 15 ? team.team_name.slice(0, 15) + "..." : team.team_name}
                                  </p>
                                );
                              }
                            })}
                            <p className="text-[12px] text-[#A6A6A7] font-medium">{task.time}</p>
                          </div>
                          <p className="text-black mt-2 text-sm">
                            <p className="font-semibold">{task.mentions}</p>{" "}
                            {task.task_content.length > 60
                              ? task.task_content.slice(0, 60) + "..."
                              : task.task_content}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-red-500 font-bold text-[12px]">
                            {new Date(task.due_date).toLocaleDateString(
                              "en-US",
                              {
                                // weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
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
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
        </Carousel>
      ) : (
        <p className="text-center text-base pt-8">
          No Overdue Tasks
        </p>
      )}
    </div>
  );
}
