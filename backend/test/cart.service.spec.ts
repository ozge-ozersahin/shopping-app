import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../src/cart/cart.service';
import { ProductService } from '../src/products/product.service';
import { DiscountService } from '../src/discount/discount.service';

describe('CartService', () => {
  let cartService: CartService;

  const mockProductService = {
    getProductById: jest.fn(),
    reduceStock: jest.fn(),
    restoreStock: jest.fn(),
  };

  const mockDiscountService = {
    validateDiscountCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: DiscountService,
          useValue: mockDiscountService,
        },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(cartService).toBeDefined();
  });

  it('should create a new cart', () => {
    const cart = cartService.createCart();

    expect(cart.id).toBe(1);
    expect(cart.items).toEqual([]);
    expect(cart.createdAt).toBeDefined();
    expect(cart.updatedAt).toBeDefined();
  });

  it('should return cart by id', () => {
    const createdCart = cartService.createCart();

    const cart = cartService.getCartById(createdCart.id);

    expect(cart.id).toBe(createdCart.id);
    expect(cart.items).toEqual([]);
    expect(cart.totalItems).toBe(0);
    expect(cart.subtotal).toBe(0);
    expect(cart.discount).toBe(0);
    expect(cart.total).toBe(0);
  });

  it('should throw if cart is not found', () => {
    expect(() => cartService.getCartById(999)).toThrow('Cart not found');
  });

  it('should add an item to the cart', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    const result = cartService.addItemToCart(createdCart.id, 1, 2);

    expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
    expect(mockProductService.reduceStock).toHaveBeenCalledWith(1, 2);

    expect(result.items).toEqual([
      {
        productId: 1,
        name: 'T-Shirt',
        price: 50,
        quantity: 2,
        lineTotal: 100,
      },
    ]);
    expect(result.totalItems).toBe(2);
    expect(result.subtotal).toBe(100);
    expect(result.discount).toBe(0);
    expect(result.total).toBe(100);
  });

  it('should throw if quantity is less than 1 when adding item', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    expect(() => cartService.addItemToCart(createdCart.id, 1, 0)).toThrow(
      'Quantity must be at least 1',
    );
  });

  it('should throw if there is not enough stock when adding item', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 1,
    });

    expect(() => cartService.addItemToCart(createdCart.id, 1, 2)).toThrow(
      'Not enough stock for T-Shirt',
    );
  });

  it('should increase item quantity and reduce stock by the difference', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    cartService.addItemToCart(createdCart.id, 1, 2);

    const result = cartService.updateItemQuantity(createdCart.id, 1, 4);

    expect(mockProductService.reduceStock).toHaveBeenCalledWith(1, 2);
    expect(result.items[0].quantity).toBe(4);
    expect(result.totalItems).toBe(4);
    expect(result.subtotal).toBe(200);
    expect(result.total).toBe(200);
  });

  it('should decrease item quantity and restore stock by the difference', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    cartService.addItemToCart(createdCart.id, 1, 4);

    const result = cartService.updateItemQuantity(createdCart.id, 1, 2);

    expect(mockProductService.restoreStock).toHaveBeenCalledWith(1, 2);
    expect(result.items[0].quantity).toBe(2);
    expect(result.totalItems).toBe(2);
    expect(result.subtotal).toBe(100);
    expect(result.total).toBe(100);
  });

  it('should throw if item is not found in cart when updating quantity', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    expect(() => cartService.updateItemQuantity(createdCart.id, 1, 2)).toThrow(
      'Item not found in cart',
    );
  });

  it('should throw if updated quantity is less than 1', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    cartService.addItemToCart(createdCart.id, 1, 2);

    expect(() => cartService.updateItemQuantity(createdCart.id, 1, 0)).toThrow(
      'Quantity must be at least 1',
    );
  });

  it('should remove an item from the cart and restore stock', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    cartService.addItemToCart(createdCart.id, 1, 2);

    const result = cartService.removeItemFromCart(createdCart.id, 1);

    expect(mockProductService.restoreStock).toHaveBeenCalledWith(1, 2);
    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
    expect(result.subtotal).toBe(0);
    expect(result.total).toBe(0);
  });

  it('should throw if item is not found in cart when removing item', () => {
    const createdCart = cartService.createCart();

    expect(() => cartService.removeItemFromCart(createdCart.id, 1)).toThrow(
      'Item not found in cart',
    );
  });

  it('should apply discount to the cart', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 60,
      stock: 10,
    });

    mockDiscountService.validateDiscountCode.mockReturnValue(12);

    cartService.addItemToCart(createdCart.id, 1, 2);

    const result = cartService.applyDiscount(createdCart.id, 'SAVE10');

    expect(mockDiscountService.validateDiscountCode).toHaveBeenCalledWith(
      'SAVE10',
      120,
    );
    expect(result.discount).toBe(12);
    expect(result.total).toBe(108);
  });

  it('should throw if discount code is invalid', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 60,
      stock: 10,
    });

    mockDiscountService.validateDiscountCode.mockImplementation(() => {
      throw new Error('Invalid discount code');
    });

    cartService.addItemToCart(createdCart.id, 1, 2);

    expect(() => cartService.applyDiscount(createdCart.id, 'WRONGCODE')).toThrow(
      'Invalid discount code',
    );
  });

  it('should checkout successfully and clear the cart', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    cartService.addItemToCart(createdCart.id, 1, 2);

    const result = cartService.checkout(createdCart.id);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Checkout successful');
    expect(result.order.items).toEqual([
      {
        productId: 1,
        name: 'T-Shirt',
        price: 50,
        quantity: 2,
        lineTotal: 100,
      },
    ]);
    expect(result.order.total).toBe(100);

    const cartAfterCheckout = cartService.getCartById(createdCart.id);
    expect(cartAfterCheckout.items).toEqual([]);
    expect(cartAfterCheckout.totalItems).toBe(0);
    expect(cartAfterCheckout.total).toBe(0);
  });

  it('should throw if checkout is attempted with an empty cart', () => {
    const createdCart = cartService.createCart();

    expect(() => cartService.checkout(createdCart.id)).toThrow('Cart is empty');
  });

  it('should throw if cart has expired', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    cartService.addItemToCart(createdCart.id, 1, 2);

    const carts = (cartService as any).carts;
    carts[0].updatedAt = Date.now() - 3 * 60 * 1000;

    expect(() => cartService.getCartById(createdCart.id)).toThrow(
      'Cart has expired',
    );
  });

  it('should restore stock when cart has expired', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    cartService.addItemToCart(createdCart.id, 1, 2);

    const carts = (cartService as any).carts;
    carts[0].updatedAt = Date.now() - 3 * 60 * 1000;

    expect(() => cartService.getCartById(createdCart.id)).toThrow(
      'Cart has expired',
    );

    expect(mockProductService.restoreStock).toHaveBeenCalledWith(1, 2);
  });
  it('should add quantity to existing item if product already in cart', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 10,
    });

    cartService.addItemToCart(createdCart.id, 1, 2);
    const result = cartService.addItemToCart(createdCart.id, 1, 3);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(5);
  });

  it('should throw if not enough stock when increasing quantity', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 2,
    });

    cartService.addItemToCart(createdCart.id, 1, 2);

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 50,
      stock: 0,
    });

    expect(() =>
      cartService.updateItemQuantity(createdCart.id, 1, 5),
    ).toThrow('Not enough stock for T-Shirt');
  });

  it('should remove discount code from cart if it becomes invalid during response build', () => {
    const createdCart = cartService.createCart();

    mockProductService.getProductById.mockReturnValue({
      id: 1,
      name: 'T-Shirt',
      price: 60,
      stock: 10,
    });

    mockDiscountService.validateDiscountCode.mockReturnValue(12);
    cartService.addItemToCart(createdCart.id, 1, 2);
    cartService.applyDiscount(createdCart.id, 'SAVE10');

    // Simulate discount becoming invalid
    mockDiscountService.validateDiscountCode.mockImplementation(() => {
      throw new Error('Discount no longer valid');
    });

    const result = cartService.getCartById(createdCart.id);

    expect(result.discount).toBe(0);
  });
});