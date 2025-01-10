import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducer';
import apiReducer from './slices/apiSlices';
import formReducer from './slices/formSlice';
import { AuthState } from '@/types/auth/authTypes';

export interface RootState {
  auth: AuthState;
  api: {
    data: Record<string, any[]>;
    loading: boolean;
    error: string | null;
    initialized: boolean; // Add this field
  };
  form: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    form: formReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredPaths: ['auth.error', 'api.error', 'form.error']
    }
  }),
  devTools: process.env.NODE_ENV !== 'production'
});

export type AppDispatch = typeof store.dispatch;