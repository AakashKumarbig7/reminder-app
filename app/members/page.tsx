import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerClose,
    DrawerFooter,
  } from "@/components/ui/drawer";

  import { Button } from "@/components/ui/button"
  import { FaEllipsisH } from "react-icons/fa";
  import { Check } from 'lucide-react';

export default function Members()
{

    return (
        <>
           {/* <Drawer>
  <DrawerTrigger> <button className="flex w-[40px] h-[40px]  p-[8px_12px] justify-center items-center gap-[6px] rounded-lg border border-gray-300 bg-white">
            <FaEllipsisH />
          </button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle className="w-[66px] px-[10px] py-[10px] text-[18px]">Spaces</DrawerTitle>
      <DrawerDescription className="text-start"><ul>
            <li className="flex"><Check className="" />Aakash</li>  
            <li className="flex"><Check />Aakash</li>  
            <li className="flex"><Check />Aakash</li>  
            <li className="flex"><Check  />Aakash</li>  

        </ul></DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer> */}<div
    className="flex flex-col bg-[#ffffff] w-[339px] h-32 p-3 justify-center rounded-[10px] border-[#e1e1e1] border relative overflow-hidden gap-y-1">
    <div className="flex w-[315px] h-5 items-center relative gap-x-3">
        <p className="text-xs leading-5 text-[#a6a6a7] w-[75px] h-5 not-italic align-middle normal-case">20 Aug 2024</p>
    </div>
    <div className="flex w-[315px] h-12 justify-between relative gap-x-3">
        <p className="text-base leading-6 text-[#000000] w-[315px] h-12 align-middle normal-case">Pugazh need to talk
            reg reminder app ui design</p>
    </div>
    <div className="flex w-[315px] h-7 justify-between items-center relative gap-x-3">
        <p className="text-xs leading-5 text-[#ec4949] w-[75px] h-5 not-italic align-middle normal-case">23 Aug 2024</p>
        <div
            className="flex bg-[#f8f0da] w-[82px] h-7 py-1 px-2 justify-center items-center rounded-[30px] relative overflow-hidden gap-x-2.5">
            <p className="text-xs leading-5 text-[#eea15a] w-[66px] h-5 not-italic align-middle normal-case">In Progress
            </p>
        </div>
    </div>
</div>

     </>

    )
    
       
}