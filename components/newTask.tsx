"use client";
import React, { useState } from "react";
import addicon from "@/public/images/Frame.png";
import Image from "next/image";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MentionsInput, Mention } from "react-mentions";
import classNames from "../styles/example.module.css";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export function NewTask() {
  const [value, setValue] = useState("");
  const [taskError, setTaskError] = useState(false);

  function fetchUsers(query: any, callback: any) {
    if (!query) return;
    fetch(`https://api.github.com/search/users?q=${query}`)
      .then((res) => res.json())

      // Transform the users to what react-mentions expects
      .then((res) =>
        res.items.map((user: any) => ({ display: user.login, id: user.login }))
      )
      .then(callback);
  }

  const onChange = ({ target }: { target: any }) => {
    setValue(target.value);
    setTaskError(false);
  };

  const handleCreateTask = () => {
    if (!value) {
      setTaskError(true);
      return;
    }
    console.log(value);
    setValue("");
  };

  return (
    <Drawer>
      <DrawerTrigger
        className="w-full  bg-teal-500  flex items-center justify-center text-white py-2 
      rounded-lg"
      >
        <Image
          src={addicon}
          alt="Add Icon"
          width={20}
          height={20}
          className="mr-2"
        />
        New Task
      </DrawerTrigger>
      <DrawerContent className="pb-10">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>New Task</DrawerTitle>
          <Select defaultValue="todo">
            <SelectTrigger
              style={{ fontFamily: "'Geist', Arial, sans-serif" }}
              className="w-[164px] pt-2 pr-[10px] text-[#9B9B9B] text-center border-[#E2E2E2] bg-[#E2E2E2] rounded-[30px]"
            >
              <SelectValue placeholder="status" />
            </SelectTrigger>
            <SelectContent className="text-[#9B9B9B]">
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="internal_feedback">
                Internal feedback
              </SelectItem>
            </SelectContent>
          </Select>

          {/* <select name="" id="task_select" className="w-[164px] bg-[#E2E2E2] p-2 rounded-full font-medium focus:outline-none">
            <option className="bg-white text-[#9B9B9B] font-medium" value="todo">To Do</option>
            <option className="bg-white text-[#9B9B9B] border-b-4 border-indigo-500 font-medium" value="in_progress">In Progress</option>
            <option className="bg-white text-[#9B9B9B] border-b-4 border-indigo-500 font-medium" value="internal_feedback">Internal feedback</option>
          </select> */}
        </DrawerHeader>
        <DrawerDescription className="px-4 border-black  rounded-[10px]">
          {/* <MentionsInput
            value={value}
            onChange={onChange}
            a11ySuggestionsListLabel={"Suggested mentions"}
            classNames={classNames}
            className="rounded "
            placeholder="Enter your comments..."
          >
            <Mention
              trigger="@"
              displayTransform={(display) => `@${display}`}
              data={fetchUsers}
              className={classNames.mentions__mention}
            />
          </MentionsInput> */}
          {/* <Input placeholder='Enter task name' className="w-full p-1 h-[57px] text-black text-md rounded-md font-medium focus:outline-none focus:border-none"/> */}
          <textarea
            value={value}
            name="text"
            id="text"
            className="w-full p-1 h-[60px] text-black text-md rounded-md font-medium focus:outline-none focus:border-none"
            style={{ border: "1px solid #9B9B9B" }}
            onChange={onChange}
          ></textarea>
          {taskError && (
            <span className="text-red-500 py-1 text-sm">
              Please enter a task
            </span>
          )}
        </DrawerDescription>
        <Button
          className="bg-transparent text-[#14B8A6] hover:bg-transparent font-semibold text-base text-center shadow-none"
          onClick={handleCreateTask}
        >
          Create Task
        </Button>
      </DrawerContent>
    </Drawer>
  );
}
