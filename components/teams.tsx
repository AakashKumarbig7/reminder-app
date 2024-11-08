import { CirclePlus } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
export default function Teams() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-black">Teams</h4>
        <p className="text-teal-500 cursor-pointer">View all</p>
      </div>
     
      <div className="space-y-1">
      <Carousel opts={{ align: "start" }} className="w-full max-w-sm  ">
        <div className="flex  items-center space-y-3 ">
          <CarouselContent className="">
            <div>
          <button className="rounded-[10px] border border-teal-500 bg-lightskyblue flex items-center justify-center  w-[142px] h-10 px-4 text-base font-medium">
            <CirclePlus className="text-greyblack h-6 w-6" />
            <p className="pl-1">New Team</p>
          </button>
          </div>
          
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="flex-none"
              >
                <button className="rounded-[10px] border border-teal-500 bg-white flex items-center justify-center  min-w-min h-10 px-4 text-base font-medium text-greyblack">
                  <p>Development Team</p>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
      </div>
      
    </>
  );
}