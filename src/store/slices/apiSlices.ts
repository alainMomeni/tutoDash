import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { EntityType } from '@/types/schema';
import { API_CONFIG } from '../../config/api';

interface ApiState {
  data: Record<string, any[]>;
  loading: boolean;
  error: string | null;
  initialized: boolean; // Add this field
}

const initialState: ApiState = {
  data: {},
  loading: false,
  error: null,
  initialized: false // Add this field
};

// Generic CRUD actions
export const fetchItems = createAsyncThunk(
  'api/fetchItems',
  async (type: EntityType, { getState, rejectWithValue }) => {
    try {
      console.log(`🚀 apiSlices: Fetching ${type} items...`);
      const { auth } = getState() as { auth: { token: string } };
      
      const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.items(type)}`;
      console.log('🔗 apiSlices: Request URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include' // Add this line
      });

      if (response.status === 403) {
        console.error(`🚫 apiSlices: Permission denied for ${type}`);
        throw new Error(`You don't have permission to access ${type} data`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch ${type}`);
      }

      const data = await response.json();
      return { type, items: data.data };
    } catch (error) {
      console.error(`❌ apiSlices: Error fetching ${type}:`, error);
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const createItem = createAsyncThunk(
  'api/createItem',
  async ({ type, data }: { type: EntityType; data: any }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.items(type)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Role': 'admin'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || 'Failed to create item');
      }

      const result = await response.json();
      return { type, item: result.data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const updateItem = createAsyncThunk(
  'api/updateItem',
  async ({ type, id, data }: { type: EntityType; id: string; data: any }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.items(type)}/${id}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // Removed Role header
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || 'Failed to update item');
      }

      const result = await response.json();
      return { type, item: result.data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'api/deleteItem',
  async ({ type, id }: { type: EntityType; id: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.items(type)}/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Accept': 'application/json'
          // Removed Role header
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || 'Failed to delete item');
      }

      return { type, id };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    // Add a reducer to reset the state
    resetApiState: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
      state.initialized = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        const { type, items } = action.payload;
        state.data[type] = items;
        state.loading = false;
        state.initialized = true; // Mark as initialized
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.initialized = true; // Mark as initialized even on error
      })

      // Create item
      .addCase(createItem.fulfilled, (state, action) => {
        const { type, item } = action.payload;
        state.data[type] = [...(state.data[type] || []), item];
      })

      // Update item
      .addCase(updateItem.fulfilled, (state, action) => {
        const { type, item } = action.payload;
        state.data[type] = state.data[type].map(
          existingItem => existingItem.id === item.id ? item : existingItem
        );
      })

      // Delete item
      .addCase(deleteItem.fulfilled, (state, action) => {
        const { type, id } = action.payload;
        state.data[type] = state.data[type].filter(item => item.id !== id);
      });
  }
});

export const { resetApiState } = apiSlice.actions;
export default apiSlice.reducer;