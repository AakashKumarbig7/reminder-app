"use client";

import { CirclePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Spaces() {
  const [spaceNames, setSpaceNames] = useState<string[]>([]); // Updated state type
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        let { data: spaces, error } = await supabase
          .from("spaces")
          .select("space_name");

        if (error) {
          throw error;
        }

        if (spaces) {
          // Extract only space names
          const names = spaces.map((space: { space_name: string }) => space.space_name);
          setSpaceNames(names);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch space names.");
      }
    };

    fetchSpace();
  }, []); // Add empty dependency array to run only once

  return (
    <>
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-black">Spaces</h4>
        <p className="text-teal-500 cursor-pointer">View all</p>
      </div>

      <div className="space-y-1">
        <Carousel opts={{ align: "start" }} className="w-full max-w-sm space-x-2">
          <div className="flex items-center space-y-3">
            <CarouselContent>
              {spaceNames.length > 0 ? (
                spaceNames.map((spaceName, index) => (
                  <CarouselItem key={index} className="flex-none">
                    <button className="rounded-[10px] border border-teal-500 bg-white flex items-center justify-center min-w-min h-10 px-4 text-base font-medium text-greyblack">
                      <p>{spaceName}</p>
                    </button>
                  </CarouselItem>
                ))
              ) : (
                <p className="text-gray-500">No spaces available</p>
              )}
            </CarouselContent>
          </div>
        </Carousel>
      </div>
    </>
  );
}
