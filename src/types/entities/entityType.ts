import { entities } from "@/config/entities";

export interface FieldConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  filterable?: boolean;
  relation?: {
    entity: string;
    labelField: string;
    valueField: string;
  };
}

export interface EntityDisplay {
  list: string;
  create: string;
  edit: string;
}

export interface EntityConfig {
  name: string;
  route: string;
  icon: React.ComponentType<any>;
  display: EntityDisplay;
  fields: FieldConfig[];
}

export interface BaseEntity {
  id: string;
  [key: string]: any;
}

export interface BaseEntityWithStringStatus extends BaseEntity {
  status: 'Yes' | 'No';
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total_count?: number;
    filter_count?: number;
  };
  errors?: ValidationError[];
}

// Create a new base interface for entities with string status
export interface BaseEntityWithWorkflowStatus extends Omit<BaseEntity, 'status'> {
  status: 'draft' | 'completed' | 'cancelled';
}

export type FieldType = 'text' | 'number' | 'enum' | 'boolean';

export type EntityName = keyof typeof entities;

export interface DataItem {
  id: string;
  [key: string]: any;
}

