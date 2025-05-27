import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from "js-cookie";

// Only routes that genuinely don't need auth
const noAuthRoutes = ['/auth/login', '/auth/register'];

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + "/api",
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const isNoAuthRoute = noAuthRoutes.some((route) =>
            config.url?.includes(route)
        );
        if (!isNoAuthRoute) {
            const token = Cookies.get("accessToken");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

type RequestData = Record<string, unknown> | FormData | URLSearchParams | undefined;

export const apiClient = {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return axiosInstance.get<T>(url, config);
    },
    post: <T = unknown>(url: string, data?: RequestData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return axiosInstance.post<T>(url, data, config);
    },
    put: <T = unknown>(url: string, data?: RequestData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return axiosInstance.put<T>(url, data, config);
    },
    delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return axiosInstance.delete<T>(url, config);
    },
    patch: <T = unknown>(url: string, data?: RequestData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return axiosInstance.patch<T>(url, data, config);
    },
};