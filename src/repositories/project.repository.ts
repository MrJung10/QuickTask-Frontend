import { apiClient } from "@/lib/api/config"
import { Project, ProjectListResponse, CreateProjectDto, ProjectDetailResponse, Task, CreateTaskDto, TaskStatus } from "@/types/project.types"
import { AxiosError } from "axios"

class ProjectRepo {
  constructor() {}

  async getAllProjects({
    onSuccess,
    onError,
  }: {
    onSuccess: (data: ProjectListResponse) => void
    onError: (message: string) => void
  }) {
    try {
      const { data } = await apiClient.get<ProjectListResponse>("/project")
      onSuccess(data)
      return data
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
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      onError(err.response?.data?.message || "Failed to create project");
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
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      onError(err.response?.data?.message || "Failed to update project");
    }
  }

  async deleteProject(id: string, onSuccess: () => void, onError: (message: string) => void) {
    try {
      await apiClient.delete(`/project/${id}`)
      onSuccess()
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      onError(err.response?.data?.message || "Failed to delete project");
    }
  }

  async getProjectDetails(
    id: string,
    onSuccess: (data: ProjectDetailResponse) => void,
    onError: (message: string) => void
  ) {
    try {
      const { data } = await apiClient.get<ProjectDetailResponse>(`/project/${id}`)
      onSuccess(data)
      return data
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      onError(err.response?.data?.message || "Failed to fetch project details")
    }
  }

  async createTask(
    projectId: string,
    payload: CreateTaskDto,
    onSuccess: (data: Task) => void,
    onError: (message: string) => void
  ) {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: Task }>(`/projects/${projectId}/tasks`, payload)
      onSuccess(data.data)
      return data.data
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      onError(err.response?.data?.message || "Failed to create task")
    }
  }

  async updateTask(
    projectId: string,
    taskId: string,
    payload: Partial<CreateTaskDto>,
    onSuccess: (data: Task) => void,
    onError: (message: string) => void
  ) {
    try {
      const { data } = await apiClient.put<{ success: boolean; data: Task }>(`/projects/${projectId}/tasks/${taskId}`, payload);
      onSuccess(data.data);
      return data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      onError(err.response?.data?.message || "Failed to update task");
    }
  }

  async updateTaskStatus(
    projectId: string,
    taskId: string,
    status: TaskStatus,
    onSuccess: (data: Task) => void,
    onError: (message: string) => void
  ) {
    try {
      const { data } = await apiClient.patch<{ success: boolean; data: Task }>(`/projects/${projectId}/tasks/${taskId}/status`, { status });
      onSuccess(data.data);
      return data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      onError(err.response?.data?.message || "Failed to update task status");
    }
  }

  async deleteTask(
    projectId: string,
    taskId: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ) {
    try {
      await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
      onSuccess();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      onError(err.response?.data?.message || "Failed to delete task");
    }
  }
}

export const ProjectRepository = new ProjectRepo();