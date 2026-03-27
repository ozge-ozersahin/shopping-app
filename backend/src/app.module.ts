import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/product.service';
import { ProductModule } from './products/product.module';

@Module({
  imports: [CartModule , ProductModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
