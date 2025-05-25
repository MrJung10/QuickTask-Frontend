import { apiClient } from "@/lib/api/config";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/types/auth.types";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

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
      throw err;
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
      throw err;
    }
  }

  async logout(onSuccess: () => void, onError: (message: string) => void) {
    try {
      // const token = Cookies.get("accessToken");
      // console.log('token', token);

      await apiClient.post("/auth/logout", {});
      onSuccess();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || error.message || "Logout failed";
      onError(errorMessage);
      throw err;
    }
  }
}
export const AuthRepository = new AuthRepo();
