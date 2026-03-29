import { BadRequestException } from '@nestjs/common';
import { DiscountService } from '../src/discount/discount.service';

describe('DiscountService', () => {
  let discountService: DiscountService;

  beforeEach(() => {
    discountService = new DiscountService();
  });

  it('should return 10% discount for valid code and subtotal', () => {
    const discount = discountService.validateDiscountCode('SAVE10', 100);
    expect(discount).toBe(10);
  });

  it('should accept lowercase code', () => {
    const discount = discountService.validateDiscountCode('save10', 100);
    expect(discount).toBe(10);
  });

  it('should accept code with extra spaces', () => {
    const discount = discountService.validateDiscountCode('  SAVE10  ', 100);
    expect(discount).toBe(10);
  });

  it('should calculate correct discount for higher subtotal', () => {
    const discount = discountService.validateDiscountCode('SAVE10', 200);
    expect(discount).toBe(20);
  });

  it('should throw if discount code is invalid', () => {
    expect(() =>
      discountService.validateDiscountCode('INVALIDCODE', 100),
    ).toThrow(BadRequestException);
  });

  it('should throw if subtotal is below £100', () => {
    expect(() =>
      discountService.validateDiscountCode('SAVE10', 99),
    ).toThrow(BadRequestException);
  });

  it('should throw if subtotal is exactly 0', () => {
    expect(() =>
      discountService.validateDiscountCode('SAVE10', 0),
    ).toThrow(BadRequestException);
  });
});