import { apiClient } from "@/lib/api/config";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/types/auth.types";
import { AxiosError } from "axios";

class AuthRepo {
  async login({
    email,
    password,
    onSuccess,
    onError,
  }: LoginPayload & {
    onSuccess: (data: LoginResponse) => void;
    onError: (message: string) => void;
  }) {
    try {
      const { data } = await apiClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      onSuccess(data);
      return data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      onError(errorMessage);
      return null;
    }
  }

  async register({
    name,
    email,
    password,
    onSuccess,
    onError,
  }: RegisterPayload & {
    onSuccess: (data: RegisterResponse) => void;
    onError: (message: string) => void;
  }) {
    try {
      const { data } = await apiClient.post<RegisterResponse>("/auth/register", {
        name,
        email,
        password,
      });
      onSuccess(data);
      return data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      onError(errorMessage);
      return null;
    }
  }

  async logout(onSuccess: () => void, onError: (message: string) => void) {
    try {
      await apiClient.post("/auth/logout", {});
      onSuccess();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || error.message || "Logout failed";
      onError(errorMessage);
      return null;
    }
  }
}
export const AuthRepository = new AuthRepo();
