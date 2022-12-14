import { ReactionService } from './service/reaction.service';
import { Reaction } from './entities/reaction';
import { TimelineResolver } from './resolver/timeline.resolver';
import { TimelineService } from './service/timeline.service';
import { Timeline } from './entities/timeline';
import { PostService } from './service/post.service';
import { PostResolver } from './resolver/post.resolver';
import { Post } from './entities/post';
import { RelationshipResolver } from './resolver/relationship.resolver';
import { RelationshipService } from './service/relationship.service';
import { Relationship } from './entities/relationship';
import { JourneyResolver } from './resolver/journey.resolver';
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
import { Journey } from './entities/journey';
import { JourneyService } from './service/journey.service';
import { ReactionResolver } from './resolver/reaction.resolver';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Conversation]),
    TypeOrmModule.forFeature([SMSToken]),
    TypeOrmModule.forFeature([Notification]),
    TypeOrmModule.forFeature([Journey]),
    TypeOrmModule.forFeature([Relationship]),
    TypeOrmModule.forFeature([Timeline]),
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Reaction]),
    TypeOrmModule.forFeature([Test]),
  ],
  providers: [
    UserResolver,
    UserService,
    HelperService,
    NotificationService,
    JourneyService,
    MessagingResolver,
    JourneyResolver,
    NotificationResolver,
    ConversationResolver,
    PostResolver,
    PostService,
    TestResolver,
    MessagingService,
    RelationshipService,
    RelationshipResolver,
    TimelineService,
    TimelineResolver,
    ReactionService,
    ReactionResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [RelationshipService, TimelineService],
})
export class ApiModule {}
