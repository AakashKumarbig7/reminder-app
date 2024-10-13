import Image from "next/image";
import emoji from "@/public/images/image 3.png"
export default function Emoji() {
    return (
        <>
            <div className="flex justify-center">
                <Image src={emoji} alt="not reload" />
                <span className="#A7A7AB p-[9px] font-normal text-[#A7A7AB] " >Thats all for today !!!!</span>
            </div>
        </>
    )
}