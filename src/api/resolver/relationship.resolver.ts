import { UserService } from 'src/api/service/user.service';
import {
  ManageFriendRequestInput,
  GetUserFriendsInput,
} from './../dto/relationship';
import { RelationshipService } from './../service/relationship.service';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { Relationship } from './../entities/relationship';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from '../entities/user';

@Resolver(() => Relationship)
export class RelationshipResolver {
  constructor(
    private relService: RelationshipService,
    private userService: UserService,
  ) {}

  // ========== Manage Friend Request ============ \\
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Relationship)
  async manageFriends(
    @Args('input') input: ManageFriendRequestInput,
    @CurrentUser() user,
  ): Promise<Relationship> {
    return await this.relService.manageFriends(input, user);
  }

  // ========== Delete Friend Request ============ \\
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteFriendRequest(
    @Args('otherUserId') otherUserId: string,
    @CurrentUser() user,
  ): Promise<Boolean> {
    return await this.relService.deleteFriendRequest(otherUserId, user);
  }

  // ========== Get Friends ============ \\
  @UseGuards(GqlAuthGuard)
  @Query(() => [Relationship])
  async getUserFriends(
    @Args('input') input: GetUserFriendsInput,
    // @CurrentUser() user,
  ): Promise<Relationship[]> {
    return await this.relService.getUserFriends(input);
  }

  // ========== Get Suggested Friends ============ \\
  @UseGuards(GqlAuthGuard)
  @Query(() => [Relationship])
  async getSuggestedFriends(@CurrentUser() user): Promise<Relationship[]> {
    return await this.relService.getSuggestedFriends(user);
  }

  // ========== Field Resolvers ============ \\
  @ResolveField()
  async otherUser(@Parent() rel: Relationship): Promise<User> {
    return await this.userService.getUser(rel.otherUserId);
  }

  @ResolveField()
  async user(@Parent() rel: Relationship): Promise<User> {
    return await this.userService.getUser(rel.userId);
  }
}
