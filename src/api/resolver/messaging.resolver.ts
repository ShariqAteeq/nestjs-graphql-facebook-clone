import { Message } from './../entities/message';
import { GqlAuthGuard } from './../../auth/auth.guard';
import { GetMessagesInput } from './../dto/messaging';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MessagingService } from '../service/messaging.service';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from '../entities/test';
import { Repository } from 'typeorm';
import { UserService } from '../service/user.service';

@Resolver(() => Message)
export class MessagingResolver {
  constructor(
    private msgService: MessagingService,
    private userService: UserService,
    @InjectRepository(Test) private testRepo: Repository<Test>,
  ) {}

  // ====== Queries =======

  // ======== Get Messages =========
  @UseGuards(GqlAuthGuard)
  @Query(() => [Message])
  async getMessages(
    @Args('input') input: GetMessagesInput,
    @CurrentUser() user,
  ): Promise<Message[]> {
    return await this.msgService.getMessages(input, user);
  }

  // ====== Resolvers =======

  @ResolveField()
  // async fromMessage(@Parent() message: Message ): Promise<User> {
  async from(@Parent() message: Message) {
    return await this.userService.getUser(message.fromId);
  }
}
