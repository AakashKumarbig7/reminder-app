import Image from "next/image";

const WebNavbar = () => {
    return ( 
        <>
        <div className="flex items-center justify-between w-full py-2 px-3">
            <Image
                src="/images/menu-top_bar.png"
                alt="Logo"
                width={50}
                height={50} 
            />
        </div>
        </>
     );
}
 
export default WebNavbar;