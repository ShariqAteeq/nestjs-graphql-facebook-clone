import { Relationship } from './../entities/relationship';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './../entities/story';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Repository, In } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UserService } from './user.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story) private storyRepo: Repository<Story>,
    @InjectRepository(Relationship)
    private relationshipRepo: Repository<Relationship>,
    private userService: UserService,
  ) {}

  async addStory(
    text: string,
    bgColor: string,
    @CurrentUser() user,
  ): Promise<Story> {
    const story = new Story();

    const userDetail = await this.userService.getUser(user?.userId);

    story['text'] = text;
    story['bgColor'] = bgColor;
    story['creator'] = userDetail;
    story['creator_id'] = user?.userId;
    return await this.storyRepo.save(story);
  }

  async getFriendStories(@CurrentUser() user) {
    const myFirends = await this.relationshipRepo
      .createQueryBuilder('relationship')
      .leftJoinAndSelect('relationship.otherUser', 'user')
      .where('relationship.userId = :userId', { userId: user?.userId })
      .getMany();

    console.log('myFirends', myFirends);

    const storiesOfAllMyFreinds = await this.storyRepo.find({
      where: {
        creator_id: In([...myFirends.map((x) => x.otherUserId), user?.userId]),
      },
    });

    console.log('storiesOfAllMyFreinds', storiesOfAllMyFreinds);

    const result = myFirends.map((x) => {
      const userStories = storiesOfAllMyFreinds.filter(
        (y) => y.creator_id === x.otherUserId,
      );
      return {
        user: x?.otherUser,
        stories: userStories,
      };
    });

    // Adding my stories
    const myStories = storiesOfAllMyFreinds.filter(
      (y) => y.creator_id === user?.userId,
    );
    result.push({
      user: await this.userService.getUser(user?.userId),
      stories: myStories,
    });

    console.log('Res', result);
    return result;
  }

  async deleteStory(id: number): Promise<Boolean> {
    await this.storyRepo.delete(id);
    return true;
  }
}
