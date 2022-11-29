import { Field, ObjectType } from '@nestjs/graphql';
import { JourneyType } from 'src/helpers/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('Journey')
export class Journey {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column()
  @Field()
  userId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  placeName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  isPresnt: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  placeAddress: string;

  @Column()
  @Field(() => JourneyType)
  type: JourneyType;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  startDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  endDate: Date;
}
