import { GqlAuthGuard } from './../../auth/auth.guard';
import { SendMessageInput } from './../dto/messaging';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { MessagingService } from '../service/messaging.service';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UseGuards, Inject } from '@nestjs/common';
import { Conversation } from '../entities/conversation';
import { UserService } from '../service/user.service';
import { PubSub } from 'graphql-subscriptions';
import { User } from '../entities/user';
import { SubsciptionEvent } from 'src/helpers/constant';
import { NotificationService } from '../service/notification.service';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSub,
    private msgService: MessagingService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  // ====== Queries =======

  // ======== Get My Conversations =========
  @UseGuards(GqlAuthGuard)
  @Query(() => [Conversation])
  async getMyConversations(@CurrentUser() user): Promise<Conversation[]> {
    return await this.msgService.getMyConversations(user);
  }

  // ====== Mutations =======

  // ======== Send Message =========
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Conversation)
  async sendMessage(
    @Args('input') input: SendMessageInput,
    @CurrentUser() user,
  ): Promise<Conversation> {
    const conversation = await this.msgService.sendMessage(input, user);
    const { conversationId, otherUserId, lastMessage } = conversation;
    await this.notificationService.sendNotifToConvo({
      userId: otherUserId,
      conversationId,
      otherUserId: user['userId'],
      message: lastMessage,
    });
    this.pubSub.publish(SubsciptionEvent.MSG_SENT, {
      onMsgSent: conversation,
    });
    return conversation;
  }

  // ====== Subscription ==========

  @UseGuards(GqlAuthGuard)
  @Subscription(() => Conversation, {
    name: 'onMsgSent',
    filter(payload, variables) {
      console.log('payload', payload);
      console.log('payload', variables);
      return payload['onMsgSent']['otherUserId'] === variables['userId'];
    },
  })
  onMsgSent(@Args('userId') userId: string) {
    return this.pubSub.asyncIterator(SubsciptionEvent.MSG_SENT);
  }

  // ====== Resolvers =======

  @ResolveField()
  async otherUser(@Parent() convo: Conversation): Promise<User> {
    return await this.userService.getUser(convo.otherUserId);
  }
}
