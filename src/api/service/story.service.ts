import { Relationship } from './../entities/relationship';
import { RelationshipService } from './relationship.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './../entities/story';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UserService } from './user.service';
import { RelationshipType, RespondAction } from 'src/helpers/constant';

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
    // const friends = await this.relService.getUserFriends({
    //   relationshipType: RelationshipType.FRIENDS,
    //   status: RespondAction.ACCEPTED,
    //   userId: user?.userId,
    // });
    // const myFirends = await this.relationshipRepo
    //   .createQueryBuilder('relationship')
    //   .leftJoinAndSelect('relationship.otherUser', 'otherUser')
    //   .where('relationship.otherUserId = :userId');
    //    const result = friends.map(async x => {
    //     const stories = await this.storyRepo.find({ where: { creator_id: x.otherUserId } });
    //     return {
    //         user: x?.otherUser
    //     }
    //    })
    //     console.log('friends', friends);
  }

  async deleteStory(id: number): Promise<Boolean> {
    await this.storyRepo.delete(id);
    return true;
  }
}
