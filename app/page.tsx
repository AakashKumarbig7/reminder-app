"use client";
import HomePage from "@/app/(mob)/home/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
	});

  useEffect(() => {
    const redirectToTask = () => {
      route.push("/home");
    };

    if (window.innerWidth <= 992) {
      redirectToTask();
      setLoading(false);
      return;
    }
    else {
      route.push("/dashboard");
      setLoading(false);
    }
  }, []);
  
  if (loading) {
    return <div className="loader">Loading...</div>; // Simple loader UI
  }

  // return <HomePage />
}