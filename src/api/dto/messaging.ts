import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field()
  otherUserId: string;

  @Field()
  message: string;
}
@InputType()
export class GetMessagesInput {
  @Field()
  otherUserId: string;
}
