"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
export default function Book() {
  const [tasks, setAllTasks] = useState<any>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      let { data: tasks, error } = await supabase.from("tasks").select("*");
      if (error) {
        setError("Error");
      } else {
        setAllTasks(tasks);
      }
    };
    fetchTask();
  });

  return (
    <div className="text-black">
      {tasks.map((task: any, index: any) => {
        return <h2 key={index}>{task?.task_content}</h2>; // Return the JSX element
      })}
      {error && <p>{error}</p>} {/* Show error message if there's an error */}
    </div>
  );
}
