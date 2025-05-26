import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginPayload, RegisterPayload, LoginResponse, RegisterResponse } from '@/types/auth.types';
import { AuthRepository } from '@/repositories/auth.repository';
import { clearAuthCookies } from '@/lib/utils/cookies';
import Cookies from "js-cookie";
import { toast } from 'sonner';

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
            onSuccess: (response: LoginResponse) => {
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

              toast.success(response.message || 'Login successful');
            },
            onError: (message: string) => {
              set({
                error: message,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                accessToken: null,
                refreshToken: null,
              });

              toast.error(message || 'Login failed. Please try again.');
            },
          });
        } catch (error) {
          // Avoid duplicate toats; onError already handled the error
          console.error('Login error:', error);
          if (!useAuthStore.getStore().error) {
            toast.error('An unexpected error occurred. Please try again.');
          }
        }
      },

      // Register action
      register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null });
        
        try {
          await AuthRepository.register({
            ...payload,
            onSuccess: (response: RegisterResponse) => {
                set({
                    isLoading: false,
                    error: null,
                    user: response.data,
                });

                toast.success(response.message || 'Registration successful. Please login.');
            },
            onError: (message: string) => {
                set({
                    error: message,
                    isLoading: false,
                });

                toast.error(message || 'Registration failed. Please try again.');
            },
          });
        } catch (error) {
          if (!useAuthStore.getStore().error) {
            console.error('Registration error:', error);
            toast.error('An unexpected error occurred during registration. Please try again.');
          }
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

              toast.success('Logged out successfully.');
            },
            // onError callback
            (message) => {
              set({
                error: message,
                isLoading: false,
              });

              toast.error(message || 'Logout failed. Please try again.');
            }
          );
        } catch (error) {
          if (!useAuthStore.getStore().error) {
            console.error("Logout error:", error);
            toast.error('An unexpected error occurred during logout. Please try again.');
          }
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
  Cookies.set('accessToken', accessToken, { expires: 1, sameSite: "Lax" }); // 1 day expiry
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