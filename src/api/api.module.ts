import { MessagingService } from './service/messaging.service';
import { MessagingResolver } from './resolver/messaging.resolver';
import { Conversation } from './entities/conversation';
import { Message } from './entities/message';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SMSToken } from './entities/token';
import { User } from './entities/user';
import { UserResolver } from './resolver/user.resolver';
import { HelperService } from './service/helper.service';
import { UserService } from './service/user.service';
import { Test } from './entities/test';
import { ConversationResolver } from './resolver/conversation.resolver';
import { PubSub } from 'graphql-subscriptions';
import { TestResolver } from './resolver/test.resolver';
import { NotificationResolver } from './resolver/notification.resolver';
import { Notification } from './entities/notification';
import { NotificationService } from './service/notification.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Conversation]),
    TypeOrmModule.forFeature([SMSToken]),
    TypeOrmModule.forFeature([Notification]),
    TypeOrmModule.forFeature([Test]),
  ],
  providers: [
    UserResolver,
    UserService,
    HelperService,
    NotificationService,
    MessagingResolver,
    NotificationResolver,
    ConversationResolver,
    TestResolver,
    MessagingService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [],
})
export class ApiModule {}
