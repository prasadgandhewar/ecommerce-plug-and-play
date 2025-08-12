// Product types - Updated to match backend DTOs
export interface Product {
  id: number; // Changed from string to number to match backend
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  stockQuantity: number; // Added to match backend
  isActive: boolean; // Added to match backend
  createdAt: string; // Added to match backend
  updatedAt: string; // Added to match backend
  // Optional fields for frontend compatibility
  inStock?: boolean; // Computed from stockQuantity > 0
  rating?: number;
  reviewCount?: number;
}

// Product request for creating/updating products
export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
}

// Paginated response from backend
export interface PaginatedProductResponse {
  content: Product[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Cart types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Filter types - Updated to match backend API
export interface ProductFilters {
  category?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  name?: string; // For search
  minPrice?: number;
  maxPrice?: number;
}

// Search types
export interface SearchParams {
  query?: string;
  filters?: ProductFilters;
  page?: number;
  limit?: number;
}
