import { GetMessagesInput, SendMessageInput } from './../dto/messaging';
import { Message } from './../entities/message';
import { Conversation } from './../entities/conversation';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation) private convoRepo: Repository<Conversation>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
  ) {}

  async sendMessage(
    input: SendMessageInput,
    @CurrentUser() user,
  ): Promise<Conversation> {
    const { otherUserId, message } = input;
    const { userId } = user;
    const conversationId =
      userId < otherUserId
        ? `${userId}_${otherUserId}`
        : `${otherUserId}_${userId}`;
    const conversation = await this.convoRepo.save([
      { conversationId, lastMessage: message, userId, otherUserId },
      {
        conversationId,
        lastMessage: message,
        userId: otherUserId,
        otherUserId: userId,
      },
    ]);
    const messageObj = new Message();
    messageObj['message'] = message;
    messageObj['fromId'] = userId;
    messageObj['conversationId'] = conversationId;
    messageObj['isRead'] = false;
    await this.msgRepo.save(messageObj);
    return conversation[0];
  }

  async getMyConversations(@CurrentUser() user): Promise<Conversation[]> {
    const { userId } = user;
    return await this.convoRepo.find({ where: { userId } });
  }

  async getMessages(
    input: GetMessagesInput,
    @CurrentUser() user,
  ): Promise<Message[]> {
    const { otherUserId } = input;
    const { userId } = user;
    const conversationId =
      userId < otherUserId
        ? `${userId}_${otherUserId}`
        : `${otherUserId}_${userId}`;
    return await this.msgRepo.find({
      where: {
        conversationId,
      },
    });
  }
}
