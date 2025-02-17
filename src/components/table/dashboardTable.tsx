import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Search } from 'lucide-react';
import { generateTableSchema } from '@/utils/schemaGenerators';
import { ConfirmDialog } from '@/components/common';
import { TableProps, DataItem, DashboardTableProps } from '@/types/table/tableType';
import { useEntityManagement } from '@/hooks/useEntityManagement';
import { Edit2, Trash2, Power, Plus, CheckSquare } from 'lucide-react';

export const TABLE_CONFIG = {
  icons: {
    edit: Edit2,
    delete: Trash2,
    toggle: Power,
    select: CheckSquare,
    add: Plus
  },
  messages: {
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ces éléments ?',
    confirmDeactivate: 'Êtes-vous sûr de vouloir désactiver ces éléments ?',
    noData: 'Aucune donnée disponible',
    error: {
      delete: 'Erreur lors de la suppression:',
      deactivate: 'Erreur lors de la désactivation:',
      toggle: 'Erreur lors du changement de statut:' // Add this line
    }
  },
  buttons: {
    new: 'Nouveau',
    bulkDelete: 'Supprimer la sélection',
    bulkDeactivate: 'Désactiver la sélection'
  },
  styles: {
    actionButton: "p-2 rounded-full hover:bg-gray-100 transition-colors",
    deleteButton: "text-red-600 hover:text-red-700",
    editButton: "text-blue-600 hover:text-blue-700",
    toggleButton: "text-gray-600 hover:text-gray-700",
    checkbox: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
    bulkActionButton: "inline-flex items-center px-3 py-2 text-sm font-semibold rounded-md space-x-2",
    deactivateButton: "bg-gray-600 text-white hover:bg-gray-700",
    newButton: "bg-blue-600 text-white hover:bg-blue-700",
    iconButton: "h-4 w-4"
  },
  itemsPerPage: 10
};

interface TableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: 'all' | 'active' | 'inactive') => void;
  filters?: {
    searchable?: boolean;
    statusFilter?: boolean;
  };
}

// TableFilters Component
const TableFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  filters
}: TableFiltersProps) => {
  if (!filters?.searchable && !filters?.statusFilter) return null;

  return (
    <div className="mb-4 flex gap-4 items-center">
      {filters?.searchable && (
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="pl-10 w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600"
          />
        </div>
      )}
      {filters?.statusFilter && (
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as 'all' | 'active' | 'inactive')}
          className="w-40 rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      )}
    </div>
  );
};

// Table Component
const Table = ({ columns, data, selectedItems, onSelect, onSelectAll, onEdit, onDelete, onToggle, loading }: TableProps) => {
  const Icons = TABLE_CONFIG.icons;

  const renderActionButtons = (item: DataItem) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onToggle(item.id)}
        className={`${TABLE_CONFIG.styles.actionButton} ${TABLE_CONFIG.styles.toggleButton}`}
        disabled={loading}
      >
        <Icons.toggle className={`h-4 w-4 ${
          ('active' in item && item.active === 'Yes') || ('status' in item && item.status)
            ? 'text-green-600'
            : 'text-gray-400'
        }`} />
      </button>
      <button
        onClick={() => onEdit(item.id)}
        className={`${TABLE_CONFIG.styles.actionButton} ${TABLE_CONFIG.styles.editButton}`}
      >
        <Icons.edit className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(item.id)}
        className={`${TABLE_CONFIG.styles.actionButton} ${TABLE_CONFIG.styles.deleteButton}`}
      >
        <Icons.delete className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th className="w-12 px-3 py-3.5">
            <input
              type="checkbox"
              checked={data.length > 0 && selectedItems.length === data.length}
              onChange={onSelectAll}
              className={TABLE_CONFIG.styles.checkbox}
            />
          </th>
          {columns.map(({ key, label }) => (
            <th key={key} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {label}
            </th>
          ))}
          <th className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((item: DataItem) => (
          <tr key={item.id}>
            <td className="w-12 px-3 py-4">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => onSelect(item.id)}
                className={TABLE_CONFIG.styles.checkbox}
              />
            </td>
            {columns.map(({ key, render }) => (
              <td key={`${item.id}-${key}`} className="px-3 py-4 text-sm text-gray-500">
                {render ? render((item as Record<string, any>)[key]) : (item as Record<string, any>)[key]}
              </td>
            ))}
            <td className="px-3 py-4 text-sm text-right">{renderActionButtons(item)}</td>
          </tr>
        ))}
        {!data.length && (
          <tr><td colSpan={columns.length + 2} className="px-3 py-4 text-center text-sm text-gray-500">{TABLE_CONFIG.messages.noData}</td></tr>
        )}
      </tbody>
    </table>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TablePagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
  <div className="flex items-center justify-between px-4 py-3 sm:px-6">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

// Main DashboardTable Component
const DashboardTable = ({ type }: DashboardTableProps) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState<'delete' | 'deactivate' | null>(null);
  const { items: productItems } = useEntityManagement('product');
  
  const {
    items,
    handleUpdate: update,
    remove,
    fetchData
  } = useEntityManagement(type);

  const {
    items: entityItems,
    loading,
    error: entityError,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage
  } = useEntityManagement(type);

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
    totalPages: Math.ceil(entityItems.length / TABLE_CONFIG.itemsPerPage),
    totalItems: entityItems.length,
    itemsPerPage: TABLE_CONFIG.itemsPerPage,
    startIndex: (currentPage - 1) * TABLE_CONFIG.itemsPerPage,
    endIndex: Math.min(
      currentPage * TABLE_CONFIG.itemsPerPage,
      entityItems.length
    ),
    currentData: entityItems.slice(
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
        : paginationConfig.currentData.map((item: DataItem) => item.id)
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
        console.log('🗑️ Bulk deleting items:', selectedItems);
        await Promise.all(selectedItems.map(id => remove(id)));
      } else if (bulkAction === 'deactivate') {
        console.log('⚡ Bulk deactivating items:', selectedItems);
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
      console.log('✅ Bulk operation completed successfully');
      setSelectedItems([]);
      await fetchData(); // Refresh data after bulk operations
    } catch (error) {
      console.error(`❌ Failed to perform bulk ${bulkAction}:`, error);
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
      {entityError && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{entityError}</span>
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