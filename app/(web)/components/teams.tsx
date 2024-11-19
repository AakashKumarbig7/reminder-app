"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import WebMentionInput from "./webMentions";
import { Carousel1, CarouselContent1, CarouselItem1 } from "./webCarousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  spaceId: number;
}

interface Team {
  id: number;
  team_name: string;
  tasks: { inputValue: string }[];
}

const SpaceTeam: React.FC<SearchBarProps> = ({ spaceId }) => {
  const styledInputRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [text, setText] = useState<string>("");
  const [taskErrorMessage, setTaskErrorMessage] = useState(false);
  const [taskStatus, setTaskStatus] = useState<string>("In Progress");
  const [createTask, setCreateTask] = useState(true);
  const [taskStatusShow, setTaskStatusShow] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [allTasks, setAllTasks] = useState<any>([]);

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
        tasks: [], // Initialize each team with an empty tasks array
      }));
      setTeams(teamData as Team[]);
    }
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };

    return date.toLocaleDateString("en-GB", options); // 'en-GB' gives the format "23 Aug 2024"
  };

  const handleCreateTask = async (id: any, taskId: any) => {
    console.log(id, "id");
    console.log(taskId, "taskId");
    const mentions = text.match(/@\w+/g) || []; // Find all mentions
    const content = text.replace(/@\w+/g, "").trim();
    console.log(content.length, "content");
    console.log(typeof content, " content type");

    console.log(text, "text");

    console.log(taskId === id, "taskId === id");

    // Check if both content and mentions are non-empty
    if (content.length > 0 && mentions.length > 0) {
      setTaskErrorMessage(false);
      console.log(mentions + " " + content, "text");

      // const { data, error } = await supabase.from("tasks").update({
      //   task_content: content,
      //   mentions: mentions,
      //   status: taskStatus,
      //   team_id: id,
      // });

      // if (error) throw error;

      // console.log(data, " added task");

      const styledInput = styledInputRef.current;
      if (!styledInput?.innerText.trim()) {
        // setTaskError(true);
        return;
      }

      console.log("Task:", styledInput.innerText);
      styledInput.innerText = ""; // Clear the content
      setText(""); // Clear the text state
      setCreateTask(false);
      setTaskStatusShow(true);
    } else {
      setTaskErrorMessage(true);
      // setCreateTask(true);
      console.log("Please enter both content and mentions.");
    }
  };

  const handleAddTask = async (teamId: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              tasks: [
                { inputValue: "" }, // Add the new task at the beginning
                ...team.tasks,
              ],
            }
          : team
      )
    );
    // console.log(teams.map((team) => team.tasks));
    // console.log(randomId, " randomId");
    if (true) {
      const { data, error } = await supabase.from("tasks").insert({
        time: formatDate(new Date()),
        status: taskStatus,
        team_id: teamId,
      });

      if (error) throw error;

      console.log(data, " added task");
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("team_id", teamId);

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      console.log(data, " team data");
      fetchTasks();
    }
  };

  const handleDeleteTask = async (teamId: number, taskId: number) => {
    // console.log(teamId, " teamId");
    // console.log(taskId, " taskId");
    // setTeams((prevTeams) =>
    //   prevTeams.map((team) =>
    //     team.id === teamId
    //       ? {
    //           ...team,
    //           tasks: team.tasks.filter((task) => task.id !== taskId),
    //         }
    //       : team
    //   )
    // );
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) throw error;

    console.log(data, " deleted task");
  };

  const handleUpdateTask = async (teamId: number, taskId: number) => {
    const mentions = text.match(/@\w+/g) || []; // Find all mentions
    const content = text.replace(/@\w+/g, "").trim();

    const { data, error } = await supabase
      .from("tasks")
      .update({
        mentions: mentions,
        task_content: content,
      })
      .eq("id", taskId);

    if (error) throw error;

    console.log(data, " updated task");
    
    console.log(text, " text");
    console.log(mentions, " mentions");
    console.log(content, " content");
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    if (data) {
      console.log(data, " all task data");
      setAllTasks(data);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchTasks();
  }, [spaceId]);

  return (
    <>
      {teams.length > 0 ? (
        <div className="w-full py-4 px-0">
          <Carousel1 opts={{ align: "start" }} className="w-full max-w-full">
            <CarouselContent1 className="flex space-x-1">
              {teams.map((team) => (
                <CarouselItem1
                  key={team.id}
                  className="w-[339px] h-auto min-h-[200px] basis-[28%]"
                >
                  <Card>
                    <CardContent className="p-[18px] w-full h-full">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-black font-geist">
                          {team.team_name}
                        </p>
                        <Settings size={20} className="cursor-pointer" />
                      </div>
                      <Button
                        variant={"outline"}
                        className="mt-3 border-dashed border-gray-500 text-gray-500 text-sm font-medium w-full"
                        onClick={() => {
                          console.log("Team ID:", team.id);
                          handleAddTask(team.id);
                        }}
                      >
                        <Plus size={18} />
                        Add Task
                      </Button>
                      {allTasks.map((task: any) => (
                        task.team_id === team.id &&
                        <div className="flex flex-col gap-2.5 mt-3">
                          {/* {task.team_id === team.id && ( */}
                            <div
                              key={task.id}
                              className="flex-1 border border-[#ddd] rounded-lg p-3 font-geist"
                            >
                              <div className="flex justify-between items-center">
                                {/* <p>{task.id}</p> */}
                                <p className="text-xs font-semibold text-[#A6A6A7]">
                                  {formatDate(new Date())}
                                </p>
                                <Trash2
                                  size={18}
                                  className="text-[#EC4949] cursor-pointer"
                                  onClick={() => {
                                    console.log(
                                      "Deleting Task ID:",
                                      task.id,
                                      "for Team ID:",
                                      team.id
                                    );
                                    handleDeleteTask(team.id, task.id);
                                  }}
                                />
                              </div>
                              <WebMentionInput
                                text={text}
                                setText={setText}
                                taskErrorMessage={taskErrorMessage}
                                setTaskErrorMessage={setTaskErrorMessage}
                              />
                              <div className="flex justify-between items-center">
                                <p className="text-xs font-semibold text-teal-500">
                                  {formatDate(new Date())}
                                </p>
                                {createTask && (
                                  <Button
                                    variant={"outline"}
                                    className="bg-primaryColor-700 text-white rounded-full py-2 h-7 px-3 text-sm font-inter font-medium hover:bg-blue-600 hover:text-white"
                                    onClick={() => {
                                      console.log(
                                        "Creating Task ID:",
                                        task.id,
                                        "for Team ID:",
                                        team.id
                                      );
                                      handleUpdateTask(team.id, task.id);
                                    }}
                                  >
                                    Create
                                  </Button>
                                )}
                                {taskStatusShow && (
                                  <Select
                                    defaultValue="In progress"
                                    onValueChange={(value) => {
                                      console.log(
                                        "Task Status Changed for Task ID:",
                                        task.id,
                                        "Team ID:",
                                        team.id,
                                        "New Status:",
                                        value
                                      );
                                      setTaskStatus(value);
                                    }}
                                  >
                                    <SelectTrigger className="w-[164px] pt-2 pr-[10px] text-[#9B9B9B] text-center border-[#E2E2E2] bg-[#E2E2E2] rounded-[30px]">
                                      <SelectValue placeholder="status" />
                                    </SelectTrigger>
                                    <SelectContent className="text-[#9B9B9B]">
                                      <SelectItem value="todo">
                                        To Do
                                      </SelectItem>
                                      <SelectItem value="In progress">
                                        In Progress
                                      </SelectItem>
                                      <SelectItem value="Internal feedback">
                                        Internal feedback
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </div>
                          {/* )} */}
                        </div>
                      ))}
                      
                    </CardContent>
                  </Card>
                </CarouselItem1>
              ))}
            </CarouselContent1>
          </Carousel1>
        </div>
      ) : (
        <div className="w-full min-h-[80vh] flex justify-center items-center">
          <p className="text-lg font-semibold">No teams found</p>
        </div>
      )}
    </>
  );
};

export default SpaceTeam;
