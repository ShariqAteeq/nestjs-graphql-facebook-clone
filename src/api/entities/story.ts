import { User } from 'src/api/entities/user';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('Story')
export class Story {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field({ nullable: true })
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  text: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bgColor: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  creator_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @Field(() => User, { nullable: true })
  creator: User;

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
