import { create } from "zustand";
import { UserRepository } from "@/repositories/user.repository";
import { MemberListResponse, Members } from "@/types/user.types";

interface UserStoreState {
    members: Members[];
    loading: boolean;
    error: string | null;
    fetchMembers: () => Promise<void>;
}

export const useUserStore = create<UserStoreState>((set) => ({
    members: [],
    loading: false,
    error: null,
  
    fetchMembers: async () => {
      set({ loading: true, error: null });
  
      await UserRepository.getAllMembers({
        onSuccess: (data: MemberListResponse) => {
          set({ members: data.data, loading: false });
        },
        onError: (message: string) => {
          set({ error: message, loading: false });
        },
      });
    },
  }));