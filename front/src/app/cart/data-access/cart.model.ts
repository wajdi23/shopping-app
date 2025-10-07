import { Product } from "app/products/data-access/product.model";

export interface CartItem {
  createdAt: string;
  id: number;
  productId: number;
  quantity: number;
  userId: number;
  updatedAt: string;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
