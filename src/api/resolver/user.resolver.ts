import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user';
import { UserService } from '../service/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<User> {
    return await this.userService.getUser(id);
  }
}
