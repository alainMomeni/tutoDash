import { createReducer } from '@reduxjs/toolkit';
import { login, logout } from '../actions/authActions';
import { AuthState } from '@/types/auth/authTypes';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  loading: false,
  error: null
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    // Handle login
    .addCase(login.pending, (state) => {
      console.log('🔄 Auth: Login request pending');
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      console.log('✅ Auth: Login successful', {
        userId: action.payload.user.id,
        email: action.payload.user.email
      });
      
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = null;
      
      console.log('💾 Auth: Storing tokens in localStorage');
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    })
    .addCase(login.rejected, (state, action) => {
      console.error('❌ Auth: Login failed', action.payload);
      
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = action.payload as string;
      
      console.log('🗑️ Auth: Clearing localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    })

    // Handle logout
    .addCase(logout.pending, (state) => {
      console.log('🔄 Auth: Logout request pending');
      state.loading = true;
    })
    .addCase(logout.fulfilled, (state) => {
      console.log('👋 Auth: Logout successful');
      
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      
      console.log('🗑️ Auth: Clearing localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    })
    .addCase(logout.rejected, (state, action) => {
      console.error('❌ Auth: Logout failed', action.payload);
      
      state.loading = false;
      state.error = action.payload as string;
      
      // Still clear everything on logout failure
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      
      console.log('🗑️ Auth: Clearing localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    });
});