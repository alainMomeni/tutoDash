import { TABLE_CONFIG } from './metadata/tableConfig';
import { TableProps, DataItem } from '@/types/table/tableType';

export const Table = ({
  columns,
  data,
  selectedItems,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onToggle,
  loading
}: TableProps) => {
  const Icons = TABLE_CONFIG.icons; // Get all icons

  const renderActionButtons = (item: DataItem) => (
    <div className="flex items-center space-x-2">
      {/* Toggle Button */}
      <button
        onClick={() => onToggle(item.id)}
        className={`${TABLE_CONFIG.styles.actionButton} ${TABLE_CONFIG.styles.toggleButton}`}
        disabled={loading}
        title={('active' in item && item.active === 'Yes') || ('status' in item && item.status) ? 'Deactivate' : 'Activate'}
      >
        <Icons.toggle className={`h-4 w-4 ${
          ('active' in item && item.active === 'Yes') || ('status' in item && item.status)
            ? 'text-green-600'
            : 'text-gray-400'
        }`} />
      </button>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(item.id)}
        className={`${TABLE_CONFIG.styles.actionButton} ${TABLE_CONFIG.styles.editButton}`}
        disabled={loading}
        title="Edit"
      >
        <Icons.edit className="h-4 w-4" />
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(item.id)}
        className={`${TABLE_CONFIG.styles.actionButton} ${TABLE_CONFIG.styles.deleteButton}`}
        disabled={loading}
        title="Delete"
      >
        <Icons.delete className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
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
            <th 
              key={key}
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              {label}
            </th>
          ))}
          <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span className="sr-only">Actions</span>
          </th>
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
            {columns.map(({ key, render }) => {
              const value = (item as Record<string, any>)[key];
              return (
                <td 
                  key={`${item.id}-${key}`}
                  className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                >
                  {render ? render(value) : value}
                </td>
              );
            })}
            <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
              {renderActionButtons(item)}
            </td>
          </tr>
        ))}
        {!data.length && (
          <tr>
            <td 
              colSpan={columns.length + 2}
              className="px-3 py-4 text-sm text-gray-500 text-center"
            >
              {TABLE_CONFIG.messages.noData}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};