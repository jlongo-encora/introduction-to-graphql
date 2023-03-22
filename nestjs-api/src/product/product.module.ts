import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { UserFieldResolver } from './user-field.resolver';

@Module({
  imports: [],
  providers: [ProductResolver, UserFieldResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule { }
