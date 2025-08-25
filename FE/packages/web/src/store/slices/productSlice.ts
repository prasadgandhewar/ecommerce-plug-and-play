import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REDUX_ACTION_TYPES } from '../../config/apiConfig';
import productService from '../../services/productService';
import { Product, ProductRequest, ProductFilters, PaginatedProductResponse } from '../../types';

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  categories: string[];
  pagination: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  categories: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    page: 0,
    size: 20,
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.FETCH_PRODUCTS,
  async (filters: ProductFilters = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// New action for infinite scroll - appends products instead of replacing
export const fetchMoreProducts = createAsyncThunk(
  'products/fetchMoreProducts',
  async (filters: ProductFilters = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch more products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.FETCH_PRODUCT_BY_ID,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.SEARCH_PRODUCTS,
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.FETCH_BY_CATEGORY,
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByCategory(category);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }
);

export const fetchProductsByPriceRange = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.FETCH_BY_PRICE_RANGE,
  async ({ minPrice, maxPrice }: { minPrice: number; maxPrice: number }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByPriceRange(minPrice, maxPrice);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products by price range');
    }
  }
);

export const createProduct = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.CREATE_PRODUCT,
  async (productData: ProductRequest, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.UPDATE_PRODUCT,
  async ({ id, productData }: { id: string; productData: ProductRequest }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(id, productData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.DELETE_PRODUCT,
  async (id: string, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  REDUX_ACTION_TYPES.PRODUCTS.FETCH_CATEGORIES,
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearProducts: (state) => {
      state.products = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products (paginated)
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          size: action.payload.size,
          number: action.payload.number,
          first: action.payload.first,
          last: action.payload.last,
        };
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch more products (for infinite scroll)
      .addCase(fetchMoreProducts.pending, (state) => {
        // Don't set isLoading to true for infinite scroll to avoid hiding the grid
        state.error = null;
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        // Append new products to existing ones
        state.products = [...state.products, ...action.payload.content];
        state.pagination = {
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          size: action.payload.size,
          number: action.payload.number,
          first: action.payload.first,
          last: action.payload.last,
        };
        state.error = null;
      })
      .addCase(fetchMoreProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          size: action.payload.size,
          number: action.payload.number,
          first: action.payload.first,
          last: action.payload.last,
        };
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          size: action.payload.size,
          number: action.payload.number,
          first: action.payload.first,
          last: action.payload.last,
        };
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch products by price range
      .addCase(fetchProductsByPriceRange.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByPriceRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          size: action.payload.size,
          number: action.payload.number,
          first: action.payload.first,
          last: action.payload.last,
        };
        state.error = null;
      })
      .addCase(fetchProductsByPriceRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload); // Add new product to the beginning
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
        if (state.currentProduct && state.currentProduct.id === action.payload) {
          state.currentProduct = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setFilters, 
  clearCurrentProduct, 
  clearProducts 
} = productSlice.actions;

export default productSlice.reducer;
