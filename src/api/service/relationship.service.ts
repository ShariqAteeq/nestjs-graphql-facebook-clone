import { Post } from './../entities/post';
import { TimelineService } from './timeline.service';
import { PostService } from './post.service';
import { RelationshipType, RespondAction } from './../../helpers/constant';
import {
  GetUserFriendsInput,
  ManageFriendRequestInput,
} from './../dto/relationship';
import { Relationship } from './../entities/relationship';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(Relationship) private relRepo: Repository<Relationship>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    private timelineService: TimelineService,
  ) {}

  async manageFriends(
    input: ManageFriendRequestInput,
    @CurrentUser() user,
  ): Promise<Relationship> {
    const { otherUserId, respondAction, relationshipType } = input;
    const { userId } = user;
    const existReq = await this.relRepo.findOne({
      where: { userId, otherUserId, relationshipType },
    });

    const otherUserReq = await this.relRepo.findOne({
      where: { userId: otherUserId, otherUserId: userId, relationshipType },
    });

    // ===== Checking if i have done same action ===== \\
    if (existReq?.['status'] === respondAction) {
      throw new HttpException(
        'You have already done this action',
        HttpStatus.BAD_REQUEST,
      );
    }

    // ===== Checking if otherUser already sent request ===== \\
    if (
      otherUserReq?.['status'] === RespondAction.PENDING &&
      respondAction === otherUserReq?.['status']
    ) {
      throw new HttpException(
        'You already got this request',
        HttpStatus.BAD_REQUEST,
      );
    }

    // ===== Checking i cannot accept my own request ===== \\
    if (respondAction === RespondAction.ACCEPTED) {
      if (existReq?.['status'] === RespondAction.PENDING) {
        throw new HttpException(
          'You can not accept your own request',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // ===== Checking i cannot make direclty someone as my friend ===== \\
    if (respondAction === RespondAction.ACCEPTED) {
      if (!otherUserReq) {
        throw new HttpException(
          'You can not  make directly someone as your friend',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const relationArr = [
      { userId, otherUserId, relationshipType, status: respondAction },
    ];

    //  // ===== adding myself as otheruser freind ===== \\
    if (respondAction === RespondAction.ACCEPTED) {
      const getMyAndOtherUserPosts = await this.postRepo.find({
        where: { creatorId: In([userId, otherUserId]) },
      });

      // Creating Timeline Record
      const timelineArr = [];
      for (const x of getMyAndOtherUserPosts) {
        if (x.creatorId === userId) {
          timelineArr.push({
            userId: otherUserId,
            postId: +x.id,
            timestamp: x.logCreatedAt,
          });
        } else {
          timelineArr.push({
            userId,
            postId: +x.id,
            timestamp: x.logCreatedAt,
          });
        }
        timelineArr.push({
          userId: x.creatorId,
          postId: +x.id,
          timestamp: x.logCreatedAt,
        });
      }
      await this.timelineService.addPostsInTimeline(timelineArr);

      relationArr.push({
        userId: otherUserId,
        otherUserId: userId,
        relationshipType,
        status: respondAction,
      });
    }
    const relation = await this.relRepo.save(relationArr);
    return relation[0];
  }

  async deleteFriendRequest(
    otherUserId: string,
    @CurrentUser() user,
  ): Promise<Boolean> {
    const { userId } = user;
    const existReq = await this.relRepo.findOne({
      where: { userId, otherUserId },
    });
    if (!existReq) {
      throw new HttpException('Request not found!', HttpStatus.NOT_FOUND);
    }
    await this.relRepo.delete({ userId, otherUserId });
    if (existReq.status === RespondAction.ACCEPTED) {
      // get friend's post
      const getMyAndOtherUserPosts = await this.postRepo.find({
        where: { creatorId: In([userId, otherUserId]) },
      });

      const myPosts = getMyAndOtherUserPosts?.filter(
        (x) => x.creatorId === userId,
      );
      const otherUserPosts = getMyAndOtherUserPosts?.filter(
        (x) => x.creatorId === otherUserId,
      );

      // deleting other user posts from my timeline
      await this.timelineService.deletePostsFromTimeline({
        userId,
        postId: In(otherUserPosts?.map((x) => x.id)),
      });
      // deleting my posts from other user timeline
      await this.timelineService.deletePostsFromTimeline({
        userId: otherUserId,
        postId: In(myPosts?.map((x) => x.id)),
      });

      await this.relRepo.delete({ userId: otherUserId, otherUserId: userId });
    }
    return true;
  }

  async getUserFriends(
    input: GetUserFriendsInput,
    // @CurrentUser() user,
  ): Promise<Relationship[]> {
    const { status, relationshipType, userId } = input;

    // const { userId } = user;

    const myFirends = await this.relRepo
      .createQueryBuilder('relationship')
      .leftJoinAndSelect('relationship.otherUser', 'user')
      .where('relationship.userId = :userId', { userId: userId })
      .getMany();

    console.log('myFirends', myFirends);

    const condition = { relationshipType, status };
    if (status === RespondAction.PENDING) condition['otherUserId'] = userId;
    if (status === RespondAction.ACCEPTED) condition['userId'] = userId;

    const relation = await this.relRepo.find({
      where: condition,
    });
    return relation;
  }

  async getSuggestedFriends(@CurrentUser() user): Promise<Relationship[]> {
    const myFriendsIds = await this.relRepo
      .find({
        where: {
          userId: user?.userId,
          relationshipType: RelationshipType.FRIENDS,
          status: RespondAction.ACCEPTED,
        },
      })
      .then((x) => x.map((y) => y.otherUserId));
    const freindsOfFriends = await this.relRepo
      .createQueryBuilder('relationship')
      .where('relationship.userId IN (:...ids)', { ids: myFriendsIds })
      .andWhere('relationship.otherUserId != :otherUserId ', {
        otherUserId: user?.userId,
      })
      .andWhere('relationship.otherUserId NOT IN (:...friendsids) ', {
        friendsids: myFriendsIds,
      })
      .andWhere('relationship.relationshipType = :relType', {
        relType: RelationshipType.FRIENDS,
      })
      .andWhere('relationship.status = :status', {
        status: RespondAction.ACCEPTED,
      })
      .distinctOn(['relationship.otherUserId'])
      .getMany();
    console.log('myFreinds', myFriendsIds);
    console.log('freindsOfFriends', freindsOfFriends);
    return freindsOfFriends;
  }

  async getMutualFriends(
    otherUserId: string,
    @CurrentUser() user,
  ): Promise<Relationship[]> {
    console.log('userId', user?.userId);
    console.log('otherUserId', otherUserId);

    if (user?.userId === otherUserId) return [];

    const mutalFriends = await this.relRepo
      .createQueryBuilder('relationship')
      .where('relationship.userId = :userId', { userId: otherUserId })
      .andWhere('relationship.otherUserId != :otherUserId ', {
        otherUserId: user?.userId,
      })
      .andWhere('relationship.relationshipType = :relType', {
        relType: RelationshipType.FRIENDS,
      })
      .andWhere('relationship.status = :status', {
        status: RespondAction.ACCEPTED,
      })
      .getMany();
    // console.log('freindsOfFriends', mutalFriends);
    return mutalFriends;
  }
}
