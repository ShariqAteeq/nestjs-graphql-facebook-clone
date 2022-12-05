import { Post } from './post';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { User } from './user';

@ObjectType()
@Entity('Timeline')
export class Timeline {
  @PrimaryColumn()
  @Field({ nullable: true })
  userId: string;

  @PrimaryColumn()
  @Field({ nullable: true })
  postId: number;

  @Field(() => Post, { nullable: true })
  post: Post;

  @Field(() => User, { nullable: true })
  user: User;

  @Column({ nullable: true })
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
