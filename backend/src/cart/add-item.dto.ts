// Request body used when adding a product to the cart

import { IsInt, Min } from "class-validator";

export class AddItemDto {
    @IsInt()
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;
  }