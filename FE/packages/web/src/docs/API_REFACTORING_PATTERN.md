# API Endpoint and Redux Action Type Refactoring Pattern

## Overview
This document describes the centralized approach for managing API endpoints and Redux action types used throughout the application. This pattern ensures consistency, maintainability, and reduces hardcoded strings across the codebase.

## 🏗️ Architecture

### 1. Centralized Configuration (`apiConfig.ts`)

All API endpoints and Redux action types are centralized in `src/config/apiConfig.ts`:

```typescript
// API endpoints
export const API_CONFIG = {
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
    SEARCH: '/products/search',
    // ... more endpoints
  },
  // ... other modules
} as const;

// Redux action types
export const REDUX_ACTION_TYPES = {
  PRODUCTS: {
    FETCH_PRODUCTS: 'products/fetchProducts',
    FETCH_PRODUCT_BY_ID: 'products/fetchProductById',
    // ... more action types
  },
  // ... other modules
} as const;
```

### 2. Service Layer Pattern

Services use helper functions from `apiConfig.ts` to build URLs consistently:

```typescript
// ❌ Old approach - hardcoded endpoints
class ProductService {
  async getProducts() {
    const response = await api.get('/products');
    return response.data;
  }
}

// ✅ New approach - using centralized config
class ProductService {
  private readonly endpoints = {
    list: createApiMethod.get(API_CONFIG.PRODUCTS.LIST),
    detail: createApiMethod.get(API_CONFIG.PRODUCTS.DETAIL),
  };

  async getProducts(filters: ProductFilters = {}) {
    const url = this.endpoints.list({}, filters);
    const response = await api.get(url);
    return response.data;
  }
}
```

### 3. Redux Slice Pattern

Redux slices use centralized action types from `apiConfig.ts`:

```typescript
// ❌ Old approach - hardcoded action types
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts', // ❌ Hardcoded string
  async (filters: ProductFilters = {}) => {
    // implementation
  }
);

// ✅ New approach - using centralized action types
import { REDUX_ACTION_TYPES } from '../../config/apiConfig';

export const fetchProducts = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.FETCH_PRODUCTS, // ✅ Centralized reference
  async (filters: ProductFilters = {}) => {
    // implementation
  }
);
```

## 🔧 Implementation Steps

### Step 1: Update `apiConfig.ts`

Add new endpoints and action types:

```typescript
export const API_CONFIG = {
  // Add new module endpoints
  YOUR_MODULE: {
    LIST: '/your-module',
    DETAIL: '/your-module/:id',
    CREATE: '/your-module',
    UPDATE: '/your-module/:id',
    DELETE: '/your-module/:id',
  },
} as const;

export const REDUX_ACTION_TYPES = {
  // Add new module action types
  YOUR_MODULE: {
    FETCH_ITEMS: 'yourModule/fetchItems',
    FETCH_ITEM_BY_ID: 'yourModule/fetchItemById',
    CREATE_ITEM: 'yourModule/createItem',
    UPDATE_ITEM: 'yourModule/updateItem',
    DELETE_ITEM: 'yourModule/deleteItem',
  },
} as const;
```

### Step 2: Create Service Class

```typescript
import api from './api';
import { API_CONFIG, createApiMethod } from '../config/apiConfig';

class YourModuleService {
  private readonly endpoints = {
    list: createApiMethod.get(API_CONFIG.YOUR_MODULE.LIST),
    detail: createApiMethod.get(API_CONFIG.YOUR_MODULE.DETAIL),
    create: createApiMethod.post(API_CONFIG.YOUR_MODULE.CREATE),
    update: createApiMethod.put(API_CONFIG.YOUR_MODULE.UPDATE),
    delete: createApiMethod.delete(API_CONFIG.YOUR_MODULE.DELETE),
  };

  async getItems() {
    const endpoint = this.endpoints.list();
    const response = await api.get(endpoint);
    return response.data;
  }

  async getItemById(id: number) {
    const endpoint = this.endpoints.detail({ id });
    const response = await api.get(endpoint);
    return response.data;
  }

  // ... other methods
}

export default new YourModuleService();
```

### Step 3: Create Redux Slice

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { REDUX_ACTION_TYPES } from '../../config/apiConfig';
import yourModuleService from '../../services/yourModuleService';

// Async thunks
export const fetchItems = createAsyncThunk(
  REDUX_ACTION_TYPES.YOUR_MODULE.FETCH_ITEMS,
  async (_, { rejectWithValue }) => {
    try {
      const response = await yourModuleService.getItems();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch items');
    }
  }
);

export const fetchItemById = createAsyncThunk(
  REDUX_ACTION_TYPES.YOUR_MODULE.FETCH_ITEM_BY_ID,
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await yourModuleService.getItemById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch item');
    }
  }
);

// ... rest of the slice
```

## 🚀 Benefits

### 1. **Consistency**
- All API endpoints are defined in one place
- Consistent URL building across services
- Standardized error handling

### 2. **Maintainability**
- Easy to update API endpoints globally
- Type safety with TypeScript `as const`
- Centralized action type management

### 3. **Developer Experience**
- Auto-completion for endpoints and action types
- Easy to find and update API configurations
- Reduced chance of typos in endpoint URLs

### 4. **Scalability**
- Easy to add new modules following the same pattern
- Helper functions for common patterns
- Environment-specific configurations

## 📝 Usage Examples

### Basic GET Request
```typescript
// Service method
async getProducts(filters: ProductFilters = {}) {
  const url = this.endpoints.list({}, filters);
  const response = await api.get(url);
  return response.data;
}
```

### Request with Path Parameters
```typescript
// Service method
async getProductById(id: number) {
  const endpoint = this.endpoints.detail({ id });
  const response = await api.get(endpoint);
  return response.data;
}
```

### Request with Query Parameters
```typescript
// Service method
async searchProducts(searchTerm: string) {
  const url = this.endpoints.search({}, { name: searchTerm });
  const response = await api.get(url);
  return response.data;
}
```

## 🔍 Helper Functions Reference

### `createApiMethod.get(endpoint)`
Creates a method builder for GET requests with optional path and query parameters.

### `createApiMethod.post(endpoint)`
Creates a method builder for POST requests with path parameters.

### `createApiMethod.put(endpoint)`
Creates a method builder for PUT requests with path parameters.

### `createApiMethod.delete(endpoint)`
Creates a method builder for DELETE requests with path parameters.

### `buildFullUrl(endpoint, pathParams, queryParams)`
Builds a complete URL with path parameters and query string.

### `buildEndpoint(endpoint, pathParams)`
Builds an endpoint URL with path parameters only.

### `buildQueryParams(queryParams)`
Creates a query string from an object of parameters.

## 🎯 Best Practices

1. **Always use centralized constants** instead of hardcoded strings
2. **Group related endpoints and action types** under the same module
3. **Use TypeScript `as const`** for better type inference
4. **Follow consistent naming conventions** for endpoints and action types
5. **Handle errors consistently** across all async thunks
6. **Use helper functions** for URL building rather than string concatenation

## 🔄 Migration Checklist

When migrating existing code to this pattern:

- [ ] Add endpoints to `API_CONFIG` in `apiConfig.ts`
- [ ] Add action types to `REDUX_ACTION_TYPES` in `apiConfig.ts`
- [ ] Update service class to use endpoint builders
- [ ] Update Redux slice to use centralized action types
- [ ] Remove hardcoded endpoint strings
- [ ] Remove hardcoded action type strings
- [ ] Test all API calls and Redux actions
- [ ] Update any tests that reference hardcoded strings

This pattern provides a robust foundation for managing API integrations and ensures consistency across the entire application.
