import { SMSToken } from 'src/api/entities/token';
import { User } from 'src/api/entities/user';
import { Timeline } from './../api/entities/timeline';
import { TimelineService } from './../api/service/timeline.service';
import { Relationship } from './../api/entities/relationship';
import { HelperService } from 'src/api/service/helper.service';
import { UserService } from 'src/api/service/user.service';
import { TasksService } from 'src/task/task.service';
import { PostService } from './../api/service/post.service';
import { Post } from './../api/entities/post';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relationship]),
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Timeline]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([SMSToken]),
  ],
  providers: [
    TasksService,
    PostService,
    TimelineService,
    UserService,
    HelperService,
  ],
})
export class TaskModule {}
