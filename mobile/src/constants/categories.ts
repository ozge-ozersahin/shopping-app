import type { Category } from "../types/product";

export type CategoryOption = {
  id: Category;
  title: string;
  image: string;
};

export const categories: CategoryOption[] = [
  {
    id: 'women',
    title: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  },
  {
    id: 'men',
    title: 'Men',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
  },
  {
    id: 'kids',
    title: 'Kids',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea',
  },
];