"use client";
import "rsuite/dist/rsuite-no-reset.min.css";
import { Toaster } from "@/components/ui/toaster";
import { GlobalContextProvider } from "@/context/store";
export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen h-full w-full bg-mobbg text-black font-geist">
      <main className="w-full">
        <Toaster />
        <div className="w-full flex">
          <div className="w-full">
            <GlobalContextProvider>{children}</GlobalContextProvider>
          </div>
        </div>
      </main>
    </div>
  );
}
