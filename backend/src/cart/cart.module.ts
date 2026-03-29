import { Module } from '@nestjs/common';
import { CartController } from './cart-controller';
import { CartService } from './cart.service';
import { ProductModule } from 'src/products/product.module';
import { DiscountService } from 'src/discount/discount.service';

@Module({
    imports: [ProductModule],
    controllers: [CartController],
    providers: [CartService, DiscountService],
    exports: [CartService],
})
export class CartModule {}