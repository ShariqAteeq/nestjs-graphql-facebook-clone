import { ReactionType } from './../../helpers/constant';
import { GqlAuthGuard } from './../../auth/auth.guard';
import { ReactionService } from './../service/reaction.service';
import { Reaction } from './../entities/reaction';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';

@Resolver(() => Reaction)
export class ReactionResolver {
  constructor(private reactService: ReactionService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Reaction)
  async like(
    @Args('postId') postId: number,
    @Args('reaction') reaction: ReactionType,
    @CurrentUser() user,
  ): Promise<Reaction> {
    return await this.reactService.like(postId, reaction, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async unlike(
    @Args('postId') postId: number,
    @CurrentUser() user,
  ): Promise<Boolean> {
    return await this.reactService.unlike(postId, user);
  }
}
