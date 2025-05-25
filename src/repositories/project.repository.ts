import { apiClient } from "@/lib/api/config";
import { Project, ProjectListResponse, CreateProjectDto } from "@/types/project.types";

class ProjectRepo {
    constructor() {}

    async getAllProjects({ onSuccess, onError } : { onSuccess: (data: ProjectListResponse) => void; onError: (message: string) => void }) {
        try {
            const { data } = await apiClient.get<ProjectListResponse>("/project");
            onSuccess(data);
            return data;
        } catch (error) {
            const errorMessage = (error as ErrorEvent).message || "Project list retrieval failed";
            onError(errorMessage);
        }
    }

    async createProject(
        payload: CreateProjectDto,
        onSuccess: (data: Project) => void,
        onError: (message: string) => void
      ) {
        try {
          const { data } = await apiClient.post<{ success: boolean; data: Project }>("/project", payload)
          onSuccess(data.data)
          return data.data
        } catch (error: any) {
          onError(error?.response?.data?.message || "Failed to create project")
        }
      }
    
      async updateProject(
        id: string,
        payload: Partial<Project>,
        onSuccess: (data: Project) => void,
        onError: (message: string) => void
      ) {
        try {
          const { data } = await apiClient.put<{ success: boolean; data: Project }>(`/project/${id}`, payload)
          onSuccess(data.data)
          return data.data
        } catch (error: any) {
          onError(error?.response?.data?.message || "Failed to update project")
        }
      }
    
      async deleteProject(
        id: string,
        onSuccess: () => void,
        onError: (message: string) => void
      ) {
        try {
          await apiClient.delete(`/project/${id}`)
          onSuccess()
        } catch (error: any) {
          onError(error?.response?.data?.message || "Failed to delete project")
        }
      }
}

export const ProjectRepository = new ProjectRepo();