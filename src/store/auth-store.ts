import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginPayload, RegisterPayload } from '@/types/auth.types';
import { AuthRepository } from '@/repositories/auth.repository';
import { clearAuthCookies, setAuthCookies } from '@/lib/utils/cookies';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
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

      // Login action
      login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        
        try {
          await AuthRepository.login({
            ...payload,
            onSuccess: (response) => {
              const { accessToken, refreshToken, userDetails } = response.data;

              setAuthCookies(accessToken, refreshToken);
              
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