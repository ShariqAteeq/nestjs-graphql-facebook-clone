import { Field, HideField, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @HideField()
  password?: string;

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

// export enum UserRole {
//   ADMIN = "admin",
//   EDITOR = "editor",
//   GHOST = "ghost",
// }

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number

//   @Column({
//       type: "enum",
//       enum: UserRole,
//       default: UserRole.GHOST,
//   })
//   role: UserRole
// }
