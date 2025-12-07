import { Product } from './services/ItemsService';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product?: Product;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}

export type { Product } from './services/ItemsService';

