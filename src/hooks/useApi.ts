// src/store/hooks/useApi.ts
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  fetchItems,
  createItem,
  updateItem,
  deleteItem 
} from '@/store/slices/apiSlices';
import { RootState } from '@/store/store';
import { EntityType } from '@/types/schema';
import { useNavigate } from 'react-router-dom';

export const useApi = (entityType: EntityType) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, loading, error, initialized } = useSelector((state: RootState) => state.api);
  
  const items = data[entityType] || [];

  useEffect(() => {
    if (!initialized && entityType) {
      console.log(`🔄 Initial fetch for ${entityType}...`);
      fetchData();
    }
  }, [entityType, initialized]);

  const fetchData = useCallback(async () => {
    console.log(`🔄 Starting fetch for ${entityType}...`);
    try {
      const result = await dispatch(fetchItems(entityType)).unwrap();
      console.log(`✅ Fetch successful for ${entityType}:`, result);
    } catch (err) {
      console.error(`❌ Failed to fetch ${entityType}:`, {
        error: err,
        state: {
          loading,
          itemsCount: items.length,
          hasError: !!error
        }
      });

      // Handle permission error
      if (err instanceof Error && err.message.includes("permission")) {
        console.warn(`⚠️ Permission denied for ${entityType}`);
      }
    }
  }, [dispatch, entityType, items.length, loading, error]);

  const create = useCallback(async (data: any) => {
    try {
      await dispatch(createItem({ type: entityType, data })).unwrap();
      return true;
    } catch (err) {
      console.error(`Failed to create ${entityType}:`, err);
      return false;
    }
  }, [dispatch, entityType]);

  const update = useCallback(async (id: string, data: any) => {
    try {
      await dispatch(updateItem({ type: entityType, id, data })).unwrap();
      return true;
    } catch (err) {
      console.error(`Failed to update ${entityType}:`, err);
      return false;
    }
  }, [dispatch, entityType]);

  const remove = useCallback(async (id: string) => {
    try {
      await dispatch(deleteItem({ type: entityType, id })).unwrap();
      return true;
    } catch (err) {
      console.error(`Failed to delete ${entityType}:`, err);
      return false;
    }
  }, [dispatch, entityType]);

  return {
    items,
    loading,
    error,
    fetchData,
    create,
    update,
    remove
  };
};