  export interface DashboardStats {
    ongoingProjectCount: number;
    activeTaskCount: number;
    totalTeamMembers: number;
  }
  
  export interface OngoingProject {
    id: string;
    name: string;
    description: string;
    deadline: string;
    memberCount: number;
  }
  
  export interface TaskStatusCounts {
    IN_PROGRESS: number;
    TODO: number;
    REVIEW: number;
    DONE: number;
  }
  
  export interface DashboardData {
    stats: DashboardStats;
    ongoingProjects: OngoingProject[];
    taskStatusCounts: TaskStatusCounts;
  }
  
  export interface DashboardApiResponse {
    success: boolean;
    message: string;
    data: DashboardData;
  }