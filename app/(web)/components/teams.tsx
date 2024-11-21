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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskDateUpdater from "./dueDate";

interface SearchBarProps {
  spaceId: number;
}

interface Team {
  id: number;
  team_name: string;
  tasks: { id: number; inputValue: string }[];
}

const SpaceTeam: React.FC<SearchBarProps> = ({ spaceId }) => {
  const styledInputRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [text, setText] = useState<string>("");
  const [taskErrorMessage, setTaskErrorMessage] = useState({
    status: false,
    errorId: 0,
  });
  const [taskStatus, setTaskStatus] = useState<string>("In Progress");
  const [createTask, setCreateTask] = useState(true);
  const [taskStatusShow, setTaskStatusShow] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any>([]);

  const [taskContents, setTaskContents] = useState<any>([]);
  const [startDate, setStartDate] = useState<any>({
    date : null,
    id : null
  });

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

  const handleAddTask = async (teamId: number, spaceId: number) => {
    setCreateTask(true);
    // Update the state to add the new task at the beginning of the team's tasks
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              tasks: [
                { id: team.tasks.length + 1, inputValue: "" }, // Add the new task at the beginning
                ...team.tasks,
              ],
            }
          : team
      )
    );

    // Insert the new task into the database
    try {
      const { data: insertedTask, error: insertError } = await supabase
        .from("tasks")
        .insert({
          time: formatDate(new Date()),
          status: taskStatus,
          team_id: teamId,
          space_id: spaceId,
        })
        .select()
        .order("id", { ascending: false });

      if (insertError) {
        throw insertError;
      }
      console.log(
        insertedTask.map((task: any) => task.id),
        " added task id"
      );
      console.log(insertedTask, "added task");

      // Fetch updated tasks for the team
      const { data: fetchedTasks, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("space_id", spaceId)
        .eq("team_id", teamId);

      if (fetchError) {
        console.error(fetchError);
        return;
      }

      if (fetchedTasks) {
        console.log(fetchedTasks, "team data");
        fetchTasks();
      }
    } catch (error) {
      console.error("Error adding or fetching tasks:", error);
    }
  };

  const handleDeleteTask = async (teamId: number, taskId: number) => {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) throw error;

    console.log(data, " deleted task");
    fetchTasks();
  };

  //  const handleUpdateTask = async (teamId: number, taskId: number) => {
  //   try {
  //     let mentions = text.match(/@\w+/g) || [];
  //     let content = text.replace(/@\w+/g, "").trim();

  //     const {data, error} = await supabase
  //     .from("tasks")
  //     .select("*")
  //     .eq("id", taskId)
  //     .eq("team_id", teamId)
  //     .single();

  //     if (error) {
  //       console.error("Error fetching task:", error);
  //       throw error;
  //     }

  //     if (data) {
  //       console.log(data.task_content, "task data");
  //       console.log(data, "current task data");
  //     }
  //     if(data.task_content === null && (data.mentions.length === 0 || data.mentions === null)) {
  //       setTaskErrorMessage({ status: true, errorId: taskId });
  //       return;
  //     }
  //     const { data: updatedTask, error: updateError } = await supabase
  //       .from("tasks")
  //       .update({
  //         task_content: content,
  //         mentions: mentions,
  //       })
  //       .eq("id", taskId)
  //       .eq("team_id", teamId)
  //       .select();

  //     if (updateError) {
  //       throw updateError;
  //     }

  //     if (updatedTask) {
  //       console.log(updatedTask, "updated task");
  //       setTaskErrorMessage({ status: false, errorId: taskId });
  //       setText("");
  //       fetchTasks();
  //     }
  //   }
  //   catch (error) {
  //     console.error("Error adding or fetching tasks:", error);
  //   }
  //  }

  const handleUpdateTask = async (teamId: number, taskId: number) => {
    try {
      const mentions = text.match(/@\w+/g) || []; // Extract mentions
      const content = text.replace(/@\w+/g, "").trim(); // Remove mentions and trim content

      console.log(taskId, "taskId");

      // Fetch the current task by ID and Team ID
      const { data: taskData, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .eq("team_id", teamId)
        .single();

      if (fetchError) {
        console.error("Error fetching task:", fetchError);
        throw fetchError;
      }

      if (taskData) {
        console.log(taskData.task_content, "task data");
        console.log(taskData, "current task data");

        // Validate if both content and mentions are empty
        if (!content && mentions.length === 0) {
          setTaskErrorMessage({ status: true, errorId: taskId });
          console.warn("Please enter both content and mentions.");
          return;
        }

        // Reset the error message state if validation passes
        setTaskErrorMessage({ status: false, errorId: taskId });

        console.log(mentions, content, "parsed text");

        // Update the task in the database
        const { data: updatedTask, error: updateError } = await supabase
          .from("tasks")
          .update({
            mentions,
            task_content: content,
          })
          .eq("team_id", teamId)
          .eq("id", taskId);

        if (updateError) {
          console.error("Error updating task:", updateError);
          throw updateError;
        }

        console.log(updatedTask, "updated task");

        // Handle styled input and UI updates
        const styledInput = styledInputRef.current;
        if (styledInput && !styledInput.innerText.trim()) {
          console.warn("Styled input is empty.");
          return;
        }

        console.log("Task:", styledInput?.innerText);
        // styledInput.innerText = ""; // Clear the styled input
        setText(""); // Clear the text state
        setCreateTask(false); // Hide the task creation UI
        setTaskStatusShow(true); // Show task status
      }
    } catch (error) {
      console.error("Error in handleUpdateTask:", error);
    }
  };

  const handleExpireDateChange = async (
    teamId: number,
    taskId: number,
    date: Date
  ) => {
    const formattedDate = formatDate(date);
    // setStartDate(date);
    const { data, error } = await supabase
      .from("tasks")
      .update({ due_date: formattedDate })
      .eq("id", taskId)
      .eq("team_id", teamId);
    if (error) throw error;
    if (data) {
      console.log(data, "due date updated");
      setStartDate(date);
      fetchTasks();
    }
    // handleUpdateTask(teamId, taskId);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    if (data) {
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
              {teams.map((team, index) => (
                <CarouselItem1
                  key={team.id}
                  className="w-[339px] h-auto min-h-[200px] basis-[28%]"
                >
                  <Card key={index}>
                    <CardContent key={index} className="p-[18px] w-full h-full">
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
                          handleAddTask(team.id, spaceId);
                        }}
                      >
                        <Plus size={18} />
                        Add Task
                      </Button>
                      {allTasks.map(
                        (task: any) =>
                          task.team_id === team.id && (
                            <div
                              key={task.id}
                              className="flex flex-col gap-2.5 mt-3"
                            >
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
                                  allTasks={allTasks}
                                  teamId={team.id}
                                  taskId={task.id}
                                />
                                <div className="flex justify-between items-center">
                                  <p className="text-xs font-semibold text-teal-500 w-[164px]">
                                    {/* <DatePicker
                                      className="w-full focus-visible:outline-none border-none"
                                      closeOnScroll={(e) =>
                                        e.target === document
                                      }
                                      popperPlacement="bottom"
                                      selected={task.due_date ? task.due_date : startDate}
                                      onChange={(date) => {
                                        handleExpireDateChange(
                                          team.id,
                                          task.id,
                                          date as Date
                                        );
                                      }}
                                    /> */}
                                    <TaskDateUpdater
                                      team={team}
                                      task={task}
                                      fetchTasks={fetchTasks}
                                      // startDate={startDate}
                                      // setStartDate={setStartDate}
                                      // formatDate={formatDate}
                                    />
                                  </p>
                                  {createTask && (
                                    <Button
                                      variant={"outline"}
                                      className="bg-primaryColor-700 text-white rounded-full py-2 h-7 px-3 text-sm font-inter font-medium hover:bg-blue-600 hover:text-white"
                                      onClick={() => {
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
                          )
                      )}
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
