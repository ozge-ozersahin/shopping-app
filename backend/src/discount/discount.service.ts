import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DiscountService {
  validateDiscountCode(code: string, subtotal: number): number {
    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode !== 'SAVE10') {
      throw new BadRequestException('Invalid discount code');
    }

    if (subtotal < 100) {
      throw new BadRequestException(
        'This discount code requires a subtotal of at least £100',
      );
    }

    return subtotal * 0.1;
  }
}