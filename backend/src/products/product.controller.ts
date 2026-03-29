import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import type { Product } from "./product.model";

@Controller("products")
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    // Returns all products, optionally filtered by category
    @Get()
    getAllProducts(@Query("category") category?: string): Product[] {
        return this.productService.getAllProducts(category);
    }

    // Returns a single product by id
    @Get(':id')
    getProductById(@Param('id') id: string): Product {
        return this.productService.getProductById(Number(id));
    }
}