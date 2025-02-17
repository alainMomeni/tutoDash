import { entities } from '@/config/entities';
import { FormConfig } from '@/types/form/formTypes';
import { TableConfig } from '@/types/table/tableType';
import type { FieldConfig } from '@/types/entities/entityType';
import type { FormField } from '@/types/form/formTypes';
import type { EntityName } from '@/config/entities';
import type { Column } from '@/types/table/tableType';

// Get entity field type with extended properties
type EntityFieldType = (typeof entities)[EntityName]['fields'][number];

// Define base field properties (if not already defined)
export interface BaseField {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'enum';
  label: string;
  placeholder?: string;
  options?: string[];
  filterable?: boolean;
  hideInForm?: boolean;
  hideInTable?: boolean;
  defaultValue?: string | number | boolean;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  relation?: {
    // Declare the relation.entity as a union of entity names (adjust as needed)
    entity: 'product' | 'sales';
    labelField: string;
    valueField: string;
  };
}

// Combined type ensuring all fields have necessary properties
type EntityField = BaseField & EntityFieldType;

export const generateFormSchema = (entityName: EntityName): FormConfig => {
  const entity = entities[entityName];
  
  return {
    titles: {
      page: {
        create: entity.display.create,
        edit: entity.display.edit
      },
      button: {
        create: 'Create',
        edit: 'Update'
      }
    },
    fields: (entity.fields as FieldConfig[])
      .filter((field) => !('hideInForm' in field) || !field.hideInForm)
      .map((field): FormField => {
        const { type, ...rest } = field;
        return {
          ...rest,
          type:
            (type === 'enum' || type === 'boolean'
              ? 'text'
              : type) as 'number' | 'text' | 'enum' | 'textarea',
          placeholder: field.placeholder || '',
          validation:
            field.required !== undefined ||
            field.min !== undefined ||
            field.max !== undefined ||
            field.minLength !== undefined ||
            field.maxLength !== undefined ||
            field.pattern !== undefined
              ? {
                  required: field.required,
                  min: field.min,
                  max: field.max,
                  minLength: field.minLength,
                  maxLength: field.maxLength,
                  pattern: field.pattern,
                }
              : undefined,
          relation: field.relation
            ? { ...field.relation, entity: { id: field.relation.entity } }
            : undefined,
        };
      }),
  };
};

const generateRenderer = (field: EntityField) => {
  switch (field.type) {
    case 'number':
      return (value: number) => field.name.includes('price') || field.name.includes('prix') 
        ? `${value?.toFixed(2)} €` 
        : String(value ?? '');
    case 'enum':
      return (value: string | null) => {
        if (!value) return '';
        if (field.name === 'product' || field.relation?.entity === 'product') {
          return value;
        }
        return value.charAt(0).toUpperCase() + value.slice(1);
      };
    case 'text':
      return (value: string) => value ?? '';
    default:
      return (value: any) => value ?? '';
  }
};

export const generateTableSchema = (entityName: EntityName): TableConfig => {
  const entity = entities[entityName];
  
  return {
    title: entity.display.list,
    pageTitle: entity.display.list,
    columns: (entity.fields as FieldConfig[])
      .filter((field) => !('hideInTable' in field) || !field.hideInTable)
      .map((field: FieldConfig): EntityField => {
        const { placeholder, minLength, min, ...restField } = field;
        return {
          ...restField,
          required: field.required ?? false,
          options: field.options ?? [],
          filterable: field.filterable ?? false,
          relation: field.relation
            ? { ...field.relation, entity: field.relation.entity as "product" | "sales" }
            : undefined,
        };
      })
      .map((field: EntityField): Column => ({
        key: field.name,
        label: field.label,
        filterable: field.filterable ?? false,
        render: generateRenderer(field)
      })),
    filters: {
      searchable: true,
      statusFilter: true
    }
  };
};