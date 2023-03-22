import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) { }

  @Mutation(() => Product)
  async buyProduct(
    @Args({ name: 'uid', type: () => Int }) uid: number,
    @Args({ name: 'pid', type: () => Int }) pid: number,
  ): Promise<Product> {
    try {
      console.info(`[PRODUCT_RESOLVER] Buying product, uid=${uid}, pid=${pid}`);
      return this.productService.buyProduct(uid, pid);
    } catch (err: unknown) {
      console.error(`[PRODUCT_RESOLVER] Failed to get purchases, uid=${uid}, pid=${pid}, error=${err}`);
      throw err;
    }
  }
}
