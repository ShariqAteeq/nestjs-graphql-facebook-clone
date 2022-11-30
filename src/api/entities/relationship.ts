import { RespondAction, RelationshipType } from './../../helpers/constant';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { User } from './user';

@ObjectType()
@Entity('Relationship')
export class Relationship {
  @PrimaryColumn()
  @Field()
  userId: string;

  @PrimaryColumn()
  @Field()
  otherUserId: string;

  @Field(() => User, { nullable: true })
  otherUser: User;

  @Column()
  @Field(() => RespondAction, { nullable: true })
  status: RespondAction;

  @Column()
  @Field(() => RelationshipType, { nullable: true })
  relationshipType: RelationshipType;

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
