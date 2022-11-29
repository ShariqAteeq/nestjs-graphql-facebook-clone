import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from 'src/helpers/constant';

@InputType()
export class UserSignUpInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field(() => UserRole)
  role: UserRole;
}

@InputType()
export class ConfirmSignUpInput {
  @Field()
  code: string;
  @Field()
  email: string;
}
