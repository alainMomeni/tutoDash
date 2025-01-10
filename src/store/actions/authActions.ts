import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthSuccess, LogoutResponse } from '@/types/auth/authTypes';

const API_URL = 'https://backend-station-app-demo.onrender.com';

export const login = createAsyncThunk<AuthSuccess, { email: string; password: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    console.log('🚀 Login attempt:', { email });
    
    try {
      // First request to get tokens
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password,
          mode: 'json' // Add this to ensure JSON response
        }),
        credentials: 'include'
      });

      console.log('📨 Login response status:', loginResponse.status);
      
      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        console.error('❌ Login response error:', errorData);
        throw new Error(errorData.errors?.[0]?.message || 'Failed to authenticate');
      }

      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);

      if (!loginData.data?.access_token) {
        throw new Error('No access token received');
      }

      // Store tokens immediately
      localStorage.setItem('token', loginData.data.access_token);
      localStorage.setItem('refreshToken', loginData.data.refresh_token);

      // Extract user data from login response if available
      const user = {
        id: loginData.data.user?.id || '',
        email: loginData.data.user?.email || email,
        firstName: loginData.data.user?.first_name,
        lastName: loginData.data.user?.last_name,
        avatar: loginData.data.user?.avatar
      };

      return {
        user,
        token: loginData.data.access_token,
        refreshToken: loginData.data.refresh_token
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      // Clear any stored tokens on error
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

export const logout = createAsyncThunk<LogoutResponse, void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    console.log('🚀 Logout attempt');
    
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      console.log('📝 Using tokens:', {
        accessToken: token?.substring(0, 10) + '...',
        refreshToken: refreshToken?.substring(0, 10) + '...'
      });

      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include'
      });

      console.log('📨 Logout response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Logout failed:', error);
        throw new Error(error.errors?.[0]?.message || 'Failed to logout');
      }
      
      console.log('🗑️ Clearing local storage');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      console.log('✅ Logout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear tokens on error to ensure user is logged out
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to logout'
      );
    }
  }
);