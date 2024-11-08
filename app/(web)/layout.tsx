
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full w-full bg-white text-black">
            <main className="w-full">
                <div className="w-full flex">
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
