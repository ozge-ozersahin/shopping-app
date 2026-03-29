import { IsInt, Min } from 'class-validator';

 // Updated quantity must be a positive integer
export class UpdateItemDto {
  @IsInt()
  @Min(1)
  quantity: number;
}