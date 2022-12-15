import { Story } from './../entities/story';
import { StoryService } from './../service/story.service';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';

@Resolver(() => Story)
export class StoryResolver {
  constructor(private storyService: StoryService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Story)
  async manageFriends(
    @Args('text') text: string,
    @Args('bgColor') bgColor: string,
    @CurrentUser() user,
  ): Promise<Story> {
    return await this.storyService.addStory(text, bgColor, user);
  }
}
