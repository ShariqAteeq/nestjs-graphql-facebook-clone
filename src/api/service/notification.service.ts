import { NotificationData } from './../dto/notification';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType, SubsciptionEvent } from 'src/helpers/constant';
import { Repository } from 'typeorm';
import { NotifyConvo, SConvo } from '../dto/notification';
import { Notification } from '../entities/notification';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/decorators/user.decorator';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async sendNotifToConvo(payload: NotifyConvo): Promise<SConvo> {
    const { userId, message, conversationId, otherUserId } = payload;
    const notifyObj = await this.notifRepo.create({
      userId,
      message,
      otherUserId,
      conversationId,
      read: false,
      __typename: 'SConvo',
      type: NotificationType.SCONVO,
    });
    const res = await this.notifRepo.save(notifyObj);
    this.pubSub.publish(SubsciptionEvent.CONVO, { onNotified: res });
    return res;
  }

  async listNotifications(@CurrentUser() user) {
    const { userId } = user;
    return await this.notifRepo.find({ where: { userId } });
  }

  async readAllNotificaions(@CurrentUser() user) {
    const { userId } = user;
    return true;
  }
}
