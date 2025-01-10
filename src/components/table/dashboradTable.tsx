import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { generateTableSchema } from '@/utils/schemaGenerators';
import { TABLE_CONFIG } from './metadata/tableConfig';
import { useTableData } from '../../hooks/useTableData';
import { useEntityData } from '@/hooks/useEntityData';
import { TableFilters } from './tableFilter';
import { Table } from './table';
import { TablePagination } from './tablePagination';
import { DashboardTableProps } from '@/types/table/tableType';
import { ConfirmDialog } from '@/components/common';
import { useApi } from '@/hooks/useApi';

const DashboardTable = ({ type }: DashboardTableProps) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState<'delete' | 'deactivate' | null>(null);
  const { items: productItems } = useApi('product');
  
  const {
    items,
    loading,
    error,
    handleUpdate: update,
    remove,
    fetchData
  } = useEntityData(type);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredData,
    currentPage,
    setCurrentPage
  } = useTableData(type, items);

  // Memoize the table schema with product name rendering
  const tableSchema = useMemo(() => {
    const schema = generateTableSchema(type);
    
    if (type === 'sales') {
      return {
        ...schema,
        columns: schema.columns.map(column => {
          if (column.key === 'product') {
            return {
              ...column,
              render: (value: string) => {
                const product = productItems?.find(item => item.id === value);
                return product?.name || value;
              }
            };
          }
          return column;
        })
      };
    }
    
    return schema;
  }, [type, productItems]);

  const paginationConfig = {
    currentPage,
    totalPages: Math.ceil(filteredData.length / TABLE_CONFIG.itemsPerPage),
    totalItems: filteredData.length,
    itemsPerPage: TABLE_CONFIG.itemsPerPage,
    startIndex: (currentPage - 1) * TABLE_CONFIG.itemsPerPage,
    endIndex: Math.min(
      currentPage * TABLE_CONFIG.itemsPerPage,
      filteredData.length
    ),
    currentData: filteredData.slice(
      (currentPage - 1) * TABLE_CONFIG.itemsPerPage,
      currentPage * TABLE_CONFIG.itemsPerPage
    )
  };

  const handleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(prev => 
      prev.length === paginationConfig.currentData.length
        ? []
        : paginationConfig.currentData.map(item => item.id)
    );
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      console.log('🗑️ Deleting item:', itemToDelete);
      const success = await remove(itemToDelete); // Use remove directly
      if (success) {
        console.log('✅ Item deleted successfully');
        await fetchData(); // Refresh the data after successful deletion
        setSelectedItems(prev => prev.filter(id => id !== itemToDelete));
      } else {
        console.error('❌ Failed to delete item');
      }
      setItemToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  const handleBulkDelete = () => {
    setBulkAction('delete');
    setShowBulkDeleteDialog(true);
  };

  const handleBulkDeactivate = async () => {
    setBulkAction('deactivate');
    setShowBulkDeleteDialog(true);
  };

  const handleBulkConfirm = async () => {
    try {
      if (bulkAction === 'delete') {
        await Promise.all(selectedItems.map(id => remove(id)));
      } else if (bulkAction === 'deactivate') {
        const itemsToUpdate = items.filter(item => selectedItems.includes(item.id));
        await Promise.all(
          itemsToUpdate.map(item => {
            const updatedData = 'active' in item 
              ? { ...item, active: 'No' }
              : { ...item, status: false };
            return update(item.id, updatedData);
          })
        );
      }
      setSelectedItems([]);
      await fetchData(); // Refresh data after bulk operations
    } catch (error) {
      console.error(`Failed to perform bulk ${bulkAction}:`, error);
    } finally {
      setShowBulkDeleteDialog(false);
      setBulkAction(null);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const itemToToggle = items.find(item => item.id === id);
      if (!itemToToggle) return;

      let updatedData;
      if ('active' in itemToToggle) {
        // Handle Yes/No toggle for sales and products
        updatedData = {
          ...itemToToggle,
          active: itemToToggle.active === 'Yes' ? 'No' : 'Yes'
        };
      } else if ('status' in itemToToggle) {
        // Handle boolean toggle for other entities
        updatedData = {
          ...itemToToggle,
          status: !itemToToggle.status
        };
      }

      if (updatedData) {
        const success = await update(id, updatedData);
        if (!success) {
          throw new Error(TABLE_CONFIG.messages.error.toggle);
        }
        await fetchData(); // Refresh the data after successful update
      }
    } catch (error) {
      console.error(TABLE_CONFIG.messages.error.toggle, error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      {error && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <TableFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            filters={tableSchema.filters} 
          />
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-3">
          {selectedItems.length > 0 ? (
            <>
              <button
                onClick={handleBulkDeactivate}
                disabled={loading}
                className={`${TABLE_CONFIG.styles.bulkActionButton} ${TABLE_CONFIG.styles.deactivateButton}`}
              >
                <TABLE_CONFIG.icons.toggle className={TABLE_CONFIG.styles.iconButton} />
                <span>{TABLE_CONFIG.buttons.bulkDeactivate}</span>
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className={`${TABLE_CONFIG.styles.bulkActionButton} ${TABLE_CONFIG.styles.deleteButton}`}
              >
                <TABLE_CONFIG.icons.delete className={TABLE_CONFIG.styles.iconButton} />
                <span>{TABLE_CONFIG.buttons.bulkDelete}</span>
              </button>
            </>
          ) : null}
          <button
            onClick={() => navigate(`/dashboard/${type}/create`)}
            className={`${TABLE_CONFIG.styles.bulkActionButton} ${TABLE_CONFIG.styles.newButton}`}
          >
            <TABLE_CONFIG.icons.add className={TABLE_CONFIG.styles.iconButton} />
            <span>{TABLE_CONFIG.buttons.new}</span>
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <Table
              columns={tableSchema.columns}
              data={paginationConfig.currentData}
              selectedItems={selectedItems}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onEdit={(id) => navigate(`/dashboard/${type}/edit/${id}`)}
              onDelete={handleDeleteClick}
              onToggle={handleToggle}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <TablePagination {...paginationConfig} onPageChange={setCurrentPage} />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Confirm Delete"
        message={TABLE_CONFIG.messages.confirmDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
      />

      <ConfirmDialog
        isOpen={showBulkDeleteDialog}
        title={`Confirm Bulk ${bulkAction === 'delete' ? 'Delete' : 'Deactivate'}`}
        message={
          bulkAction === 'delete'
            ? TABLE_CONFIG.messages.confirmDelete
            : TABLE_CONFIG.messages.confirmDeactivate
        }
        confirmLabel={bulkAction === 'delete' ? 'Delete' : 'Deactivate'}
        cancelLabel="Cancel"
        onConfirm={handleBulkConfirm}
        onCancel={() => {
          setShowBulkDeleteDialog(false);
          setBulkAction(null);
        }}
      />
    </div>
  );
};

export default DashboardTable;