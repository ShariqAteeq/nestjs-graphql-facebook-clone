import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService, private reflector: Reflector) {
    super({ passReqToCallback: true });
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    // const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // console.log('isPublic', isPublic);
    // if (isPublic) {
    //   return ctx.getContext().req;
    // }
    const authHeader = ctx.getContext().req?.headers?.authorization as string;
    if (!authHeader) {
      throw new HttpException('Token not Found', HttpStatus.NOT_FOUND);
    }

    const token = authHeader.split(' ')[1];
    // console.log('token', token);

    const isTokenValid = this.authService.validateToken(token);
    // console.log('isTokenValid', isTokenValid);

    if (isTokenValid === 'TokenExpiredError') {
      throw new HttpException('Token is Expired', HttpStatus.BAD_REQUEST);
    }
    return ctx.getContext().req;
  }
}
