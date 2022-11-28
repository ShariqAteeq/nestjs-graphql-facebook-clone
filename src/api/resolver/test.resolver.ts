import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream } from 'fs';
import { Repository } from 'typeorm';
import { Test } from '../entities/test';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { ulid } from 'ulid';
// @ts-ignore
// import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
// @ts-ignore
// import FileUpload from 'graphql-upload/Upload';
// const GraphQLUpload = require('graphql-upload/GraphQLUpload.mjs');

@Resolver(() => Test)
export class TestResolver {
  constructor(@InjectRepository(Test) private testRepo: Repository<Test>) {}

  @Query(() => [Test])
  async listTestData() {
    return await this.testRepo.find();
  }

  @Mutation(() => Test)
  async addTestData(@Args('name') name: string) {
    const res = await this.testRepo.create({ name });
    return await this.testRepo.save(res);
  }

  @ResolveField()
  async typeDetail(@Parent() test: Test) {
    const msg = {
      __typename: 'Message',
      message: 'Hi from Message resrolvers ',
    };
    const convo = {
      __typename: 'Conversation',
      lastMessage: 'HI from Convo resrolver',
    };
    return [msg, convo];
  }

  @Mutation(() => Boolean)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ): Promise<boolean> {
    const fname = `${ulid()}_${filename}`;
    console.log('fname', fname);
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`./assets/${fname}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );
  }
}
