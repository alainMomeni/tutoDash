import { Search, ChevronDown } from 'lucide-react';

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

export const TableFilters = ({
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
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
        </div>
      )}

      {filters?.statusFilter && (
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as 'all' | 'active' | 'inactive')}
            className="block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};