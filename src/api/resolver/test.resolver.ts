import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from '../entities/test';

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
      message: 'Hi from Message resrolver',
    };
    const convo = {
      __typename: 'Conversation',
      lastMessage: 'HI from Convo resrolver',
    };
    return [msg, convo];
  }
}
