import { Story } from './../api/entities/story';
import { StoryService } from './../api/service/story.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Story) private storyRepo: Repository<Story>) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteStoriesAfter5Mint() {
    console.log('=== cron job running for deleting stories ===');

    const stories = await this.storyRepo.find();
    if (!stories) return;
    const promiseArr = [];
    const now = moment(new Date());
    for (const s of stories) {
      const duration = moment.duration(now.diff(s.logCreatedAt));
      const minDiff = duration.asMinutes();
      console.log('== story minDiff == ', minDiff);
      console.log('== story id == ', s.id);
      if (minDiff > 2) {
        promiseArr.push(s.id);
      }
    }
    await this.storyRepo.delete({ id: In(promiseArr) });
    return;
  }
}
