import { GqlAuthGuard } from 'src/auth/auth.guard';
import { Post } from './../entities/post';
import { PostService } from './../service/post.service';
import { TimelineService } from './../service/timeline.service';
import { Timeline } from './../entities/timeline';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Timeline)
export class TimelineResolver {
  constructor(
    private timelineService: TimelineService,
    private postService: PostService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Timeline])
  async getMyTimeline(@CurrentUser() user) {
    return await this.timelineService.getMyTimeline(user);
  }

  @ResolveField()
  async post(@Parent() rel: Timeline): Promise<Post> {
    return await this.postService.getPost(rel.postId);
  }
}
