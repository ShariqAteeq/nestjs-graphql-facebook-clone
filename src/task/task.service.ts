import { UserService } from 'src/api/service/user.service';
import { PostService } from './../api/service/post.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    private postService: PostService,
    private UserService: UserService,
  ) {}

  //   @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const post = await this.postService.getPost(21);
    console.log('post in task service', post);
  }
}
