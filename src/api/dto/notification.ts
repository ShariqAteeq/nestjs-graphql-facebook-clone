import { NotificationType } from './../../helpers/constant';
import {
  createUnionType,
  Field,
  ID,
  InterfaceType,
  ObjectType,
} from '@nestjs/graphql';
import { User } from '../entities/user';

@InterfaceType()
export abstract class INotification {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  read: Boolean;

  @Field()
  createdAt: Date;
}

// Conversation Notification
@ObjectType({
  implements: () => [INotification],
})
export class SConvo implements INotification {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  read: Boolean;

  @Field({ nullable: true })
  message: string;

  @Field(() => User, { nullable: true })
  otherUser?: User;

  @Field({ nullable: true })
  otherUserId: string;

  @Field({ nullable: true })
  conversationId: string;

  @Field()
  createdAt: Date;
}

export const NotificationData = createUnionType({
  name: 'NotificationData',
  types: () => [SConvo] as const,
});

export class NotifyConvo {
  userId: string;
  conversationId: string;
  otherUserId: string;
  message: string;
}
