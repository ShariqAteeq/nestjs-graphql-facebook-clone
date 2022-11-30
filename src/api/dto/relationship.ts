import { RelationshipType, RespondAction } from './../../helpers/constant';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ManageFriendRequestInput {
  @Field()
  otherUserId: string;

  @Field(() => RelationshipType)
  relationshipType: RelationshipType;

  @Field(() => RespondAction)
  respondAction: RespondAction;
}

@InputType()
export class GetUserFriendsInput {
  @Field(() => RelationshipType)
  relationshipType: RelationshipType;

  @Field(() => RespondAction)
  status: RespondAction;
}
