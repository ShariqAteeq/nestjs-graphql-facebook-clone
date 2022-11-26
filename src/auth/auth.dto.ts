import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/helpers/constant';

@ObjectType()
export class LoginOutput {
  @Field({ nullable: false })
  access_token: string;

  @Field({ nullable: false })
  refresh_token: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AccessTokenOutput {
  @Field()
  userId: number;

  @Field()
  email: string;

  @Field(() => [Role])
  role: Role[];
}

@InputType()
export class ResetPasswordInput {
  @Field()
  email: string;

  @Field()
  newPassword: string;

  @Field()
  confirmPassword: string;
}
