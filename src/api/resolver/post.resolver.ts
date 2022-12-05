import { CreatePostInput } from './../dto/post';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { PostService } from './../service/post.service';
import { Post } from './../entities/post';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args({ name: 'images', type: () => [GraphQLUpload], nullable: true })
    images: FileUpload[],
    @Args({ name: 'videos', type: () => [GraphQLUpload], nullable: true })
    videos: FileUpload[],
    @Args({ name: 'input', nullable: true }) input: CreatePostInput,
    @CurrentUser() user,
  ): Promise<Post> {
    return await this.postService.createPost(input, images, videos, user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Post)
  async getPost(@Args({ name: 'postId' }) postId: number): Promise<Post> {
    return await this.postService.getPost(postId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post])
  async getPosts(@Args({ name: 'userId' }) userId: string): Promise<Post[]> {
    return await this.postService.getPosts(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => [Boolean])
  async deletePost(@Args({ name: 'postId' }) postId: number): Promise<Boolean> {
    return await this.postService.deletePost(postId);
  }
}
