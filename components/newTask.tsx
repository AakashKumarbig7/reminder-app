
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

import { Button } from '@/components/ui/button'
import { MentionInput } from './mentionInput'
import { createTasks } from '@/lib/data'

export function NewTask() {

  async function createTask(formData: FormData) {
    'use server'
    console.log(formData)
    await createTasks(formData)
  }

  return (
    <Drawer>
      <DrawerTrigger className='w-full bg-[#14B8A6]  flex items-center justify-center text-white py-2 rounded-lg' >
        <Image src={addicon} alt="Add Icon" width={20} height={20} className="mr-2" />
        New Task
      </DrawerTrigger>
      <DrawerContent className='pb-10'>
        <form action={createTask}>
          <DrawerHeader className='flex items-center justify-between'>
            <DrawerTitle>New Task</DrawerTitle>
            <Select name='status' defaultValue='todo'>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                {/* <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="internal_feedback">Internal feedback</SelectItem> */}
              </SelectContent>
            </Select>
          </DrawerHeader>
          <DrawerDescription className='px-4'>
            <MentionInput />
          </DrawerDescription>
          <Button type='submit' className='bg-transparent text-[#14B8A6] hover:bg-transparent shadow-none'>Create Task</Button>
        </form>

      </DrawerContent>
    </Drawer>

  )
}
