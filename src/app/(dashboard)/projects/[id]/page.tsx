"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
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
import { CalendarDays, MoreHorizontal, Plus, Users, Loader2, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProjectStore } from "@/store/projectStore"
import { Task, ProjectMember, CreateTaskDto, TaskStatus, Priority } from "@/types/project.types"

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: TaskStatus.TODO, title: "To Do", color: "bg-gray-100" },
  { id: TaskStatus.IN_PROGRESS, title: "In Progress", color: "bg-blue-100" },
  { id: TaskStatus.REVIEW, title: "Review", color: "bg-yellow-100" },
  { id: TaskStatus.DONE, title: "Done", color: "bg-green-100" },
]

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { projects, loading, error, fetchProjects, fetchProjectDetails } = useProjectStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const project = projects.find((p) => p.id === id) || null

  useEffect(() => {
    const fetchData = async () => {
      if (!projects.length && !hasFetched) {
        setHasFetched(true)
        await fetchProjects()
      }
      if (project && !hasFetched) {
        setHasFetched(true)
        try {
          const response = await fetchProjectDetails(id as string)
          if (response) {
            setTasks(response.data.tasks)
            setFetchError(null)
          }
        } catch (err) {
          setFetchError("Failed to fetch project details")
          console.error(err)
        }
      }
    }
    fetchData()
  }, [id, projects.length, project, fetchProjects, fetchProjectDetails, hasFetched])

  const handleCreateTask = async (newTask: CreateTaskDto) => {
    const assignee = project?.members.find((m) => m.id === newTask.assigneeId)
    if (!assignee || !project) {
      setFetchError("Invalid assignee or project")
      return
    }
    try {
      await useProjectStore.getState().addTask(project.id, newTask)
      const response = await fetchProjectDetails(project.id)
      if (response) {
        setTasks(response.data.tasks)
        setFetchError(null)
      }
      setIsCreateTaskOpen(false)
    } catch (err) {
      setFetchError("Failed to create task")
      console.error(err)
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL:
        return "bg-purple-100 text-purple-800"
      case Priority.HIGH:
        return "bg-red-100 text-red-800"
      case Priority.MEDIUM:
        return "bg-yellow-100 text-yellow-800"
      case Priority.LOW:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading project...</span>
      </div>
    )
  }

  if (error || fetchError || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-600">{error || fetchError || "Project not found"}</span>
        <Button variant="outline" className="ml-4" onClick={fetchProjects}>
          Retry
        </Button>
      </div>
    )
  }

  const groupedTasks: Record<TaskStatus, Task[]> = {
    [TaskStatus.TODO]: tasks.filter((t) => t.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.REVIEW]: tasks.filter((t) => t.status === TaskStatus.REVIEW),
    [TaskStatus.DONE]: tasks.filter((t) => t.status === TaskStatus.DONE),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
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
              <TaskForm onSubmit={handleCreateTask} teamMembers={project.members} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Team:</span>
          <div className="flex -space-x-2">
            {project.members.slice(0, 5).map((member, index) => (
              <Avatar key={index} className="h-8 w-8 border-2 border-background">
                <AvatarFallback>{member.shortName}</AvatarFallback>
              </Avatar>
            ))}
            {project.totalMembers > 5 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                +{project.totalMembers - 5}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Due: {formatDate(project.deadline)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary">{groupedTasks[column.id].length}</Badge>
            </div>
            <div className="space-y-3">
              {groupedTasks[column.id].map((task) => (
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
                        <AvatarFallback className="text-xs">{task.assignee.shortName}</AvatarFallback>
                      </Avatar>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Due: {formatDate(task.dueDate)}</div>
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
                        <AvatarFallback className="text-xs">{selectedTask.assignee.shortName}</AvatarFallback>
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
                  <p className="text-sm text-muted-foreground mt-1">{formatDate(selectedTask.dueDate)}</p>
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

function TaskForm({ onSubmit, teamMembers }: { onSubmit: (task: CreateTaskDto) => void; teamMembers: ProjectMember[] }) {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: "",
    description: "",
    assigneeId: "",
    priority: Priority.MEDIUM,
    dueDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: "",
      description: "",
      assigneeId: "",
      priority: Priority.MEDIUM,
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
            value={formData.assigneeId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, assigneeId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name} - {member.projectRole}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: Priority.LOW | Priority.MEDIUM | Priority.HIGH) =>
              setFormData((prev) => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Priority.LOW}>Low</SelectItem>
              <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
              <SelectItem value={Priority.HIGH}>High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value || null }))}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit">Create Task</Button>
      </DialogFooter>
    </form>
  )
}