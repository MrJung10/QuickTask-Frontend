export interface ProjectMember {
    id: string;
    name: string;
    shortName: string;
    email: string;
    userRole: string;
    projectRole: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    totalMembers: number;
    startDate: string;
    deadline: string;
    createAt: string;
    updatedAt: string;
    members: ProjectMember[];
}

export interface ProjectListResponse {
    success: boolean;
    message: string;
    data: Project[];
}

export interface CreateProjectDto {
    name: string;
    description: string;
    startDate?: string;
    deadline?: string;
    members: {
      userId: string;
      role: 'ADMIN' | 'MEMBER';
    }[];
  }