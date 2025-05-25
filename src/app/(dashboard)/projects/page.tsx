"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import { AlertCircle, CalendarDays, Loader2, MoreHorizontal, Plus, Search, X } from "lucide-react"
import { Project, CreateProjectDto } from "@/types/project.types"
import { useProjectStore } from "@/store/projectStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { Textarea } from "@/components/ui/textarea"
import { useUserStore } from "@/store/userStore"
import { Members } from "@/types/user.types"


// Extend Members with projectRole
interface ProjectFormMember extends Members {
  projectRole: string;
}

// Helper function to format date as YYYY-MM-DD HH:mm:ss
const formatDateTime = (date?: string): string => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} 05:45:00`;
}

// Helper function to calculate project status based on dates and completion
const calculateProjectStatus = (project: Project): string => {
  const now = new Date()
  const deadline = new Date(project.deadline)
  const startDate = new Date(project.startDate)
  
  if (now > deadline) {
    return "Overdue"
  } else if (now < startDate) {
    return "Not Started"
  } else {
    return "In Progress"
  }
}

// Helper function to calculate project priority based on deadline proximity
const calculateProjectPriority = (project: Project): string => {
  const now = new Date()
  const deadline = new Date(project.deadline)
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilDeadline < 0) {
    return "Critical"
  } else if (daysUntilDeadline <= 7) {
    return "High"
  } else if (daysUntilDeadline <= 30) {
    return "Medium"
  } else {
    return "Low"
  }
}

interface ProjectFormProps {
  onSubmit: (projectData: CreateProjectDto) => void;
  teamMembers: Members[];
  initialData?: Project;
  isEditMode?: boolean;
}

export default function ProjectsPage() {
  const { projects, loading, error, fetchProjects, deleteProject, addProject, updateProject } = useProjectStore();
  const { members, fetchMembers } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchMembers();
  }, [fetchProjects, fetchMembers]);

  const filteredProjects = projects.filter((project) => {
    const projectStatus = calculateProjectStatus(project);
    const projectPriority = calculateProjectPriority(project);

    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || projectStatus === statusFilter;
    const matchesPriority = priorityFilter === "all" || projectPriority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      case "Review":
        return "bg-purple-100 text-purple-800";
      case "Done":
        return "bg-green-100 text-green-800";
      case "Not Started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProjectColor = (index: number): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-cyan-500",
      "bg-red-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[index % colors.length];
  };

  const handleCreateProject = async (projectData: CreateProjectDto) => {
    try {
      // Format dates for create
      const formattedData = {
        ...projectData,
        startDate: formatDateTime(projectData.startDate),
        deadline: formatDateTime(projectData.deadline),
      };
      await addProject(formattedData);
      setIsCreateModalOpen(false);
      setCreateError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create project";
      setCreateError(errorMessage);
      console.error("Failed to create project:", error);
    }
  };

  const handleUpdateProject = async (projectData: CreateProjectDto) => {
    if (!editingProject) return;
    try {
      // Transform projectData to match backend payload
      const updateData: Partial<Project> = {
        name: projectData.name,
        description: projectData.description,
        startDate: formatDateTime(projectData.startDate),
        deadline: formatDateTime(projectData.deadline),
        members: projectData.members.map((m) => {
          // Find full member data from members or editingProject.members
          const member = members.find((mem) => mem.id === m.userId) || 
                        editingProject.members.find((mem) => mem.id === m.userId);
          if (!member) {
            throw new Error(`Member with ID ${m.userId} not found`);
          }
          return {
            id: m.userId,
            name: member.name,
            shortName: member.shortName,
            email: member.email,
            role: m.role,
            // userRole: m.role,
            // projectRole: m.role,
          };
        }),
      };
      await updateProject(editingProject.id, updateData);
      setIsEditModalOpen(false);
      setEditingProject(null);
      setCreateError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update project";
      setCreateError(errorMessage);
      console.error("Failed to update project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(projectId);
        setCreateError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete project";
        setCreateError(errorMessage);
        console.error("Failed to delete project:", error);
      }
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  // Calculate statistics
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter((p) => calculateProjectStatus(p) === "In Progress").length;
  const completedProjects = projects.filter((p) => calculateProjectStatus(p) === "Completed").length;
  const overdueProjects = projects.filter((p) => calculateProjectStatus(p) === "Overdue").length;
  const totalMembers = projects.reduce((sum, project) => sum + project.totalMembers, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-600">{error}</span>
        <Button variant="outline" className="ml-4" onClick={fetchProjects}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {createError && (
        <div className="flex items-center justify-center p-4 bg-red-100 text-red-800 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{createError}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your projects in one place.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your workspace with team members and roles.</DialogDescription>
            </DialogHeader>
            <ProjectForm onSubmit={handleCreateProject} teamMembers={members} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Project Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open);
        if (!open) setEditingProject(null);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details and team members.</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              onSubmit={handleUpdateProject}
              teamMembers={members}
              initialData={editingProject}
              isEditMode={true}
            />
          )}
        </DialogContent>
      </Dialog>

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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Start Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => {
                  const status = calculateProjectStatus(project);
                  const priority = calculateProjectPriority(project);
                  
                  return (
                    <tr key={project.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getProjectColor(index)}`} />
                          <div className="min-w-0">
                            <Link href={`/projects/${project.id}`} className="font-medium hover:underline block truncate">
                              {project.name}
                            </Link>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(status)}>{status}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getPriorityColor(priority)}>{priority}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {project.members.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="text-xs">{member.shortName}</AvatarFallback>
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
                        {project.startDate ? (
                          <div className="flex items-center space-x-1">
                            <CalendarDays className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(project.startDate)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">---</span>
                        )}
                      </td>
                      <td className="p-4">
                        {project.deadline ? (
                          <div className="flex items-center space-x-1">
                            <CalendarDays className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(project.deadline)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">---</span>
                        )}
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
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/${project.id}/team`}>Manage Team</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
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
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
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
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressProjects} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
              completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueProjects}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProjectForm({ onSubmit, teamMembers, initialData, isEditMode = false }: ProjectFormProps) {
  const { members } = useUserStore();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate.split(" ")[0] || "",
    deadline: initialData?.deadline.split(" ")[0] || "",
    members: initialData?.members || [],
  });

  // const [selectedMembers, setSelectedMembers] = useState<Members[]>(
  const [selectedMembers, setSelectedMembers] = useState<ProjectFormMember[]>(
    initialData?.members.map((m) => {
      // Find full member data from members
      const member = members.find((mem) => mem.id === m.id) || {
        id: m.id,
        name: m.name,
        shortName: m.shortName,
        email: m.email,
        role: m.projectRole,
        registeredAt: "",
        projectMemberships: [],
      };
      return {
        id: member.id,
        name: member.name,
        shortName: member.shortName,
        email: member.email,
        // role: member.role,
        registeredAt: member.registeredAt,
        projectMemberships: member.projectMemberships,
        projectRole: m.role || "MEMBER",
      };
    }) || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const projectData: CreateProjectDto = {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      deadline: formData.deadline,
      members: selectedMembers.map((member) => ({
        userId: member.id,
        role: member.projectRole as "ADMIN" | "MEMBER",
      })),
    };

    onSubmit(projectData);

    if (!isEditMode) {
      setFormData({
        name: "",
        description: "",
        startDate: "",
        deadline: "",
        members: [],
      });
      setSelectedMembers([]);
    }
  }

  const handleMemberToggle = (member: Members, checked: boolean) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, { ...member, projectRole: "MEMBER" }]);
    } else {
      setSelectedMembers((prev) => prev.filter((m) => m.id !== member.id));
    }
  };

  const handleRoleChange = (id: string, newRole: string) => {
    setSelectedMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, projectRole: newRole } : member))
    );
  };

  const removeMember = (id: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your project"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">End Date *</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Team Members</Label>

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Members ({selectedMembers.length})</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                {selectedMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{member.shortName}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{member.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={member.projectRole} onValueChange={(value) => handleRoleChange(member.id, value)}>
                        <SelectTrigger className="w-24 h-7">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MEMBER">Member</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                        className="h-7 w-7 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Members */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Available Team Members</Label>
            <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
              {teamMembers?.length ? (
                teamMembers.map((member) => {
                  const isSelected = selectedMembers.some((m) => m.id === member.id);
                  return (
                    <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md">
                      <Checkbox checked={isSelected} onCheckedChange={(checked) => handleMemberToggle(member, !!checked)} />
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.shortName}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">No members available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={!formData.name || !formData.description || !formData.startDate || !formData.deadline}
        >
          {isEditMode ? "Update Project" : "Create Project"}
        </Button>
      </DialogFooter>
    </form>
  )
}