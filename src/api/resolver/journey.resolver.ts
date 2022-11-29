import { GqlAuthGuard } from './../../auth/auth.guard';
import { Journey } from './../entities/journey';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JourneyService } from '../service/journey.service';
import { AddJourneyInput } from '../dto/journey';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Journey)
export class JourneyResolver {
  constructor(private journeyService: JourneyService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Journey)
  async addJourney(
    @Args('input') input: AddJourneyInput,
    @CurrentUser() user,
  ): Promise<Journey> {
    return await this.journeyService.addJourney(input, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteJourney(@Args('id') id: number): Promise<Boolean> {
    return await this.journeyService.deleteJourney(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Journey])
  async getUserJourney(@Args('userId') userId: string): Promise<Journey[]> {
    return await this.journeyService.getUserJourney(userId);
  }
}
