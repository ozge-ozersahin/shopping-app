import { Module } from '@nestjs/common';
import { CartController } from './cart-controller';
import { CartService } from './cart.service';
import { ProductModule } from 'src/products/product.module';

@Module({
    imports: [ProductModule],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule {}