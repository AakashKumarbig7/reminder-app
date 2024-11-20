"use client";
import { useRouter } from "next/navigation";
import WebNavbar from "@/app/(web)/components/navbar";

export default function EditSpace({ params }: { params: { spaceId: string } }) {
  const router = useRouter();
  const { spaceId } = params;

  return (
    <>
      <WebNavbar />
      <div className="px-3">
        <div className="bg-white w-full h-[65px] rounded-[12px] border-none flex items-center max-w-full shadow-md">
          <p className="text-center text-lg font-semibold">Space Setting</p>
        </div>
      </div>
    </>
  );
}
