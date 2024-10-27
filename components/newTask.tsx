'use client'
import React from 'react'
import addicon from '@/public/images/Frame.png'
import Image from "next/image"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MentionsInput, Mention } from 'react-mentions'
// import classNames from '../styles/example.module.css'
import { Button } from './ui/button'

export function NewTask() {

  // function fetchUsers(query: any, callback: any) {
  //   if (!query) return
  //   fetch(`https://api.github.com/search/users?q=${query}`)
  //     .then(res => res.json())

  //     // Transform the users to what react-mentions expects
  //     .then(res =>
  //       res.items.map((user: any) => ({ display: user.login, id: user.login }))
  //     )
  //     .then(callback)
  // }

  // const [value, setValue] = React.useState('');
  // const onChange = ({ target }: { target: any }) => {
  //   setValue(target.value);
  // };

  return (
    <Drawer>
      <DrawerTrigger className='w-full  bg-teal-500  flex items-center justify-center text-white py-2 
      rounded-lg' >
        <Image src={addicon} alt="Add Icon" width={20} height={20} className="mr-2" />
        New Task
      </DrawerTrigger>
      <DrawerContent className='pb-10'>
        <DrawerHeader className='flex items-center justify-between'>
          <DrawerTitle>New Task</DrawerTitle>
          <Select defaultValue='todo' >
            <SelectTrigger className="w-[164px] pt-2 pr-[10px] text-center border-[#E2E2E2] bg-[#9B9B9B] rounded-[30px]">
              <SelectValue placeholder="status" />
            </SelectTrigger>
            <SelectContent className='text-[#9B9B9B]'>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="internal_feedback">Internal feedback</SelectItem>
            </SelectContent>
          </Select>
        </DrawerHeader>
        <DrawerDescription className="px-4 border-black  rounded-[10px]">
          
        </DrawerDescription>
        <Button className='bg-transparent text-[#14B8A6] hover:bg-transparent text-center shadow-none'>Create Task</Button>
      </DrawerContent>
    </Drawer>

  )
}
