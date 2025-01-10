import { BaseEntity } from './baseEntity';

// Create a new base interface for entities with string status
interface BaseEntityWithStringStatus extends Omit<BaseEntity, 'status'> {
  status: 'draft' | 'completed' | 'cancelled';
}

// Define the entity interfaces
interface Product extends BaseEntityWithStringStatus {
  name: string;
  quantity: number;
  prix: number;
  active: 'Yes' | 'No';
}

interface Sale extends BaseEntityWithStringStatus {
  product: string;
  prix_total: number;
  active: 'Yes' | 'No';
}

// Define the entity map type
export type EntityMap = {
  product: Product;
  sales: Sale;
};

export type EntityType = keyof EntityMap;
export type EntityData<T extends EntityType> = EntityMap[T];

// Export entity types
export type { Product, Sale };