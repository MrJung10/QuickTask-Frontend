"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, MoreHorizontal, Plus, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const initialTasks = {
  todo: [
    {
      id: 1,
      title: "Design user interface mockups",
      description: "Create wireframes and high-fidelity mockups for the main dashboard",
      assignee: { name: "Alice Johnson", avatar: "AJ" },
      priority: "High",
      dueDate: "2024-01-25",
    },
    {
      id: 2,
      title: "Set up development environment",
      description: "Configure local development setup with all necessary tools",
      assignee: { name: "Bob Smith", avatar: "BS" },
      priority: "Medium",
      dueDate: "2024-01-22",
    },
  ],
  inProgress: [
    {
      id: 3,
      title: "Implement authentication system",
      description: "Build secure login and registration functionality",
      assignee: { name: "Carol Davis", avatar: "CD" },
      priority: "High",
      dueDate: "2024-01-30",
    },
    {
      id: 4,
      title: "Database schema design",
      description: "Design and implement the database structure",
      assignee: { name: "David Wilson", avatar: "DW" },
      priority: "Medium",
      dueDate: "2024-01-28",
    },
  ],
  review: [
    {
      id: 5,
      title: "API documentation",
      description: "Complete documentation for all API endpoints",
      assignee: { name: "Eve Brown", avatar: "EB" },
      priority: "Low",
      dueDate: "2024-01-26",
    },
  ],
  done: [
    {
      id: 6,
      title: "Project setup and planning",
      description: "Initial project setup and requirement gathering",
      assignee: { name: "Frank Miller", avatar: "FM" },
      priority: "High",
      dueDate: "2024-01-15",
    },
  ],
}

const columns = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "inProgress", title: "In Progress", color: "bg-blue-100" },
  { id: "review", title: "Review", color: "bg-yellow-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

const teamMembers = [
  { name: "Alice Johnson", avatar: "AJ", role: "Designer" },
  { name: "Bob Smith", avatar: "BS", role: "Developer" },
  { name: "Carol Davis", avatar: "CD", role: "Developer" },
  { name: "David Wilson", avatar: "DW", role: "Backend Developer" },
  { name: "Eve Brown", avatar: "EB", role: "Technical Writer" },
  { name: "Frank Miller", avatar: "FM", role: "Project Manager" },
]

export default function ProjectDetailPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)

  const handleCreateTask = (newTask) => {
    const taskWithId = { ...newTask, id: Date.now() }
    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, taskWithId],
    }))
    setIsCreateTaskOpen(false)
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
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
          <h1 className="text-3xl font-bold tracking-tight">Website Redesign</h1>
          <p className="text-muted-foreground">Complete overhaul of the company website with modern design</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your project board.</DialogDescription>
              </DialogHeader>
              <TaskForm onSubmit={handleCreateTask} teamMembers={teamMembers} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Team:</span>
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 5).map((member, index) => (
              <Avatar key={index} className="h-8 w-8 border-2 border-background">
                <AvatarFallback>{member.avatar}</AvatarFallback>
              </Avatar>
            ))}
            {teamMembers.length > 5 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                +{teamMembers.length - 5}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Due: February 15, 2024</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary">{tasks[column.id]?.length || 0}</Badge>
            </div>
            <div className="space-y-3">
              {tasks[column.id]?.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleTaskClick(task)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium leading-tight">{task.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Move</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{task.assignee.avatar}</AvatarFallback>
                      </Avatar>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Due: {task.dueDate}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <DialogDescription>Task details and information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTask.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Assignee</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{selectedTask.assignee.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedTask.assignee.name}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <Badge className={`mt-1 ${getPriorityColor(selectedTask.priority)}`}>{selectedTask.priority}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTask.dueDate}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTaskDetailOpen(false)}>
                  Close
                </Button>
                <Button>Edit Task</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TaskForm({ onSubmit, teamMembers }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "Medium",
    dueDate: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const assigneeData = teamMembers.find((member) => member.name === formData.assignee)
    onSubmit({
      ...formData,
      assignee: assigneeData || {
        name: formData.assignee,
        avatar: formData.assignee
          .split(" ")
          .map((n) => n[0])
          .join(""),
      },
    })
    setFormData({
      title: "",
      description: "",
      assignee: "",
      priority: "Medium",
      dueDate: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Select
            value={formData.assignee}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, assignee: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.name} value={member.name}>
                  {member.name} - {member.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit">Create Task</Button>
      </DialogFooter>
    </form>
  )
}
