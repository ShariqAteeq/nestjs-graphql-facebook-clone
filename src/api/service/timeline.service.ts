import { Timeline } from './../entities/timeline';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(Timeline) private timelineRepo: Repository<Timeline>,
  ) {}

  async getMyTimeline(@CurrentUser() user): Promise<Timeline[]> {
    return await this.timelineRepo.find({ where: { userId: user?.userId } });
  }

  async addPostsInTimeline(payload: any): Promise<Timeline> {
    return await this.timelineRepo.save(payload);
  }

  async deletePostsFromTimeline(payload: any): Promise<Boolean> {
    console.log('payload', payload);
    const res = await this.timelineRepo.delete(payload);
    console.log('Res', res);
    return true;
  }
}
