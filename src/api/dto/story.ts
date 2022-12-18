import { Story } from './../entities/story';
import { User } from './../entities/user';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FriendStoriesOutput {
  @Field(() => User)
  user: User;

  @Field(() => [Story])
  stories: Story[];
}
