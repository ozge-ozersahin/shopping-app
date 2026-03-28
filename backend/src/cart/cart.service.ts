import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Cart, CartResponse } from './cart.model';
import { ProductService } from 'src/products/product.service';

@Injectable()
export class CartService {
  private carts: Cart[] = [];

  constructor(private readonly productService: ProductService) { }

  private calculateDiscount(subtotal: number): number {
    if (subtotal >= 100) {
      return subtotal * 0.1;
    }

    return 0;
  }

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
  }

  private getActiveCart(cartId: number): Cart {
    const cart = this.carts.find((item) => item.id === cartId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (this.isCartExpired(cart)) {
      cart.items = [];
      throw new BadRequestException('Cart has expired');
    }

    return cart;
  }

  private buildCartResponse(cart: Cart): CartResponse {
    const items = cart.items.map((item) => {
      const product = this.productService.getProductById(item.productId);

      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const discount = this.calculateDiscount(subtotal);
    const total = subtotal - discount;

    return {
      id: cart.id,
      items,
      totalItems,
      subtotal,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      discount,
      total,
    };
  }

  getCartById(id: number): CartResponse {
    const cart = this.getActiveCart(id);
    return this.buildCartResponse(cart);
  }

  addItemToCart(cartId: number, productId: number, quantity: number): CartResponse {
    const cart = this.getActiveCart(cartId);

    const product = this.productService.getProductById(productId);

    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + quantity;

    if (newQuantity > product.stock) {
      throw new BadRequestException(`Not enough stock for ${product.name}`);
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    cart.updatedAt = Date.now();

    return this.buildCartResponse(cart);
  }

  updateItemQuantity(
    cartId: number,
    productId: number,
    quantity: number,
  ): CartResponse {
    const cart = this.getActiveCart(cartId);

    const product = this.productService.getProductById(productId);

    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (!existingItem) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity > product.stock) {
      throw new BadRequestException(`Not enough stock for ${product.name}`);
    }

    existingItem.quantity = quantity;
    cart.updatedAt = Date.now();

    return this.buildCartResponse(cart);
  }

  removeItemFromCart(cartId: number, productId: number): CartResponse {
    const cart = this.getActiveCart(cartId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items.splice(itemIndex, 1);
    cart.updatedAt = Date.now();

    return this.buildCartResponse(cart);
  }

  checkout(cartId: number) {
    const cart = this.getActiveCart(cartId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }


    for (const item of cart.items) {
      const product = this.productService.getProductById(item.productId);

      if (item.quantity > product.stock) {
        throw new BadRequestException(
          `Not enough stock for ${product.name}`,
        );
      }
    }


    for (const item of cart.items) {
      this.productService.reduceStock(item.productId, item.quantity);
    }

    const response = this.buildCartResponse(cart);

    cart.items = [];
    cart.updatedAt = Date.now();

    return {
      success: true,
      message: 'Checkout successful',
      order: response,
    };
  }
}