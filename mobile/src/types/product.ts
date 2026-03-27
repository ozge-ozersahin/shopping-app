import type { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  imageUrl?: string;
}