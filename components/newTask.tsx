"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import addicon from "@/public/images/Frame.png";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import styles from "../styles/newtask.module.css";
import axios from "axios";

type User = {
  id: number;
  name: string;
};

type PopupProps = {
  data: User[];
  position: { top: number; left: number };
  onSelect: (user: User) => void;
};

const Popup: React.FC<PopupProps> = ({ data, position, onSelect }) => (
  <div
    
    style={{
      top: position.top,
      left: position.left,
    }}
  >
    {data.map((user) => (
      <div key={user.id} onClick={() => onSelect(user)}>
        {user.name}
      </div>
    ))}
  </div>
);

const fetchEmployeeList = async () => {
  try {
    const response = await axios.get("https://portal.solution22.com.au/api/employees", {
      headers: {
        Authorization: `Bearer Ng4J6u194xccX9kbZxrBOEpZHWjQI5g5Ao7LccMf`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee list:", error);
    return null;
  }
};

export function NewTask() {
  const styledInputRef = useRef<HTMLDivElement>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [taskError, setTaskError] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      const data = await fetchEmployeeList();
      if (data) {
        setEmployees(data);
      }
    };

    getEmployees();
  }, []);
 

  const Popup: React.FC<PopupProps> = ({ data, position, onSelect }) => {
    return (
      <div className="popup" style={{ top: position.top, left: position.left }}>
        {data.map((user) => (
          <div key={user.id} onClick={() => onSelect(user)}>
            {user.name}
          </div>
        ))}
      </div>
    );
  };
  let PopupList: User[] = [];

  const Space: User[] = [
    { id: 1, name: "Big7Solution" },
    { id: 2, name: "Solution22" },
    { id: 3, name: "Graphity" },
  ];

  const Team: User[] = [
    { id: 1, name: "DevelopmentTeam" },
    { id: 2, name: "DesignTeam" },
    { id: 3, name: "MangementTeam" },
  ];

  const Employee: User[] = [
    { id: 1, name: "Dhanasekar" },
    { id: 2, name: "Prashanth" },
    { id: 3, name: "Pugal" },
  ];

  useEffect(() => {
    const styledInput = styledInputRef.current;
    if (!styledInput) return;

    const handleInput = () => {
      let text = styledInput.innerText || '';
      const atCount = (text.match(/@/g) || []).length;

      if (atCount === 1) {
        PopupList = Space;
      } else if (atCount === 2) {
        PopupList = Team;
      } else if (atCount === 3) {
        PopupList = Employee;
      }
      const atIndex = text.lastIndexOf('@');
      if (atIndex !== -1) {
        const substring = text.substring(atIndex + 1);
        const matches = PopupList.filter((user) =>
          user.name.toLowerCase().startsWith(substring.toLowerCase())
        );

        console.log("Suggested matches:", matches);
        if (matches.length > 0) {
          setSuggestedUsers(matches);
          const range = window.getSelection()?.getRangeAt(0);
          if (range) {
            const rect = range.getBoundingClientRect();
            setPopupPosition({
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX,
            });
            setPopupVisible(true);
          }
        } else {
          setPopupVisible(false);
        }
      } else {
        setPopupVisible(false);
      }

      text = text.replace(/(@\w+)/g, '<span>$1</span>');
      styledInput.innerHTML = text;

      document.querySelectorAll('#styledInput span').forEach((span, index) => {
        if (index === 0) {
          (span as HTMLElement).style.color = '#df478e';
        } else if (index === 1) {
          (span as HTMLElement).style.color = '#8692ee';
        } else if (index === 2) {
          (span as HTMLElement).style.color = '#62e78a';
        }
      });

      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(styledInput);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    };

    styledInput.addEventListener("input", handleInput);
    return () => styledInput.removeEventListener("input", handleInput);
  }, [PopupList]);

  const handleUserSelect = (user: User) => {
    const styledInput = styledInputRef.current;
    if (styledInput) {
      let text = styledInput.innerText || '';
      const atIndex = text.lastIndexOf('@');
      const newText = text.substring(0, atIndex) +  `@${user.name}` ;
      styledInput.innerText = newText;
      styledInput.dispatchEvent(new Event('input'));
      setPopupVisible(false);
    }
  };
  const handleCreateTask = () => {
    const styledInput = styledInputRef.current;
    if (!styledInput?.innerText.trim()) {
      setTaskError(true);
      return;
    }
    console.log("Task:", styledInput.innerText);
    styledInput.innerText = "";
  };

  return (
    <>
   
    <Drawer>
      <DrawerTrigger className="w-full bg-teal-500 flex items-center justify-center text-white py-2 rounded-lg">
        <Image src={addicon} alt="Add Icon" width={20} height={20} className="mr-2" />
        New Task
      </DrawerTrigger>
      <DrawerContent className="pb-10">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>New Task</DrawerTitle>
          <Select defaultValue="todo">
            <SelectTrigger className="w-[164px] pt-2 pr-[10px] text-[#9B9B9B] text-center border-[#E2E2E2] bg-[#E2E2E2] rounded-[30px]">
              <SelectValue placeholder="status" />
            </SelectTrigger>
            <SelectContent className="text-[#9B9B9B]">
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="internal_feedback">Internal feedback</SelectItem>
            </SelectContent>
          </Select>
        </DrawerHeader>
        <DrawerDescription className="px-4 border-black rounded-[10px]">
          <div>
            <div
              contentEditable="true"
              ref={styledInputRef}
              id="styledInput"
              className={styles.styledinput}

            ></div>
            {popupVisible && (
              <Popup
                data={suggestedUsers}
                position={popupPosition}
                onSelect={handleUserSelect}
                // className="absolute bg-white border border-gray-300 z-10 max-h-52 overflow-y-auto w-[150px]"
              />
            )}
            {/* {taskError && (
              <span className="text-red-500 py-1 text-sm">Please enter a task</span>
            )} */}
          </div>
        </DrawerDescription>
        <Button
          className="bg-transparent text-[#14B8A6] hover:bg-transparent font-semibold text-base text-center shadow-none"
          onClick={handleCreateTask}
        >
          Create Task
        </Button>
      </DrawerContent>
    </Drawer>
    </>
  );
}
