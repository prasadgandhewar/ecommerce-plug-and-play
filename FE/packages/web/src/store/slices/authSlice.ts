import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REDUX_ACTION_TYPES } from '../../config/apiConfig';
import authService, { LoginRequest, RegisterRequest, User, AuthResponse } from '../../services/authService';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Safe initialization function
const initializeAuthState = (): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> => {
  try {
    const user = authService.getCurrentUser();
    const token = authService.getToken();
    const isAuthenticated = authService.isAuthenticated();
    
    return {
      user,
      token,
      isAuthenticated,
    };
  } catch (error) {
    console.error('Error initializing auth state:', error);
    // Clear corrupted data
    authService.logout();
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = {
  ...initializeAuthState(),
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  REDUX_ACTION_TYPES.AUTH.LOGIN,
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  REDUX_ACTION_TYPES.AUTH.REGISTER,
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  REDUX_ACTION_TYPES.AUTH.LOGOUT,
  async () => {
    authService.logout();
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthData: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      authService.logout();
    },
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      if (action.payload.user && action.payload.token) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Safely store in localStorage
        try {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        } catch (error) {
          console.error('Error storing credentials in localStorage:', error);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, clearAuthData, setCredentials } = authSlice.actions;
export default authSlice.reducer;
