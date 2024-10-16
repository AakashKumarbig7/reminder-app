import SearchBar from "@/components/searchBar";
import NavBar from "@/components/navBar";
import { NewTask } from "@/components/newTask";
import OverDue from "@/components/overDue";
import TaskStatus from "@/components/taskStatus";
import Spaces from "@/components/spaces";
import Teams from "@/components/teams";
import Emoji from "@/components/emoji";
import Footer from "@/components/footer/footer";

interface Mention {
  id: number;
  name: string;
}

export default function HomePage() {

  return (
    <>
      <NavBar />
      <div className="flex flex-col bg-[#f4f4f8] px-[18px] pb-[100px] space-y-[18px]">
        <SearchBar />
        <NewTask />
        <TaskStatus />
        <OverDue />
        <Spaces />
        <Teams />
        <Emoji />
      </div>
    </>
  );
}
