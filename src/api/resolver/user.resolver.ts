import { GqlAuthGuard } from 'src/auth/auth.guard';
import { Relationship } from './../entities/relationship';
import { ProfileImageType, RespondAction } from './../../helpers/constant';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Journey } from '../entities/journey';
import { User } from '../entities/user';
import { JourneyService } from '../service/journey.service';
import { UserService } from '../service/user.service';
import { CurrentUser } from 'src/decorators/user.decorator';
import { HelperService } from '../service/helper.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private journeyService: JourneyService,
    private helperService: HelperService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Relationship)
    private relationshipRepo: Repository<Relationship>,
  ) {}

  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<User> {
    return await this.userService.getUser(id);
  }

  @ResolveField()
  async journey(@Parent() user: User): Promise<Journey[]> {
    return await this.journeyService.getUserJourney(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField()
  async friendStatus(
    @Parent() otherUser: User,
    @CurrentUser() user,
  ): Promise<Relationship> {
    const friend = await this.relationshipRepo.findOne({
      where: { userId: user?.userId, otherUserId: otherUser.id },
    });
    if (!friend) {
      const otherUserView = await this.relationshipRepo.findOne({
        where: { userId: otherUser.id, otherUserId: user?.userId },
      });
      return otherUserView;
    } else {
      return friend;
    }
  }

  @Mutation(() => Boolean)
  async uploadProfilePhoto(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
    @Args('imageType') imageType: ProfileImageType,
    @Args('userId') userId: string,
    @CurrentUser() user,
  ): Promise<boolean> {
    // const { userId } = user;
    if (imageType === ProfileImageType.PROFILE) {
      const image = (await this.helperService.uploadFile(
        file,
        '/user/profile',
        userId,
      )) as string;
      await this.userRepo.save([{ id: userId, profileImg: image }]);
    } else {
      const image = (await this.helperService.uploadFile(
        file,
        '/user/cover',
        userId,
      )) as string;
      await this.userRepo.save([{ id: userId, profileImg: image }]);
    }
    return true;
  }
}
