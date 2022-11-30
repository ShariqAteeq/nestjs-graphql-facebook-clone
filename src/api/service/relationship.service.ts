import {
  GetUserFriendsInput,
  ManageFriendRequestInput,
} from './../dto/relationship';
import { Relationship } from './../entities/relationship';
import { Injectable } from '@nestjs/common';
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
    const relation = await this.relRepo.save([
      { userId, otherUserId, relationshipType, status: respondAction },
    ]);
    return relation[0];
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
