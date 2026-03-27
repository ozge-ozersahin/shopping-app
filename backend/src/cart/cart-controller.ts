import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import type { Cart } from './cart.model';
import type { AddItemDto } from './add-item.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    createCart(): Cart {
        return this.cartService.createCart();
    }

    @Get(':id')
    getCartById(@Param('id') id: string): Cart {
        return this.cartService.getCartById(Number(id));
    }

    @Post(':id/items')
    addItemToCart(
        @Param('id') id: string,
        @Body() body: AddItemDto,
    ): Cart {
        return this.cartService.addItemToCart(
            Number(id),
            body.productId,
            body.quantity,
        );
    }
}