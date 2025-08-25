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
    // Also clear any other auth-related data that might be stored
    localStorage.removeItem('refreshToken');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      return token;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Emergency cleanup method for corrupted localStorage
  emergencyCleanup(): void {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      console.log('Emergency cleanup completed');
    } catch (error) {
      console.error('Error during emergency cleanup:', error);
    }
  }
}

export default new AuthService();
