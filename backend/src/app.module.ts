import { Module } from '@nestjs/common';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/product.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
