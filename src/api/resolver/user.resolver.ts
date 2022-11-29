import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Journey } from '../entities/journey';
import { User } from '../entities/user';
import { JourneyService } from '../service/journey.service';
import { UserService } from '../service/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private journeyService: JourneyService,
  ) {}

  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<User> {
    return await this.userService.getUser(id);
  }

  @ResolveField()
  async journey(@Parent() user: User): Promise<Journey[]> {
    return await this.journeyService.getUserJourney(user.id);
  }
}
