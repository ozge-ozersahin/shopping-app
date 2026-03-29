import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './products/product.module';

@Module({
  imports: [CartModule , ProductModule],
})
export class AppModule {}
