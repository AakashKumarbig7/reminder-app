"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function OverDue () {
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold text-black">Overdue Task</h4>
        <p className="text-[#14B8A6] cursor-pointer">View all</p>
      </div>
      {/* <div className="  pt-[18px]">
        <div className="  flex  space-x-2  justify-evenly ">
          <div className="bg-white shadow-md pl-[12px] p-4 space-x-2 rounded-lg w-full mr-2 ">
            <div className="">
              <p className="bg-[#f4f4f8] text-[#737373] text-[12px] font-semibold  border-gray-300 rounded-full inline-block px-2 py-1">
                Design Team
              </p>
            </div>
            <div>
            <p className="text-primary py-3 text-base">
              @Pugazh need to talk reg reminder app ui...
            </p>
          </div>

          <div className="bg-white shadow-md  p-4 rounded-lg w-full mr-2">
            <div className="bg-[#f4f4f8]  text-[#737373] text-[12px] font-semibold  border-gray-300 rounded-full inline-block px-2 py-1">Wordpress Team</div>
            <p className="text-[#000000] mt-2 ">@shiji new project to talk</p>
            <div className="flex justify-around mt-2">
              <span className="text-red-500 font-[12px] mt-8">Today</span>
              <span className="border bg-[#F8DADA] rounded-xl text-[#EE5A5A] py-1 mt-7 px-1">
                Todo
              </span>
            </div>
          </div>
        </div>
      </div> */}
      <Carousel opts={{ align: "start" }} className="w-full max-w-sm">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-[62%] md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1 w-[217px]">
                <Card>
                  <CardContent className="aspect-square p-[18px] w-full h-[156px]">
                    {/* <div className="bg-white shadow-md p-4 rounded-lg w-full"> */}
                      <div className="bg-[#f4f4f8] text-[#737373] text-[12px] font-semibold border-gray-300 rounded-full inline-block px-2 py-1">
                        Wordpress Team
                      </div>
                      <p className="text-[#000000] mt-2">
                        @shiji new project to talk
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-red-500 font-bold text-sm">
                          Today
                        </span>
                        <span className="border bg-[#F8DADA] rounded-3xl text-[#EE5A5A] text-sm font-bold py-1 px-2">
                          To Do
                        </span>
                      </div>
                    {/* </div> */}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
