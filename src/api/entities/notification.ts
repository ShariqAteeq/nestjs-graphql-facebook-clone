import { NotificationType } from './../../helpers/constant';
import { INotification } from '../dto/notification';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
@Entity('Notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field(() => ID)
  userId: string;

  @Column()
  type: NotificationType;

  @Column()
  @Field()
  read: Boolean;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  fromUserId: string;

  @Column({ nullable: true })
  otherUserId: string;

  @Column({ nullable: true })
  conversationId: string;

  @Column({ nullable: true })
  __typename: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

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
