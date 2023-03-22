import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => User)
export class UserFieldResolver {
  constructor(private readonly productService: ProductService) { }

  @ResolveField(() => [Product], { name: 'purchases', nullable: true })
  async purchases(@Parent() user: User): Promise<Product[]> {
    const {
      uid,
    } = user;
    try {
      console.info(`[USER_FIELD_RESOLVER] Getting purchases, uid=${uid}`);
      return this.productService.getPurchases(uid);
    } catch (err: unknown) {
      console.error(`[USER_FIELD_RESOLVER] Failed to get purchases, uid=${uid}, error=${err}`);
      throw err;
    }
  }
}
