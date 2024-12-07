
import 'rsuite/dist/rsuite-no-reset.min.css';
import { Toaster } from "@/components/ui/toaster";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen h-full w-full bg-webbg text-black font-inter">
            <main className="w-full">
            <Toaster />
                <div className="w-full flex">
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
