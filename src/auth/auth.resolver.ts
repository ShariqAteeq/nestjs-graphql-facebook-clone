import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSignUpInput } from 'src/api/dto/user';
import { User } from 'src/api/entities/user';
import { UserService } from 'src/api/service/user.service';
import { LoginInput, LoginOutput } from './auth.dto';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Mutation(() => User)
  async signup(
    @Args('input')
    input: UserSignUpInput,
  ): Promise<User> {
    return await this.userService.create(input);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') input: LoginInput): Promise<LoginOutput> {
    console.log('LoginInput', input);
    const user = await this.authService.validateUser(input);
    return await this.authService.login(user);
  }
}
