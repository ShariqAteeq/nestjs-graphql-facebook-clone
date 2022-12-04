import { FileUpload } from 'graphql-upload';
import { UserService } from './user.service';
import { CreatePostInput } from './../dto/post';
import { Post } from './../entities/post';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    private userService: UserService,
  ) {}

  async createPost(
    input: CreatePostInput,
    images: FileUpload[],
    videos: FileUpload[],
    @CurrentUser() user,
  ) {
    const { userId } = user;
    const { description } = input;
    const creator = await this.userService.getUser(userId);
    const post = new Post();
    post['description'] = description;
    post['creatorId'] = userId;
    post['creator'] = creator;
    post['createdAt'] = new Date();
  }
}
