import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmSignUpInput } from 'src/api/dto/user';
import { User } from 'src/api/entities/user';
import { UserStatus } from 'src/helpers/constant';
import { Repository } from 'typeorm';
import {
  AccessTokenOutput,
  LoginInput,
  LoginOutput,
  ResetPasswordInput,
} from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { UserService } from 'src/api/service/user.service';
import { Context } from '@nestjs/graphql';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private userSerice: UserService,
  ) {}

  validateToken(token: string): boolean | string {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      return error.name;
    }
  }

  async validateUser(payload: LoginInput): Promise<User> {
    const { email } = payload;
    const user = await this.userRepo.findOneBy({ email });
    const { password, ...rest } = user;
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    if (!bcrypt.compareSync(payload['password'], user['password'])) {
      throw new HttpException('Incorrect Password!', HttpStatus.BAD_REQUEST);
    }
    return rest;
  }

  async createRefreshToken(userId: string): Promise<string> {
    const refreshToken = randomBytes(64).toString('hex');
    const token = await this.userSerice.storeToken(userId, refreshToken);
    return token.refreshToken;
  }

  getUserFromAccessToken(accessToken: string): AccessTokenOutput {
    const user = this.jwtService.verify(accessToken, {
      ignoreExpiration: true,
    });
    return user;
  }

  async getUserFromContext(@Context() context): Promise<User> {
    const user = this.jwtService.verify(
      context.req.headers.authorization.substring(7),
      {
        ignoreExpiration: true,
      },
    );
    return await this.userSerice.getUser(user['userId']);
  }

  async login(userPayload: User): Promise<LoginOutput> {
    const { email, id: userId } = userPayload;

    return {
      access_token: this.jwtService.sign({
        email,
        userId,
      }),
      refresh_token: await this.createRefreshToken(userId),
    } as LoginOutput;
  }
}
