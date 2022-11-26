import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApiModule } from 'src/api/api.module';
import { AuthModule } from 'src/auth/auth.module';
// import { AuthService } from 'src/auth/auth.service';
// import { ConnectionParams } from 'subscriptions-transport-ws';
import { DatabaseOrmModule } from './database.orm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiModule,
    AuthModule,
    DatabaseOrmModule,
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   imports: [AuthModule],
    //   driver: ApolloDriver,
    //   useFactory: async (authService: AuthService) => ({
    //     autoSchemaFile: true,
    //     context: ({ req }) => ({ req }),
    //     subscriptions: {
    //       'graphql-ws': true,
    //       'subscriptions-transport-ws': {
    //         onConnect: async (connectionParams: ConnectionParams) => {
    //           console.log(
    //             'connectionParams',
    //             connectionParams['authorization'],
    //           );
    //           const authHeader = connectionParams['authorization'];
    //           const token = authHeader.split(' ')[1];
    //           const isTokenValid = authService.validateToken(token);
    //           console.log('isTokenValid', isTokenValid);
    //           if (isTokenValid === 'TokenExpiredError') {
    //             throw new HttpException(
    //               'Token is Expired',
    //               HttpStatus.BAD_REQUEST,
    //             );
    //           }
    //           const user = authService.getUserFromAccessToken(token);
    //           console.log('user', user);
    //           return {
    //             currentUser: user,
    //           };
    //         },
    //       },
    //     },
    //   }),
    //   inject: [AuthService],
    // }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': {
          onConnect: async (connectionParams) => {
            console.log('connectionParams', connectionParams['authorization']);
            return {
              req: {
                headers: { ...connectionParams },
              },
            };
          },
        },
      },
      // context: ({ req }) => ({ req }),
    }),
  ],
  exports: [],
  providers: [],
})
export class BootstrapModule {}
