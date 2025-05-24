export type UserRole = 'ADMIN' | 'MEMBER';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Register
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

// Login
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userDetails: User;
  };
}
