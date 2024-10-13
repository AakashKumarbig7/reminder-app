import { sql } from '@vercel/postgres';
import { Tasks } from './definitions';
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const cookieStore = cookies()
const supabase = createClient(cookieStore)

export async function fetchTasks() {
  try {
    let { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
    console.log('Data' + JSON.stringify(tasks));
    if (error) throw error
    return tasks;
  } catch (error) {
    console.error('Database Error:', error);
  }
}