import { Args, Int, Mutation, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) { }

  @ResolveField(() => [Product], { name: 'purchases', nullable: true })
  async purchases(@Args({ name: 'uid', type: () => Int }) uid: number): Promise<Product[]> {
    try {
      console.info(`[PRODUCT_RESOLVER] Getting purchases, uid=${uid}`);
      return this.productService.getPurchases(uid);
    } catch (err: unknown) {
      console.error(`[PRODUCT_RESOLVER] Failed to get purchases, uid=${uid}, error=${err}`);
      throw err;
    }
  }

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
