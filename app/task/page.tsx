import NavBar from "@/components/task/navBar";
import AllTask from"@/components/task/alltask";
import DropDown from "@/components/task/dropdown";
import Tasks from "@/components/task/overdue";
import Emoji from "@/components/emoji";
import {NewTask} from "@/components/newTask"
export default function TaskPage()
{
    return (
        <>
        <NavBar/>
        <div className="flex flex-col bg-bgmain px-[18px]  space-y-[18px] ">
        <DropDown/>
        <AllTask/>
        <Tasks/>
        <Emoji/>
        <NewTask/>
        </div>
        </>
    )
}