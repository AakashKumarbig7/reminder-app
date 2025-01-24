"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";

export default function Spaces() {
  const [spaceNames, setSpaceNames] = useState<string[]>([]); // Updated state type
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const { data: spaces, error } = await supabase
          .from("spaces")
          .select("space_name")
          .eq("is_deleted", false);
        if (error) {
          throw error;
        }

        if (spaces) {
          // Extract only space names
          const names = spaces.map(
            (space: { space_name: string }) => space.space_name
          );
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
    <main className="w-full px-[18px] py-[18px]">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold font-geist text-black">Spaces</h4>
        <p className="text-[#1A56DB]  font-geist font-medium  text-sm cursor-pointer">
          View all
        </p>
      </div>

      <div className="flex flex-wrap justify-start items-center gap-2 mt-3">
        {spaceNames.length > 0 ? (
          spaceNames.map((spaceName, index) => (
            <p
              key={index}
              className="bg-[#294480] text-white py-2 px-4 rounded-lg"
            >
              {spaceName}
            </p>
          ))
        ) : (
          <p className="text-gray-500">No spaces available</p>
        )}
      </div>
    </main>
  );
}
