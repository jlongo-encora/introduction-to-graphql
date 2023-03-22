import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query(() => User, { nullable: true })
  async user(
    @Args({ name: 'uid', type: () => Int }) uid: number
  ): Promise<User | undefined> {
    try {
      console.info(`[USER_RESOLVER] Getting user, uid=${uid}`);
      return this.userService.getUser(uid);
    } catch (err: unknown) {
      console.error(`[USER_RESOLVER] Failed to get user, uid=${uid}, error=${err}`);
      throw err;
    }
  }
}
