// API Configurationlocalhost:8090
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
  
  // Product endpoints
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
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
};

// Helper function to replace path parameters
export const buildEndpoint = (endpoint: string, params: Record<string, string | number> = {}): string => {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value.toString());
  });
  return url;
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
