import { create } from "zustand"
import { ProjectRepository } from "@/repositories/project.repository"
import { Project, CreateProjectDto, ProjectDetailResponse, CreateTaskDto, Task } from "@/types/project.types"

type ProjectStore = {
  projects: Project[]
  loading: boolean
  error: string | null
  fetchProjects: () => void
  addProject: (project: CreateProjectDto) => Promise<void>
  updateProject: (id: string, project: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  fetchProjectDetails: (id: string) => Promise<ProjectDetailResponse | null>
  addTask: (projectId: string, payload: CreateTaskDto) => Promise<void>
  setProjects: (data: Project[]) => void

  setError: (message: string | null) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  error: null,
  setProjects: (data) => set({ projects: data }),
  setError: (message) => set({ error: message }),

  fetchProjects: async () => {
    set({ loading: true })
    await ProjectRepository.getAllProjects({
      onSuccess: (res) => {
        set({ projects: res.data, loading: false })
      },
      onError: (msg) => {
        set({ error: msg, loading: false })
      },
    })
  },

  addProject: async (project: CreateProjectDto) => {
    set({ loading: true })
    await ProjectRepository.createProject(
      project,
      (newProject: Project) => {
        set((state) => ({
          projects: [...state.projects, newProject],
          loading: false,
          error: null,
        }))
      },
      (msg: string) => {
        set({ error: msg, loading: false })
      }
    )
  },

  updateProject: async (id: string, project: Partial<Project>) => {
    set({ loading: true })
    await ProjectRepository.updateProject(
      id,
      project,
      (updatedProject: Project) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
          loading: false,
          error: null,
        }))
      },
      (msg: string) => {
        set({ error: msg, loading: false })
      }
    )
  },

  deleteProject: async (id: string) => {
    set({ loading: true })
    await ProjectRepository.deleteProject(
      id,
      () => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          loading: false,
          error: null,
        }))
      },
      (msg: string) => {
        set({ error: msg, loading: false })
      }
    )
  },

  fetchProjectDetails: async (id: string) => {
    set({ loading: true })
    try {
      let response: ProjectDetailResponse | null = null
      await ProjectRepository.getProjectDetails(
        id,
        (res: ProjectDetailResponse) => {
          response = res
          set((state) => ({
            projects: state.projects.some((p) => p.id === id)
              ? state.projects.map((p) => (p.id === id ? res.data.project : p))
              : [...state.projects, res.data.project],
            loading: false,
            error: null,
          }))
        },
        (msg: string) => {
          set({ error: msg, loading: false })
        }
      )
      return response
    } catch (err) {
      set({ error: "Failed to fetch project details:" + err, loading: false })
      return null
    }
  },

  addTask: async (projectId: string, payload: CreateTaskDto) => {
    set({ loading: true })
    await ProjectRepository.createTask(
      projectId,
      payload,
      (createdTask: Task) => {
        console.log("Created task:", createdTask)
        // Use the task to update local state if needed
        set({ loading: false, error: null })
      },
      (msg: string) => {
        set({ error: msg, loading: false })
      }
    )
  },
}))