import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define error type constants
const AUTH_ERROR_CODES = [401, 403];

// Helper function to check if error is authentication related
const isAuthenticationError = (error: any): boolean => {
  if (!error) return false;

  // Check for HTTP status codes
  if (error.status && AUTH_ERROR_CODES.includes(error.status)) {
    return true;
  }

  // Check error messages
  const errorMessage = error.message?.toLowerCase() || '';
  return errorMessage.includes('unauthorized') || 
         errorMessage.includes('unauthenticated') ||
         errorMessage.includes('forbidden') ||
         errorMessage.includes('invalid token');
};

export const useApiError = (error: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (error && isAuthenticationError(error)) {
      console.error('Authentication error detected, redirecting to login');
      // Clear any stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/');
    }
  }, [error, navigate]);

  return {
    isAuthError: error ? isAuthenticationError(error) : false
  };
};