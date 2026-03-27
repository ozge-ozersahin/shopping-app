import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Cart } from './cart.model';
import { ProductService } from 'src/products/product.service';

@Injectable()
export class CartService {
  private carts: Cart[] = [];
  constructor(private readonly productService: ProductService) { }

  createCart(): Cart {
    const now = Date.now();

    const newCart: Cart = {
      id: this.carts.length + 1,
      items: [],
      createdAt: now,
      updatedAt: now,
    };

    this.carts.push(newCart);

    return newCart;
  }
  private isCartExpired(cart: Cart): boolean {
    const twoMinutesInMilliseconds = 2 * 60 * 1000;
    return Date.now() - cart.updatedAt > twoMinutesInMilliseconds;
    // const testMinutesInMilliseconds = 10 * 1000;
    // return Date.now() - cart.updatedAt > testMinutesInMilliseconds;
  }

  getCartById(id: number): Cart {
    const cart = this.carts.find((cart) => cart.id === id)
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }
    if (this.isCartExpired(cart)) {
      throw new BadRequestException("Cart has expired")
    }
    return cart;
  }

  addItemToCart(cartId: number, productId: number, quantity: number): Cart {
    const cart = this.getCartById(cartId);

    this.productService.getProductById(productId)

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    cart.updatedAt = Date.now();

    return cart;
  }
}