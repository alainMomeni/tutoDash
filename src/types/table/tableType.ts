// src/types/table/tableType.ts
import { EntityType, DataItem } from "../schema";

interface BaseItem {
  id: string;
  [key: string]: any; // Allow any string-keyed properties
}

interface StatusBooleanItem extends BaseItem {
  status: boolean;
}

interface StatusStringItem extends BaseItem {
  status: 'draft' | 'completed' | 'cancelled';
}

export interface UserItem extends StatusBooleanItem {
  name: string;
  age: number;
}

export interface ProductItem extends StatusBooleanItem {
  name: string;
  price: number;
  description: string;
}

export interface SaleItem extends StatusStringItem {
  product: string;
  prix_total: number;
  active: 'Yes' | 'No';
}

export interface TablePageProps {
  type: EntityType;
}

export interface DashboardTableProps {
  type: EntityType;
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

// Re-export DataItem type from schema
export type { DataItem };