import { Package, ShoppingCart } from 'lucide-react';

type FieldType = 'text' | 'number' | 'boolean' | 'enum';

export const entities = {
  product: {
    name: 'product',
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
        validation: {
          required: true,
          minLength: 2
        },
        filterable: true,
        hideInForm: false
      },
      {
        name: 'quantity',
        type: 'number',
        label: 'Quantity',
        placeholder: 'Enter quantity',
        validation: {
          required: true,
          min: 0
        },
        filterable: true,
        hideInForm: false
      },
      {
        name: 'prix',
        type: 'number',
        label: 'Price',
        placeholder: 'Enter price',
        validation: {
          required: true,
          min: 0
        },
        filterable: true,
        hideInForm: false
      },
      {
        name: 'status',
        type: 'enum',
        label: 'Status',
        options: ['draft', 'completed', 'cancelled'],
        filterable: true,
        hideInForm: true,
        hideInTable: true,
        defaultValue: 'draft'
      },
      {
        name: 'active',
        type: 'enum',
        label: 'Active',
        options: ['Yes', 'No'],
        filterable: true,
        hideInForm: true,
        defaultValue: 'Yes'
      }
    ]
  },
  sales: {
    name: 'sales',
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
        options: [],
        validation: {
          required: true
        },
        filterable: true,
        relation: {
          entity: 'product',
          labelField: 'name',
          valueField: 'id'
        }
      },
      {
        name: 'prix_total',
        type: 'number',
        label: 'Total Price',
        placeholder: 'Auto-calculated from product',
        validation: {
          required: true,
          min: 0
        },
        filterable: true,
        hideInForm: false,
        readOnly: true
      },
      {
        name: 'status',
        type: 'enum',
        label: 'Status',
        options: ['draft', 'completed', 'cancelled'],
        filterable: true,
        hideInForm: true,
        hideInTable: true,
        defaultValue: 'draft'
      },
      {
        name: 'active',
        type: 'enum',
        label: 'Active',
        options: ['Yes', 'No'],
        filterable: true,
        hideInForm: true,
        defaultValue: 'Yes'
      }
    ]
  }
} as const;

export type EntityConfig = typeof entities;
export type EntityName = keyof EntityConfig;