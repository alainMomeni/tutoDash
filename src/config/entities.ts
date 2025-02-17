import { Package, ShoppingCart } from 'lucide-react';
import type { BaseEntityWithStringStatus} from '@/types/entities/entityType';

// Entity definitions
export interface Product extends BaseEntityWithStringStatus {
  name: string;
  quantity: number;
  prix: number;
  active: 'Yes' | 'No';
}

export interface Sale extends BaseEntityWithStringStatus {
  product: string;
  prix_total: number;
  active: 'Yes' | 'No';
}

// Map of all defined entities
export type EntityMap = {
  product: Product;
  sales: Sale;
};

// Centralized entities configuration
export const entities = {
  product: {
    name: 'Product',
    route: 'product',
    icon: Package,
    display: {
      list: 'Products List',
      create: 'Create Product',
      edit: 'Edit Product'
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Product name',
        required: true,
        minLength: 2,
        filterable: true
      },
      {
        name: 'quantity',
        type: 'number',
        label: 'Quantity',
        placeholder: 'Enter quantity',
        required: true,
        min: 0,
        filterable: true
      },
      {
        name: 'prix',
        type: 'number',
        label: 'Price',
        placeholder: 'Enter price',
        required: true,
        min: 0,
        filterable: true
      },
      {
        name: 'active',
        type: 'enum',
        label: 'Active',
        options: ['Yes', 'No'],
        required: true,
        filterable: true
      }
    ]
  },
  sales: {
    name: 'Sales',
    route: 'sales',
    icon: ShoppingCart,
    display: {
      list: 'Sales List',
      create: 'Create Sale',
      edit: 'Edit Sale'
    },
    fields: [
      {
        name: 'product',
        type: 'enum',
        label: 'Product',
        relation: {
          entity: 'product',
          labelField: 'name',
          valueField: 'id'
        },
        required: true,
        filterable: true
      },
      {
        name: 'prix_total',
        type: 'number',
        label: 'Total Price',
        placeholder: 'Auto-calculated from product',
        required: true,
        min: 0,
        filterable: true
      },
      {
        name: 'active',
        type: 'enum',
        label: 'Active',
        options: ['Yes', 'No'],
        required: true,
        filterable: true
      }
    ]
  }
};

// Optionally, export other types like DataItem if needed:
export interface DataItem {
  id: string;
  [key: string]: any;
}

// Re-export EntityName from your types file using export type for isolatedModules
export type { EntityName } from '@/types/entities/entityType';
