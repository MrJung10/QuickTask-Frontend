"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "./ui/sidebar"
import { Bell, LogOut, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthActions } from "@/store/auth-store"

export default function Navbar() {
  const router = useRouter()
  
  const { logout } = useAuthActions()

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  }

  return (
    <header className="h-14 w-full border-b bg-white px-4 flex items-center justify-between">
      {/* Left: Sidebar Trigger + Logo */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
      </div>

      {/* Right: Notifications + User Dropdown */}
      <div className="flex items-center gap-3">
        <button className="text-muted-foreground hover:text-primary transition">
          <Bell className="w-5 h-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary focus:outline-none">
              <Image
                src="/images/user-placeholder.jpg"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full w-8 h-8 object-cover"
              />
              <span className="hidden md:inline">Admin</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
