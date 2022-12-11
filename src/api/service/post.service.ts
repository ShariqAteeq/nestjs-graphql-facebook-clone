import { TimelineService } from './timeline.service';
import { RelationshipService } from './relationship.service';
import { HelperService } from 'src/api/service/helper.service';
import { FileUpload } from 'graphql-upload';
import { UserService } from './user.service';
import { CreatePostInput } from './../dto/post';
import { Post } from './../entities/post';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';
import { RelationshipType, RespondAction } from 'src/helpers/constant';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    private relService: RelationshipService,
    private timelineService: TimelineService,
    private userService: UserService,
    private helperService: HelperService,
  ) {}

  async createPost(
    input: CreatePostInput,
    images: FileUpload[],
    videos: FileUpload[],
    @CurrentUser() user,
  ): Promise<Post> {
    const { userId } = user;
    // const userId = '47641ac0-3e03-4007-ad4e-ccb2e6e1c3a7';
    const creator = await this.userService.getUser(userId);
    const post = new Post();
    post['description'] = input?.description;
    post['creatorId'] = userId;
    post['creator'] = creator;
    post['createdAt'] = new Date();

    if (images?.length) {
      const promiseArr = [];
      for (const [index, i] of images.entries()) {
        promiseArr.push(this.helperService.uploadFile(i, `${index}`, '/post'));
      }
      const resp = await Promise.all(promiseArr);
      post['images'] = resp;
    }

    if (videos?.length) {
      const promiseArr = [];
      for (const [index, i] of videos.entries()) {
        promiseArr.push(this.helperService.uploadFile(i, `${index}`, '/post'));
      }
      const resp = await Promise.all(promiseArr);
      post['videos'] = resp;
    }

    const res = await this.postRepo.save(post);

    // saving timeline record

    const timelineArr = [
      { userId, postId: +res.id, timestamp: res.logCreatedAt },
    ];
    // const myFirends = await this.relService.getUserFriends({
    //   userId,
    //   relationshipType: RelationshipType.FRIENDS,
    //   status: RespondAction.ACCEPTED,
    // });

    // for (const x of myFirends) {
    //   timelineArr.push({
    //     userId: x.otherUserId,
    //     postId: +res.id,
    //     timestamp: res.logCreatedAt,
    //   });
    // }
    await this.timelineService.addPostsInTimeline(timelineArr);
    return res;
  }

  async getPosts(userId: string): Promise<Post[]> {
    return await this.postRepo.find({
      where: { creatorId: userId },
      relations: ['creator'],
    });
  }

  async getAllPosts(condition: any): Promise<Post[]> {
    return await this.postRepo.find({
      where: { creatorId: In(condition?.userIds) },
    });
  }

  async getPost(postId: number): Promise<Post> {
    return await this.postRepo.findOne({
      where: { id: postId },
      relations: ['creator'],
    });
  }

  async deletePost(postId: number): Promise<Boolean> {
    await this.postRepo.delete({ id: postId });
    return true;
  }
}
