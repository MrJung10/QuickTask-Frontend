export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface ProjectMember {
    id: string;
    name: string;
    shortName: string;
    email: string;
    role: string;
    userRole?: string;
    projectRole?: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    totalMembers: number;
    startDate: string;
    deadline: string;
    createAt: string;
    updatedAt?: string;
    members: ProjectMember[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    dueDate: string | null;
    assignee: ProjectMember;
  }

export interface ProjectListResponse {
    success: boolean;
    message: string;
    data: Project[];
}

export interface ProjectDetailResponse {
    success: boolean;
    message: string;
    data: {
      project: Project;
      tasks: Task[];
    };
  }

export interface CreateProjectDto extends Record<string, unknown> {
    name: string;
    description: string;
    startDate?: string;
    deadline?: string;
    members: {
      userId: string;
      role: 'ADMIN' | 'MEMBER';
    }[];
}

export interface CreateTaskDto extends Record<string, unknown> {
    title: string;
    description: string;
    priority: Priority.LOW | Priority.MEDIUM | Priority.HIGH;
    dueDate: string | null;
    assigneeId: string;
    status?: TaskStatus
}