import type { Product, Sale } from './entities';

// Base interfaces with different status types
export interface BaseBooleanItem {
  id: string;
  name: string;
  status: boolean;
}

export interface BaseStringItem {
  id: string;
  name: string;
  status: 'draft' | 'completed' | 'cancelled';
}

// Entity interfaces
export interface ProductItem extends BaseStringItem {
  price: number;
  quantity: number;
}

export interface SaleItem extends BaseStringItem {
  product: string;
  prix_total: number;
  active: 'Yes' | 'No';
}

export type DataItem = ProductItem | SaleItem;

// Update EntityType to only include 'product' and 'sales'
export type EntityType = 'product' | 'sales';

export type EntityMap = {
  product: Product;
  sales: Sale;
};

// Re-export entity types
export type { Product, Sale };