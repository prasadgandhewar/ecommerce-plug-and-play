import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import categoryFilterService from '../../services/categoryFilterService';
import { CategoryFilter, SelectedFilter, CategoryFilterState } from '../../types';

const initialState: CategoryFilterState = {
  availableFilters: [],
  selectedFilters: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCategoryFilters = createAsyncThunk(
  'categoryFilters/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryFilterService.getAllCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category filters');
    }
  }
);

export const fetchFiltersForCategory = createAsyncThunk(
  'categoryFilters/fetchForCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await categoryFilterService.getCategoryFilters(category);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch filters for category');
    }
  }
);

const categoryFilterSlice = createSlice({
  name: 'categoryFilters',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedFilters: (state) => {
      state.selectedFilters = [];
    },
    addSelectedFilter: (state, action: PayloadAction<SelectedFilter>) => {
      const existingIndex = state.selectedFilters.findIndex(
        filter => filter.name === action.payload.name
      );
      
      if (existingIndex !== -1) {
        state.selectedFilters[existingIndex] = action.payload;
      } else {
        state.selectedFilters.push(action.payload);
      }
    },
    removeSelectedFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilters = state.selectedFilters.filter(
        filter => filter.name !== action.payload
      );
    },
    updateSelectedFilter: (state, action: PayloadAction<SelectedFilter>) => {
      const index = state.selectedFilters.findIndex(
        filter => filter.name === action.payload.name
      );
      
      if (index !== -1) {
        state.selectedFilters[index] = action.payload;
      }
    },
    setAvailableFilters: (state, action: PayloadAction<CategoryFilter[]>) => {
      state.availableFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all category filters
      .addCase(fetchCategoryFilters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryFilters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableFilters = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryFilters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch filters for specific category
      .addCase(fetchFiltersForCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFiltersForCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update or add the category filter
        const existingIndex = state.availableFilters.findIndex(
          filter => filter.category === action.payload.category
        );
        
        if (existingIndex !== -1) {
          state.availableFilters[existingIndex] = action.payload;
        } else {
          state.availableFilters.push(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchFiltersForCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSelectedFilters,
  addSelectedFilter,
  removeSelectedFilter,
  updateSelectedFilter,
  setAvailableFilters,
} = categoryFilterSlice.actions;

export default categoryFilterSlice.reducer;
