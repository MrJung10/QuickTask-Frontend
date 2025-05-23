import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/Navbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen px-3">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1 px-6">
                    <Navbar />
                        {children}
                </div>
            </SidebarProvider>
        </div>
    )
}
