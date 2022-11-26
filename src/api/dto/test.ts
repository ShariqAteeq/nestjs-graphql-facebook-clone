import { Message } from './../entities/message';
import { Conversation } from './../entities/conversation';
import { createUnionType } from '@nestjs/graphql';

export const TestUnion = createUnionType({
  name: 'TestUnion',
  types: () => [Conversation, Message] as const,
});
