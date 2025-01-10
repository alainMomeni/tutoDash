import { useEffect, useState, useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { EntityType } from '@/types/schema';

export const useEntityData = (type: EntityType) => {
  const [mounted, setMounted] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { items, loading, error, fetchData, update, remove } = useApi(type);

  // Single fetch on mount
  useEffect(() => {
    console.log('🔄 useEntityData: Component mounted for type:', type);
    let isActive = true;

    const fetchOnMount = async () => {
      if (isActive) {
        console.log('📥 useEntityData: Fetching data on mount...');
        try {
          await fetchData();
          if (isActive) {
            console.log('✅ useEntityData: Initial fetch successful');
          }
        } catch (error) {
          console.error('❌ useEntityData: Failed to fetch data:', error);
        }
      }
    };

    fetchOnMount();

    return () => {
      console.log('🔚 useEntityData: Component unmounting, cleaning up...');
      isActive = false;
      setMounted(false);
    };
  }, [type]);

  const handleDelete = useCallback(async (id: string) => {
    console.log('🔄 Handling delete for id:', id);
    if (mounted) {
      const success = await remove(id);
      if (success) {
        console.log('✅ Delete successful, refreshing data...');
        await fetchData();
      }
      return success;
    }
    return false;
  }, [remove, fetchData, mounted]);

  return {
    items,
    loading,
    error,
    handleUpdate: update,
    handleDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    remove,
    fetchData
  };
};