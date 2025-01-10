import { useState, useEffect, useMemo } from 'react';
import { DataItem, EntityType } from '@/types/schema';
import { generateTableSchema } from '@/utils/schemaGenerators';
import { Column } from '@/types/table/tableType';
import { useApi } from '@/hooks/useApi';

export const useTableData = (type: EntityType, data: DataItem[] = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { items: productItems } = useApi('product');

  // Memoize the schema generation
  const schema = useMemo(() => generateTableSchema(type), [type]);
  const { columns } = schema;

  // Filter and search data with product name support
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    let filtered = [...data];

    // Apply search filter
    if (searchTerm && columns) {
      filtered = filtered.filter(item => {
        return columns
          .filter((col: Column) => col.filterable)
          .some((col: Column) => {
            const value = (item as Record<string, any>)[col.key];

            // Special handling for product field in sales table
            if (type === 'sales' && col.key === 'product') {
              const product = productItems?.find(p => p.id === value);
              return product?.name.toLowerCase().includes(searchTerm.toLowerCase());
            }

            // Regular field filtering
            return value !== undefined && value !== null &&
              String(value).toLowerCase().includes(searchTerm.toLowerCase());
          });
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        if ('active' in item) {
          return statusFilter === 'active' 
            ? item.active === 'Yes' 
            : item.active === 'No';
        }
        return true;
      });
    }

    return filtered;
  }, [data, searchTerm, statusFilter, columns, type, productItems]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredData,
    currentPage,
    setCurrentPage,
    columns // Export columns for use in components
  };
};