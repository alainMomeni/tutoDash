import type { DataItem } from '@/config/entities';
import { EntityName } from '@/config/entities';

export interface FormPageProps {
  type: EntityName;
  id?: string;
}

export interface FormField {
  type: 'text' | 'number' | 'textarea' | 'enum';
  name: string;
  label: string;
  placeholder?: string;
  options?: readonly string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  relation?: {
    entity: DataItem;
    labelField: string;
    valueField: string;
  };
}

export interface FormConfig {
  titles: {
    page: {
      create: string;
      edit: string;
    };
    button: {
      create: string;
      edit: string;
    };
  };
  fields: FormField[];
}

export interface FormProps {
  id?: string;
  type: DataItem;
}

export interface FormFieldProps {
  field: {
    name: string;
    type: string;
    label?: string;
    placeholder?: string;
    relation?: {
      entity: string;
      labelField: string;
      valueField: string;
    };
    options?: string[];
  };
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  disabled?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}
