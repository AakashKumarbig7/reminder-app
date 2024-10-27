import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
 
} from "@/components/ui/drawer";
import { Command, CommandList } from "@/components/ui/command";

export default function Tasks() {
  return (
    <>
      <div className="bg-white space-y-2 py-3 rounded-[10px] w-[339px] h-32 px-4">
       <div className=""> 
        <p className="text-greyshade font-[geist] text-[12px] px-3 ">20 Aug 2024</p>
        </div>
        <p className="text-[#000000] text-[16px] font-[geist]">Pugazh need to talk reg reminder app ui<br></br> design</p>

        <div className="  flex justify-between text-center">
          <p className="text-[#EC4949] pt-1 font-[geist] text-[12px]">23 Aug 2024</p>
          <Drawer>
            <DrawerTrigger >
              
          <button>
          <p className="text-[#EEA15A] w-20 h-[22px]  text-[12px] font-[geist] rounded-[30px] text-center bg-[#F8F0DA] px-[8px] py-[4px]">In Progress</p> 
          </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Filters</DrawerTitle>
            {/* <DrawerDescription></DrawerDescription> */}
            <Command>
              <CommandList>
                <ul>
                  <div  className="mt-[18px] border w-[243px]  border-black h-10">
                  <li className="">Compilation Status</li>
                  </div>
                </ul>
              </CommandList>
            </Command>
          </DrawerContent>
          </Drawer>
        </div>
        </div>

       
       
    </>
  );
}
