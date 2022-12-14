import { User } from './user';
import { Post } from './post';
import { ReactionType } from './../../helpers/constant';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity('Reaction')
export class Reaction {
  @PrimaryColumn()
  @Field()
  userId: string;

  @PrimaryColumn()
  @Field()
  postId: number;

  @Field(() => User, { nullable: true })
  user: User;

  @Column()
  @Field(() => ReactionType)
  reaction: ReactionType;

  @ManyToOne(() => Post, (post) => post.reactions, { nullable: true })
  @Field(() => Post, { nullable: true })
  post: Post;

  @Column()
  @Field({ nullable: true })
  timestamp: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  logCreatedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  logUpdatedAt: Date;
}
