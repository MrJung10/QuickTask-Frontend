import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarDays, FolderKanban, Plus, Users } from "lucide-react"
import Link from "next/link"

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design",
    status: "In Progress",
    progress: 65,
    members: 5,
    dueDate: "2024-02-15",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native iOS and Android app for customer engagement",
    status: "Planning",
    progress: 20,
    members: 8,
    dueDate: "2024-03-30",
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Database Migration",
    description: "Migrate legacy database to cloud infrastructure",
    status: "Review",
    progress: 90,
    members: 3,
    dueDate: "2024-01-20",
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Marketing Campaign",
    description: "Q1 digital marketing campaign for product launch",
    status: "Not Started",
    progress: 0,
    members: 6,
    dueDate: "2024-04-01",
    color: "bg-orange-500",
  },
]

const recentActivity = [
  {
    user: "Alice Johnson",
    action: "completed task",
    target: "User Authentication",
    time: "2 hours ago",
    avatar: "AJ",
  },
  {
    user: "Bob Smith",
    action: "created project",
    target: "API Documentation",
    time: "4 hours ago",
    avatar: "BS",
  },
  {
    user: "Carol Davis",
    action: "updated task",
    target: "Database Schema",
    time: "6 hours ago",
    avatar: "CD",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
