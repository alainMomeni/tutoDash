import { useEffect, useState, useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { EntityType } from '@/types/schema';

export const useEntityData = (type: EntityType) => {
  const [mounted, setMounted] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { items, loading, error, fetchData, create, update, remove } = useApi(type);

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
  }, [type]); // Only depend on type, remove fetchData from dependencies

  const handleCreate = useCallback(async (data: any) => {
    const success = await create(data);
    if (success && mounted) {
      await fetchData();
    }
    return success;
  }, [create, fetchData, mounted]);

  const handleUpdate = useCallback(async (id: string, data: any) => {
    console.log('🔄 useEntityData: Handling update for id:', id);
    const success = await update(id, data);
    if (success && mounted) {
      console.log('✅ useEntityData: Update successful, refreshing data...');
      await fetchData();
    }
    return success;
  }, [update, fetchData, mounted]);

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

  const confirmDelete = useCallback(async () => {
    if (selectedId && mounted) {
      const success = await remove(selectedId);
      if (success) {
        await fetchData();
      }
      setShowDeleteDialog(false);
      setSelectedId(null);
      return success;
    }
    return false;
  }, [selectedId, remove, fetchData, mounted]);

  return {
    items,
    loading,
    error,
    handleCreate,
    handleUpdate: update,
    handleDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    remove, // Export remove directly
    fetchData // Export fetchData for manual refreshes
  };
};