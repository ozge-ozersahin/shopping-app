export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: 'women' | 'men' | 'kids';
    stock: number;
    imageUrl: string;
}