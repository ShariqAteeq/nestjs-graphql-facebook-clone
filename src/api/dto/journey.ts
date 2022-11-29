import { JourneyType } from 'src/helpers/constant';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddJourneyInput {
  @Field(() => JourneyType)
  type: JourneyType;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;

  @Field({ nullable: true })
  isPresent: boolean;

  @Field({ nullable: true })
  placeName: string;

  @Field({ nullable: true })
  placeAddress: string;

  @Field({ nullable: true })
  designation: string;
}
