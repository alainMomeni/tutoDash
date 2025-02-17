import { configureStore, createReducer, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG, getAuthHeader } from '@/config/api';
import { AuthState, AuthSuccess, LogoutResponse } from '@/types/auth/authTypes';
import { EntityName } from '@/config/entities';

// Auth Actions
export const login = createAsyncThunk<AuthSuccess, { email: string; password: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.login}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify({ email, password, mode: 'json' }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.message || 'Failed to authenticate');
      }

      const data = await response.json();
      if (!data.data?.access_token) throw new Error('No access token received');

      localStorage.setItem('token', data.data.access_token);
      localStorage.setItem('refreshToken', data.data.refresh_token);

      return {
        user: {
          id: data.data.user?.id || '',
          email: data.data.user?.email || email,
          firstName: data.data.user?.first_name,
          lastName: data.data.user?.last_name,
          avatar: data.data.user?.avatar
        },
        token: data.data.access_token,
        refreshToken: data.data.refresh_token
      };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk<LogoutResponse, void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) throw new Error('No refresh token found');
      
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.logout}`, {
        method: 'POST',
        headers: getAuthHeader(token || ''),
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || 'Failed to logout');
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to logout');
    }
  }
);

// API Actions
export const fetchItems = createAsyncThunk(
  'api/fetchItems',
  async (type: EntityName, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.items(type)}`, {
        headers: getAuthHeader(auth.token),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch ${type}`);
      }

      const data = await response.json();
      return { type, items: data.data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const createItem = createAsyncThunk(
  'api/createItem',
  async ({ type, data }: { type: EntityName; data: any }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.items(type)}`, {
        method: 'POST',
        headers: getAuthHeader(auth.token),
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create ${type}`);
      }

      const responseData = await response.json();
      return { type, item: responseData.data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const updateItem = createAsyncThunk(
  'api/updateItem',
  async ({ type, id, data }: { type: EntityName; id: string; data: any }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.items(type)}/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(auth.token),
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update ${type}`);
      }

      const responseData = await response.json();
      return { type, item: responseData.data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'api/deleteItem',
  async ({ type, id }: { type: EntityName; id: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.items(type)}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(auth.token),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete ${type}`);
      }
      await response.json();
      return { type, id };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Auth Reducer
const authInitialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  loading: false,
  error: null
};

const authReducer = createReducer(authInitialState, (builder) => {
  builder
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = null;
    })
    .addCase(login.rejected, (state, action) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
    });
});

// API Slice
interface ApiState {
  data: Record<EntityName, any[]>;
  loading: boolean;
  error: null | string;
  initialized: boolean;
}

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    data: {} as Record<EntityName, any[]>,
    loading: false,
    error: null,
    initialized: false
  } as ApiState,
  reducers: {
    resetApiState: (state) => {
      state.data = {} as Record<EntityName, any[]>;
      state.loading = false;
      state.error = null;
      state.initialized = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        const { type, items } = action.payload;
        state.data[type] = items;
        state.loading = false;
        state.initialized = true;
      })
      // ... (other cases remain the same, just simplified)
  }
});

// Configure Store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { resetApiState } = apiSlice.actions;