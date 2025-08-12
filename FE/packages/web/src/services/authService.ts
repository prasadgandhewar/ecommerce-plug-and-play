import api from './api';
import { API_CONFIG, createApiMethod } from '../config/apiConfig';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

class AuthService {
  // Create endpoint builders for each auth endpoint
  private readonly endpoints = {
    login: createApiMethod.post(API_CONFIG.AUTH.LOGIN),
    register: createApiMethod.post(API_CONFIG.AUTH.REGISTER),
    profile: createApiMethod.get(API_CONFIG.AUTH.PROFILE),
  };

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const endpoint = this.endpoints.login();
    const response = await api.post(endpoint, credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const endpoint = this.endpoints.register();
    const response = await api.post(endpoint, userData);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export default new AuthService();
