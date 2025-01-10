import { createAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface AuthSuccess {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
}

// Create action creators with proper typing
export const authStart = createAction('auth/AUTH_START');
export const authSuccess = createAction<AuthSuccess>('auth/AUTH_SUCCESS');
export const authFailure = createAction<string>('auth/AUTH_FAILURE');
export const authLogout = createAction('auth/AUTH_LOGOUT');