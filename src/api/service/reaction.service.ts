import { ReactionType } from './../../helpers/constant';
import { Post } from './../entities/post';
import { Reaction } from './../entities/reaction';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction) private reactRepo: Repository<Reaction>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  async like(
    postId: number,
    react: ReactionType,
    @CurrentUser() user,
  ): Promise<Reaction> {
    const reaction = new Reaction();

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    reaction['postId'] = postId;
    reaction['userId'] = user?.userId;
    reaction['timestamp'] = new Date();
    reaction['reaction'] = react;
    reaction['post'] = post;
    return await this.reactRepo.save(reaction);
  }

  async unlike(postId: number, @CurrentUser() user): Promise<Boolean> {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    await this.reactRepo.delete({ postId, userId: user?.userId });
    return true;
  }
}
