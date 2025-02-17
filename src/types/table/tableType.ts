import type { EntityName, DataItem } from '@/config/entities';

export interface TablePageProps {
  type: EntityName;
}

export interface DashboardTableProps {
  type: EntityName;
}

export interface Column {
  key: string;
  label: string;
  render?: (value: any) => string;
  filterable?: boolean;
}

export interface TableConfig {
  title: string;
  pageTitle: string;
  columns: Column[];
  filters: {
    searchable?: boolean;
    statusFilter?: boolean;
  };
}

export interface TableProps {
  columns: Column[];
  data: DataItem[];
  selectedItems: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  loading: boolean;
}

// Re-export DataItem type from schema if needed elsewhere
export type { DataItem };