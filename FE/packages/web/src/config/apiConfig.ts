// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8090/api',
  
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Product endpoints - Updated to match backend exactly
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
    SEARCH: '/products/search',
    CATEGORY: '/products/category/:category',
    PRICE_RANGE: '/products/price-range',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    CATEGORIES: '/products/categories', // For future backend implementation
  },
  
  // Cart endpoints
  CART: {
    LIST: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove/:id',
    CLEAR: '/cart/clear',
    COUNT: '/cart/count',
  },
  
  // Order endpoints
  ORDERS: {
    LIST: '/orders',
    DETAIL: '/orders/:id',
    CREATE: '/orders',
    UPDATE: '/orders/:id',
    CANCEL: '/orders/:id/cancel',
    HISTORY: '/orders/history',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
    ADDRESSES: '/users/addresses',
    ADD_ADDRESS: '/users/addresses',
    UPDATE_ADDRESS: '/users/addresses/:id',
    DELETE_ADDRESS: '/users/addresses/:id',
  },
} as const;

// Redux Action Types - Centralized action type constants for createAsyncThunk
export const REDUX_ACTION_TYPES = {
  // Auth actions
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    LOGOUT: 'auth/logout',
  },
  
  // Product actions
  PRODUCTS: {
    FETCH_PRODUCTS: 'products/fetchProducts',
    FETCH_PRODUCT_BY_ID: 'products/fetchProductById',
    SEARCH_PRODUCTS: 'products/searchProducts',
    FETCH_BY_CATEGORY: 'products/fetchProductsByCategory',
    FETCH_BY_PRICE_RANGE: 'products/fetchProductsByPriceRange',
    CREATE_PRODUCT: 'products/createProduct',
    UPDATE_PRODUCT: 'products/updateProduct',
    DELETE_PRODUCT: 'products/deleteProduct',
    FETCH_CATEGORIES: 'products/fetchCategories',
  },
  
  // Cart actions
  CART: {
    ADD_TO_CART: 'cart/addToCartAsync',
    REMOVE_FROM_CART: 'cart/removeFromCartAsync',
    UPDATE_CART_ITEM: 'cart/updateCartItemAsync',
    FETCH_CART: 'cart/fetchCartAsync',
    CLEAR_CART: 'cart/clearCartAsync',
  },
  
  // Order actions (for future use)
  ORDERS: {
    FETCH_ORDERS: 'orders/fetchOrders',
    FETCH_ORDER_BY_ID: 'orders/fetchOrderById',
    CREATE_ORDER: 'orders/createOrder',
    UPDATE_ORDER: 'orders/updateOrder',
    CANCEL_ORDER: 'orders/cancelOrder',
  },
  
  // User actions (for future use)
  USERS: {
    FETCH_PROFILE: 'users/fetchProfile',
    UPDATE_PROFILE: 'users/updateProfile',
    FETCH_ADDRESSES: 'users/fetchAddresses',
    ADD_ADDRESS: 'users/addAddress',
    UPDATE_ADDRESS: 'users/updateAddress',
    DELETE_ADDRESS: 'users/deleteAddress',
  },
} as const;

// Helper function to replace path parameters
export const buildEndpoint = (endpoint: string, params: Record<string, string | number> = {}): string => {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value.toString());
  });
  return url;
};

// Helper function to build query parameters
export const buildQueryParams = (params: Record<string, any> = {}): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Helper function to build full URL with query parameters
export const buildFullUrl = (endpoint: string, pathParams: Record<string, string | number> = {}, queryParams: Record<string, any> = {}): string => {
  const baseUrl = buildEndpoint(endpoint, pathParams);
  const queryString = buildQueryParams(queryParams);
  return `${baseUrl}${queryString}`;
};

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    API_BASE_URL: 'http://localhost:8090/api',
    TIMEOUT: 30000,
    DEBUG: true,
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://your-production-api.com/api',
    TIMEOUT: 10000,
    DEBUG: false,
  },
  staging: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://your-staging-api.com/api',
    TIMEOUT: 15000,
    DEBUG: true,
  },
};

// Get current environment configuration
export const getCurrentEnvConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development;
};

// Type definitions for API endpoints
export type ApiEndpoint = string;
export type PathParams = Record<string, string | number>;
export type QueryParams = Record<string, any>;

// API Service utilities for consistent endpoint handling
export class ApiEndpointBuilder {
  static build(endpoint: ApiEndpoint, pathParams?: PathParams, queryParams?: QueryParams): string {
    return buildFullUrl(endpoint, pathParams, queryParams);
  }
  
  static buildPath(endpoint: ApiEndpoint, pathParams?: PathParams): string {
    return buildEndpoint(endpoint, pathParams);
  }
  
  static buildQuery(queryParams?: QueryParams): string {
    return buildQueryParams(queryParams);
  }
}

// Helper to create service methods with consistent endpoint handling
export const createApiMethod = {
  get: (endpoint: ApiEndpoint) => (pathParams?: PathParams, queryParams?: QueryParams) => 
    buildFullUrl(endpoint, pathParams, queryParams),
  
  post: (endpoint: ApiEndpoint) => (pathParams?: PathParams) => 
    buildEndpoint(endpoint, pathParams),
  
  put: (endpoint: ApiEndpoint) => (pathParams?: PathParams) => 
    buildEndpoint(endpoint, pathParams),
  
  delete: (endpoint: ApiEndpoint) => (pathParams?: PathParams) => 
    buildEndpoint(endpoint, pathParams),
};
