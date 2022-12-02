import { RespondAction } from './../../helpers/constant';
import {
  GetUserFriendsInput,
  ManageFriendRequestInput,
} from './../dto/relationship';
import { Relationship } from './../entities/relationship';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(Relationship) private relRepo: Repository<Relationship>,
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
      await this.relRepo.delete({ userId: otherUserId, otherUserId: userId });
    }
    return true;
  }

  async getUserFriends(
    input: GetUserFriendsInput,
    @CurrentUser() user,
  ): Promise<Relationship[]> {
    const { status, relationshipType } = input;
    const { userId } = user;
    const relation = await this.relRepo.find({
      where: { userId, relationshipType, status },
    });
    return relation;
  }
}
