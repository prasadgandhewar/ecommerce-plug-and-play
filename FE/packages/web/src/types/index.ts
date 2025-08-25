// Product types - Updated to match new backend DTOs
export interface ProductSpecifications {
  connectivity?: string;
  batteryLifeHours?: number;
  noiseCancellation?: boolean;
  colorOptions?: string[];
  weight?: string;
  dimensions?: string;
  warranty?: string;
  material?: string;
  additionalSpecs?: Record<string, any>;
}

export interface ProductVariation {
  sku: string;
  color?: string;
  size?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface ProductReview {
  userId: string;
  rating: number;
  comment?: string;
  date: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
}

export interface Product {
  id: string; // MongoDB ObjectId
  sku: string;
  name: string;
  description?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  price: number;
  currency: string;
  stockQuantity: number;
  images: string[]; // Array of image URLs
  specifications?: ProductSpecifications;
  variations?: ProductVariation[];
  reviews?: ProductReview[];
  isActive: boolean;
  averageRating?: number;
  totalReviews?: number;
  totalStock?: number;
  mainImageUrl?: string; // Computed field from backend
  createdAt: string;
  updatedAt: string;
  
  // Computed frontend properties for backward compatibility
  imageUrl?: string; // Will be set to mainImageUrl or first image
  inStock?: boolean; // Computed from stockQuantity > 0
  rating?: number; // Alias for averageRating
  reviewCount?: number; // Alias for totalReviews
}

// Product request for creating/updating products
export interface ProductRequest {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  price: number;
  currency?: string;
  stockQuantity: number;
  images?: string[];
  specifications?: ProductSpecifications;
  variations?: ProductVariation[];
  isActive?: boolean;
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

// Cart types - Updated to support variations
export interface CartItem {
  id: number; // Cart item ID from backend
  productId: string; // MongoDB Product ID
  variationSku?: string; // Optional variation SKU
  quantity: number;
  createdAt: string;
  product?: Product; // Product details populated by backend
  selectedVariation?: ProductVariation; // Selected variation details
  
  // Computed properties for UI
  name?: string; // From product.name
  price?: number; // From product.price or variation.price
  imageUrl?: string; // From product.mainImageUrl or variation.imageUrl
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

// Filter types - Updated to match new backend API
export interface ProductFilters {
  category?: string;
  subCategory?: string;
  brand?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  query?: string; // For search
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
