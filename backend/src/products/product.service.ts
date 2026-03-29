import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { products } from "./product.seed";
import { Product } from "./product.model";

@Injectable()
export class ProductService {
    // Returns all products or filters them by category
    getAllProducts(category?: string): Product[] {
        if (!category) {
            return products
        }

        return products.filter((product) => product.category === category)
    }
    // Returns a single product by id
    getProductById(id: number): Product {
        const product = products.find((product) => product.id === id);
        if (!product) {
            throw new NotFoundException("Product not found")
        }
        return product;
    }

    // Reduces stock when items are reserved in the cart
    reduceStock(productId: number, quantity: number) {
        const product = this.getProductById(productId);

        if (product.stock < quantity) {
            throw new BadRequestException('Not enough stock');
        }

        product.stock -= quantity;
    }
    
     // Restores stock when items are removed, carts expire, or checkout is cleared
    restoreStock(productId: number, quantity: number) {
        const product = this.getProductById(productId);
        product.stock += quantity;
    }
}