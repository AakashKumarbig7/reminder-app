"use client";
import NavBar from "@/components/navBar";
import { useGlobalContext } from "@/context/store";



const Home = () => {
    const {userId} = useGlobalContext();

    return ( 
        <>
        <NavBar />
       
        </>
     );
}
 
export default Home;