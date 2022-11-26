import { TestUnion } from './../dto/test';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('Test')
export class Test {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Field(() => [TestUnion], { nullable: true }) // For Returning Array of multiple entities
  // @Field(() =>TestUnion, { nullable: true }) // For Returnning single object of multiple entities
  typeDetail: typeof TestUnion;
}
