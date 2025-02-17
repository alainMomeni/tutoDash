import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store/store';
import { useAppDispatch } from './useAppDispatch';
import { fetchItems, createItem, updateItem, deleteItem } from '@/store/store';
import { EntityName } from '@/config/entities';

export const useEntityManagement = (type: EntityName) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, loading, error, initialized } = useSelector((state: RootState) => state.api);
  const [mounted, setMounted] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const items = data[type] || [];

  // Error handling
  useEffect(() => {
    if (error && isAuthError(error)) {
      console.error('Authentication error detected, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/');
    }
  }, [error, navigate]);

  // Initial data fetch
  useEffect(() => {
    console.log('🔄 Component mounted for type:', type);
    let isActive = true;

    const fetchInitialData = async () => {
      if (!initialized && type && isActive) {
        try {
          await dispatch(fetchItems(type)).unwrap();
          console.log('✅ Initial fetch successful');
        } catch (err) {
          console.error('❌ Failed to fetch data:', err);
        }
      }
    };

    fetchInitialData();

    return () => {
      console.log('🔚 Component unmounting, cleaning up...');
      isActive = false;
      setMounted(false);
    };
  }, [type, initialized]);

  // CRUD operations
  const fetchData = useCallback(async () => {
    try {
      await dispatch(fetchItems(type)).unwrap();
      return true;
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
      return false;
    }
  }, [dispatch, type]);

  const create = useCallback(async (data: any) => {
    try {
      await dispatch(createItem({ type, data })).unwrap();
      return true;
    } catch (err) {
      console.error(`Failed to create ${type}:`, err);
      return false;
    }
  }, [dispatch, type]);

  const update = useCallback(async (id: string, data: any) => {
    try {
      await dispatch(updateItem({ type, id, data })).unwrap();
      return true;
    } catch (err) {
      console.error(`Failed to update ${type}:`, err);
      return false;
    }
  }, [dispatch, type]);

  const remove = useCallback(async (id: string) => {
    if (mounted) {
      try {
        await dispatch(deleteItem({ type, id })).unwrap();
        await fetchData();
        return true;
      } catch (err) {
        console.error(`Failed to delete ${type}:`, err);
        return false;
      }
    }
    return false;
  }, [dispatch, type, mounted, fetchData]);

  const isAuthError = (error: any): boolean => {
    if (!error) return false;
    const AUTH_ERROR_CODES = [401, 403];
    if (error.status && AUTH_ERROR_CODES.includes(error.status)) return true;
    const errorMessage = error.message?.toLowerCase() || '';
    return errorMessage.includes('unauthorized') || 
           errorMessage.includes('unauthenticated') ||
           errorMessage.includes('forbidden') ||
           errorMessage.includes('invalid token');
  };

  return {
    items,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    selectedItems,
    setSelectedItems,
    showDeleteDialog,
    setShowDeleteDialog,
    fetchData,
    create,
    update,
    remove,
    handleUpdate: update,
    handleDelete: remove,
    isAuthError: error ? isAuthError(error) : false
  };
}; 