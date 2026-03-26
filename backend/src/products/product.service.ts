import { Injectable, NotFoundException } from "@nestjs/common";
import { products } from "./product.seed";
import { Product } from "./product.model";

@Injectable()
export class ProductService {
    getAllProducts(category?: string): Product[] {
        if(!category) {
            return products
        }
        
        return products.filter((product) => product.category === category)
    }
    getProductById(id: number): Product {
        const product = products.find((product) => product.id === id);
        if(!product) {
            throw new NotFoundException("Product not found")
        }
        return product;
    }
}