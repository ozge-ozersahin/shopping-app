import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DiscountService {
    // Validates a discount code and returns the discount amount
  validateDiscountCode(code: string, subtotal: number): number {
    const normalizedCode = code.trim().toUpperCase();

    // Only SAVE10 is supported in this implementation
    if (normalizedCode !== 'SAVE10') {
      throw new BadRequestException('Invalid discount code');
    }

    // The discount only applies to carts with subtotal of at least £100
    if (subtotal < 100) {
      throw new BadRequestException(
        'This discount code requires a subtotal of at least £100',
      );
    }

    // Returns a 10% discount based on the cart subtotal
    return subtotal * 0.1;
  }
}