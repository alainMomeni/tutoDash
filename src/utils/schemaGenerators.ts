import { entities, EntityName } from '@/config/entities';
import { FormConfig } from '@/types/form/formTypes';
import { TableConfig } from '@/types/table/tableType';

// Define base field properties
type BaseField = {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'enum';
  label: string;
  placeholder?: string;
  options?: readonly string[];
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
    entity: EntityName;
    labelField: string;
    valueField: string;
  };
};

// Get entity field type with extended properties
type EntityFieldType = (typeof entities)[EntityName]['fields'][number];

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
    fields: entity.fields
      .filter(field => !('hideInForm' in field) || !field.hideInForm)
      .map(field => ({
        ...field,
        type: ((field.type as string) === 'enum' || (field.type as string) === 'boolean') ? 'text' : (field.type as 'text' | 'number'),
        placeholder: 'placeholder' in field ? field.placeholder : '',
        validation: 'validation' in field ? field.validation : undefined,
        relation: 'relation' in field ? field.relation : undefined
      }))
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
    columns: entity.fields
      .filter(field => !('hideInTable' in field) || !field.hideInTable)
      .map(field => ({
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