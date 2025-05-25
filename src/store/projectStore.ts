import { create } from "zustand"
import { Project } from "@/types/project.types"
import { ProjectRepository } from "@/repositories/project.repository"

type ProjectStore = {
  projects: Project[]
  loading: boolean
  error: string | null

  fetchProjects: () => Promise<void>
  addProject: (payload: Partial<Project>) => Promise<void>
  updateProject: (id: string, payload: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>

  setProjects: (data: Project[]) => void
  setError: (message: string | null) => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
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

  addProject: async (payload) => {
    set({ loading: true })
    await ProjectRepository.createProject(
      payload,
      (created) => {
        set((state) => ({ projects: [created, ...state.projects], loading: false }))
      },
      (msg) => {
        set({ error: msg, loading: false })
      }
    )
  },

  updateProject: async (id, payload) => {
    set({ loading: true })
    await ProjectRepository.updateProject(
      id,
      payload,
      (updated) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? updated : p)),
          loading: false,
        }))
      },
      (msg) => {
        set({ error: msg, loading: false })
      }
    )
  },

  deleteProject: async (id) => {
    set({ loading: true })
    await ProjectRepository.deleteProject(
      id,
      () => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          loading: false,
        }))
      },
      (msg) => {
        set({ error: msg, loading: false })
      }
    )
  },
}))
