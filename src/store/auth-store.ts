import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginPayload, RegisterPayload } from '@/types/auth.types';
import { AuthRepository } from '@/repositories/auth.repository';
import { clearAuthCookies } from '@/lib/utils/cookies';
import Cookies from "js-cookie";
interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initializeAuth: () => {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");
        const user = Cookies.get("userDetails") ? JSON.parse(Cookies.get("userDetails")!) : null;
    
        if (accessToken && refreshToken && user) {
          set({
            accessToken,
            refreshToken,
            user,
            isAuthenticated: true,
          });
        }
      },

      // Login action
      login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        
        try {
          await AuthRepository.login({
            ...payload,
            onSuccess: (response) => {
              const { accessToken, refreshToken, userDetails } = response.data;

              setAuthCookies(accessToken, refreshToken, userDetails);
              
              set({
                user: userDetails,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            },
            onError: (message) => {
              set({
                error: message,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                accessToken: null,
                refreshToken: null,
              });
            },
          });
        } catch (error) {
          // Error already handled in onError callback
          console.error('Login error:', error);
        }
      },

      // Register action
      register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null });
        
        try {
          await AuthRepository.register({
            ...payload,
            onSuccess: (response) => {
                // After successful registration, you might want to automatically log them in
                // or just show success message and redirect to login
                set({
                    isLoading: false,
                    error: null,
                    // Optionally set user data if your API returns it after registration
                    user: response.data,
                });
            },
            onError: (message) => {
                set({
                    error: message,
                    isLoading: false,
                });
            },
          });
        } catch (error) {
            // Error already handled in onError callback
            console.error('Registration error:', error);
        }
      },

      // Logout action
      logout: async () => {
        try {
          await AuthRepository.logout(
            // onSuccess callback
            () => {
              clearAuthCookies();
              set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            },
            // onError callback
            (message) => {
              set({
                error: message,
                isLoading: false,
              });
            }
          );
        } catch (error) {
          // optional fallback
          console.error("Logout error:", error);
        }
      },

      // Clear error action
      clearError: () => {
        set({ error: null });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Update user data
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // Update tokens (useful for token refresh)
      updateTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
      },
    }),
    {
      name: 'auth-storage', // Storage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

function setAuthCookies(accessToken: string, refreshToken: string, userDetails?: User): void {
  Cookies.set('accessToken', accessToken, { expires: 0.0104, sameSite: "Lax" }); // 1 day expiry
  Cookies.set('refreshToken', refreshToken, { expires: 7, sameSite: "Lax" }); // 7 days expiry
  if (userDetails) {
    Cookies.set('userDetails', JSON.stringify(userDetails), { expires: 1 });
  }
}

// Selectors for easier access to specific state pieces
export const useAuth = () => {
  const {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
  } = useAuthStore();

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
  };
};

export const useAuthActions = () => {
  const {
    login,
    register,
    logout,
    clearError,
    setLoading,
    setUser,
    updateTokens,
  } = useAuthStore();

  return {
    login,
    register,
    logout,
    clearError,
    setLoading,
    setUser,
    updateTokens,
  };
};