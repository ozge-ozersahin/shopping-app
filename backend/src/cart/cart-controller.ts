import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import type { Cart, CartResponse } from './cart.model';
import type { AddItemDto } from './add-item.dto';
import { UpdateItemDto } from './update-item.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    createCart(): Cart {
        return this.cartService.createCart();
    }

    @Get(':id')
    getCartById(@Param('id') id: string): CartResponse {
        return this.cartService.getCartById(Number(id));
    }

    @Post(':id/items')
    addItemToCart(
        @Param('id') id: string,
        @Body() body: AddItemDto,
    ): CartResponse {
        return this.cartService.addItemToCart(
            Number(id),
            body.productId,
            body.quantity,
        );
    }

    @Patch(':id/items/:productId')
    updateItemQuantity(
        @Param('id') id: string,
        @Param('productId') productId: string,
        @Body() body: UpdateItemDto,
    ): CartResponse {
        return this.cartService.updateItemQuantity(
            Number(id),
            Number(productId),
            body.quantity,
        );
    }

    @Delete(':id/items/:productId')
    removeItemFromCart(
        @Param('id') id: string,
        @Param('productId') productId: string,
    ): CartResponse {
        return this.cartService.removeItemFromCart(
            Number(id),
            Number(productId),
        );
    }

    @Post(':id/checkout')
    checkout(@Param('id') id: string) {
        return this.cartService.checkout(Number(id));
    }

    @Post(':id/discount')
    applyDiscount(
        @Param('id') id: string,
        @Body() body: { code: string },
    ) {
        return this.cartService.applyDiscount(Number(id), body.code);
    }
}