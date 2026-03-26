import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import type { Product } from "./product.model";

@Controller("products")
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @Get()
    getAllProducts(@Query("category") category?: string): Product[] {
        return this.productService.getAllProducts(category);
    }

    @Get(':id')
    getProductById(@Param('id') id: string): Product {
        return this.productService.getProductById(Number(id));
    }
}