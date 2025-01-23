"use client";
import NavBar from "@/components/navBar";
import { NewTask } from "@/components/newTask";
import OverDue from "@/components/overDue";
import TaskStatus from "@/components/taskStatus";


const Home = () => {
    return ( 
        <>
        <NavBar />
        <NewTask />
        <TaskStatus />
        <OverDue/>
        </>
     );
}
 
export default Home;