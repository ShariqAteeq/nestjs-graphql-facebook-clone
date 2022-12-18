import { Relationship } from './relationship';
import { Reaction } from './reaction';
import { User } from './user';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column()
  @Field()
  creatorId: string;

  @ManyToOne(() => User, (u) => u.id)
  @JoinColumn({ name: 'creator_id' })
  @Field(() => User, { nullable: true })
  creator: User;

  @OneToMany(() => Reaction, (re) => re.post, { nullable: true })
  @Field(() => [Reaction], { nullable: true })
  reactions: Reaction[];

  @Column('simple-array', { nullable: true })
  @Field(() => [String], { nullable: true })
  images: string[];

  @Column('simple-array', { nullable: true })
  @Field(() => [String], { nullable: true })
  videos: string[];

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  @Field()
  createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  logCreatedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  logUpdatedAt: Date;
}
