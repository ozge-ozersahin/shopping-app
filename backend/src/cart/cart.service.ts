import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Cart, CartResponse } from './cart.model';
import { ProductService } from 'src/products/product.service';
import { DiscountService } from 'src/discount/discount.service';

@Injectable()
export class CartService {
   // In-memory cart storage
  private carts: Cart[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly discountService: DiscountService,
  ) {}
  
  // Creates a new empty cart session
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

  // Checks whether a cart has been inactive for more than 2 minutes
  private isCartExpired(cart: Cart): boolean {
    const twoMinutesInMilliseconds = 2 * 60 * 1000;
    return Date.now() - cart.updatedAt > twoMinutesInMilliseconds;
  }

  // Restores reserved stock back to products when a cart expires or items are removed
  private releaseCartStock(cart: Cart) {
    for (const item of cart.items) {
      this.productService.restoreStock(item.productId, item.quantity);
    }
  }

  // Returns an active cart or throws if the cart does not exist or has expired
  private getActiveCart(cartId: number): Cart {
    const cart = this.carts.find((item) => item.id === cartId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (this.isCartExpired(cart)) {
      this.releaseCartStock(cart);
      cart.items = [];
      cart.discountCode = undefined;
      throw new BadRequestException('Cart has expired');
    }

    return cart;
  }

  // Builds an enriched cart response with product details, totals and discount
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

    let discount = 0;

    if (cart.discountCode) {
      try {
        discount = this.discountService.validateDiscountCode(
          cart.discountCode,
          subtotal,
        );
      } catch {
        // If the stored discount code is no longer valid, remove it from the cart
        cart.discountCode = undefined;
        discount = 0;
      }
    }

    const total = subtotal - discount;

    return {
      id: cart.id,
      items,
      totalItems,
      subtotal,
      discount,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  // Applies a discount code after validating it against the cart subtotal
  applyDiscount(cartId: number, code: string): CartResponse {
    const cart = this.getActiveCart(cartId);

    const subtotal = cart.items.reduce((sum, item) => {
      const product = this.productService.getProductById(item.productId);
      return sum + product.price * item.quantity;
    }, 0);

    this.discountService.validateDiscountCode(code, subtotal);

    cart.discountCode = code.trim().toUpperCase();
    cart.updatedAt = Date.now();

    return this.buildCartResponse(cart);
  }

   // Returns a cart by id in API response format
  getCartById(id: number): CartResponse {
    const cart = this.getActiveCart(id);
    return this.buildCartResponse(cart);
  }

  // Adds an item to the cart and reserves stock immediately
  addItemToCart(
    cartId: number,
    productId: number,
    quantity: number,
  ): CartResponse {
    const cart = this.getActiveCart(cartId);
    const product = this.productService.getProductById(productId);

    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    if (quantity > product.stock) {
      throw new BadRequestException(`Not enough stock for ${product.name}`);
    }

    const existingItem = cart.items.find((item) => item.productId === productId);

    this.productService.reduceStock(productId, quantity);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    cart.updatedAt = Date.now();

    return this.buildCartResponse(cart);
  }

  // Updates the quantity of an existing cart item and adjusts reserved stock accordingly
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

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (!existingItem) {
      throw new NotFoundException('Item not found in cart');
    }

    const difference = quantity - existingItem.quantity;

    if (difference > 0) {
      if (difference > product.stock) {
        throw new BadRequestException(`Not enough stock for ${product.name}`);
      }

      this.productService.reduceStock(productId, difference);
    }

    if (difference < 0) {
      this.productService.restoreStock(productId, Math.abs(difference));
    }

    existingItem.quantity = quantity;
    cart.updatedAt = Date.now();

    return this.buildCartResponse(cart);
  }

  // Removes an item from the cart and releases its reserved stock
  removeItemFromCart(cartId: number, productId: number): CartResponse {
    const cart = this.getActiveCart(cartId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    const itemToRemove = cart.items[itemIndex];

    this.productService.restoreStock(
      itemToRemove.productId,
      itemToRemove.quantity,
    );

    cart.items.splice(itemIndex, 1);
    cart.updatedAt = Date.now();

    return this.buildCartResponse(cart);
  }

  // Finalises the order and clears the cart after a successful checkout
  checkout(cartId: number) {
    const cart = this.getActiveCart(cartId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const response = this.buildCartResponse(cart);

    cart.items = [];
    cart.discountCode = undefined;
    cart.updatedAt = Date.now();

    return {
      success: true,
      message: 'Checkout successful',
      order: response,
    };
  }
}