import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
}

interface JwtPayload {
  user_id: number;
  email: string;
  first_name?: string;
}

const AUTH_API_URL = "http://" + API_URL + "/api";

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${AUTH_API_URL}/token/`, credentials);
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
    }
    return response.data;
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${AUTH_API_URL}/token/refresh/`, {
      refresh: refreshToken,
    });
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
    }
    return response.data.access;
  },

  async resetPasswordLink(email: string): Promise<void> {
    await axios.post(`${AUTH_API_URL}/password_reset/`, { email });
  },

  async confirmResetPassword(
    uidb64: string,
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    await axios.post(
      `${AUTH_API_URL}/password_reset_confirm/${uidb64}/${token}/`,
      {
        password: newPassword,
        password2: confirmPassword,
      }
    );
  },

  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getCurrentUser(): JwtPayload | null {
    const token = this.getAccessToken();
    if (token) {
      try {
        return jwtDecode<JwtPayload>(token);
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  },

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.user_id : null;
  },
};
