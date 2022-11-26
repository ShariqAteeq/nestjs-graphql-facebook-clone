import { NotificationService } from './../service/notification.service';
import { NotificationData } from './../dto/notification';
import { Args, Resolver, Subscription, Query, Mutation } from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { SubsciptionEvent } from 'src/helpers/constant';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/decorators/user.decorator';

@Resolver(() => NotificationData)
export class NotificationResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSub,
    private notifService: NotificationService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Subscription(() => NotificationData, {
    name: 'onNotified',
    filter(payload, variables) {
      console.log('payload', payload);
      console.log('payload', variables);
      return payload['onNotified']['userId'] === variables['userId'];
    },
  })
  onNotified(@Args('userId') userId: string) {
    return this.pubSub.asyncIterator(SubsciptionEvent.CONVO);
  }

  // ======== Get My Conversations =========
  @UseGuards(GqlAuthGuard)
  @Query(() => [NotificationData])
  async listNotifications(
    @CurrentUser() user,
  ): Promise<typeof NotificationData[]> {
    return await this.notifService.listNotifications(user);
  }

  // ======== Get My Conversations =========
  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async readAllNotificaions(@CurrentUser() user): Promise<Boolean> {
    return await this.notifService.readAllNotificaions(user);
  }
}
