import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductService } from '../src/products/product.service';
import { products } from '../src/products/product.seed';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();

    // Reset stock to original values before each test
    // since the service mutates the shared products array directly
    products[0].stock = 8;  // Blue Denim Jacket
    products[1].stock = 15; // White Cotton T-Shirt
    products[2].stock = 12; // Black Hoodie
    products[3].stock = 10; // Slim Fit Chinos
    products[4].stock = 6;  // Kids Rain Coat
    products[5].stock = 9;  // Kids Trainers
  });

  // getAllProducts
  it('should return all products when no category is provided', () => {
    const result = productService.getAllProducts();
    expect(result.length).toBe(6);
  });

  it('should filter products by category', () => {
    const result = productService.getAllProducts('men');
    expect(result.every((p) => p.category === 'men')).toBe(true);
  });

  it('should return empty array for unknown category', () => {
    const result = productService.getAllProducts('unknown');
    expect(result).toEqual([]);
  });

  // getProductById
  it('should return a product by id', () => {
    const product = productService.getProductById(1);
    expect(product.id).toBe(1);
    expect(product.name).toBe('Blue Denim Jacket');
  });

  it('should throw NotFoundException for unknown product id', () => {
    expect(() => productService.getProductById(999)).toThrow(NotFoundException);
  });

  // reduceStock
  it('should reduce stock by the given quantity', () => {
    const before = productService.getProductById(1).stock;
    productService.reduceStock(1, 3);
    expect(productService.getProductById(1).stock).toBe(before - 3);
  });

  it('should throw if reducing more stock than available', () => {
    expect(() => productService.reduceStock(1, 999)).toThrow(BadRequestException);
  });

  // restoreStock
  it('should restore stock by the given quantity', () => {
    productService.reduceStock(1, 3);
    const after = productService.getProductById(1).stock;
    productService.restoreStock(1, 3);
    expect(productService.getProductById(1).stock).toBe(after + 3);
  });

  it('should throw if restoring stock for unknown product', () => {
    expect(() => productService.restoreStock(999, 3)).toThrow(NotFoundException);
  });
});