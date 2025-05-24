"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, MoreHorizontal, Plus, Search } from "lucide-react"

const allProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design",
    status: "In Progress",
    progress: 65,
    members: [
      { name: "Alice Johnson", avatar: "AJ" },
      { name: "Bob Smith", avatar: "BS" },
      { name: "Carol Davis", avatar: "CD" },
    ],
    totalMembers: 5,
    dueDate: "2024-02-15",
    createdDate: "2024-01-01",
    priority: "High",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native iOS and Android app for customer engagement",
    status: "Planning",
    progress: 20,
    members: [
      { name: "David Wilson", avatar: "DW" },
      { name: "Eve Brown", avatar: "EB" },
      { name: "Frank Miller", avatar: "FM" },
    ],
    totalMembers: 8,
    dueDate: "2024-03-30",
    createdDate: "2024-01-05",
    priority: "High",
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Database Migration",
    description: "Migrate legacy database to cloud infrastructure",
    status: "Review",
    progress: 90,
    members: [
      { name: "Bob Smith", avatar: "BS" },
      { name: "Frank Miller", avatar: "FM" },
    ],
    totalMembers: 3,
    dueDate: "2024-01-20",
    createdDate: "2023-12-15",
    priority: "Critical",
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Marketing Campaign",
    description: "Q1 digital marketing campaign for product launch",
    status: "Not Started",
    progress: 0,
    members: [
      { name: "Carol Davis", avatar: "CD" },
      { name: "Eve Brown", avatar: "EB" },
    ],
    totalMembers: 6,
    dueDate: "2024-04-01",
    createdDate: "2024-01-10",
    priority: "Medium",
    color: "bg-orange-500",
  },
  {
    id: 5,
    name: "API Documentation",
    description: "Comprehensive API documentation for developers",
    status: "In Progress",
    progress: 45,
    members: [
      { name: "Eve Brown", avatar: "EB" },
      { name: "Bob Smith", avatar: "BS" },
    ],
    totalMembers: 2,
    dueDate: "2024-02-28",
    createdDate: "2024-01-08",
    priority: "Low",
    color: "bg-cyan-500",
  },
  {
    id: 6,
    name: "Security Audit",
    description: "Complete security audit and vulnerability assessment",
    status: "Done",
    progress: 100,
    members: [
      { name: "Frank Miller", avatar: "FM" },
      { name: "David Wilson", avatar: "DW" },
    ],
    totalMembers: 4,
    dueDate: "2024-01-15",
    createdDate: "2023-12-01",
    priority: "Critical",
    color: "bg-red-500",
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Planning":
        return "bg-yellow-100 text-yellow-800"
      case "Review":
        return "bg-purple-100 text-purple-800"
      case "Done":
        return "bg-green-100 text-green-800"
      case "Not Started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your projects in one place.</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
          <CardDescription>Complete list of projects with their current status and details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Project</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Team</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${project.color}`} />
                        <div className="min-w-0">
                          <Link href={`/projects/${project.id}`} className="font-medium hover:underline block truncate">
                            {project.name}
                          </Link>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{project.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {project.members.slice(0, 3).map((member, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                            </Avatar>
                          ))}
                          {project.totalMembers > 3 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                              +{project.totalMembers - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{project.totalMembers} members</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.dueDate}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.id}`}>View Project</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Project</DropdownMenuItem>
                          <DropdownMenuItem>Manage Team</DropdownMenuItem>
                          <DropdownMenuItem>Clone Project</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Archive Project</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {allProjects.filter((p) => p.status === "In Progress").length} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProjects.filter((p) => p.status === "Done").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((allProjects.filter((p) => p.status === "Done").length / allProjects.length) * 100)}%
              completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
