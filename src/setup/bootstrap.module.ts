import { TaskModule } from './../task/task.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from 'src/api/api.module';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseOrmModule } from './database.orm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TaskModule,
    ApiModule,
    AuthModule,
    DatabaseOrmModule,
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      fieldResolverEnhancers: ['guards'],
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
    }),
  ],
  exports: [],
  providers: [],
})
export class BootstrapModule {}
