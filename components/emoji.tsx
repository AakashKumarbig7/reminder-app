import Image from "next/image";
import emoji from "@/public/images/image 3.png"
export default function Emoji() {
    return (
        <>
            <div className="flex justify-center pb-14">
                <Image src={emoji} className="w-8  h-8"  alt="not reload" />
                <span className=" p-[9px] text-xs text-ashgrey " >Thats all for today !!!!</span>
            </div>
        </>
    )
}