import { Story } from './../entities/story';
import { StoryService } from './../service/story.service';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';
import { FriendStoriesOutput } from '../dto/story';

@Resolver(() => Story)
export class StoryResolver {
  constructor(private storyService: StoryService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Story)
  async addStory(
    @Args('text') text: string,
    @Args('bgColor') bgColor: string,
    @CurrentUser() user,
  ): Promise<Story> {
    return await this.storyService.addStory(text, bgColor, user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [FriendStoriesOutput])
  async getFriendStories(@CurrentUser() user): Promise<FriendStoriesOutput[]> {
    return await this.storyService.getFriendStories(user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteStory(@Args('id') id: number): Promise<Boolean> {
    await this.storyService.deleteStory(id);
    return true;
  }
}
