import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';
import { Repository } from 'typeorm';
import { AddJourneyInput } from '../dto/journey';
import { Journey } from '../entities/journey';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(Journey) private journeyRepo: Repository<Journey>,
  ) {}

  async addJourney(
    input: AddJourneyInput,
    @CurrentUser() user,
  ): Promise<Journey> {
    const journey = new Journey();
    const {
      type,
      startDate,
      endDate,
      placeAddress,
      placeName,
      designation,
      isPresent,
    } = input;
    const { userId } = user;
    journey['userId'] = userId;
    journey['type'] = type;
    journey['startDate'] = startDate;
    journey['endDate'] = endDate;
    journey['placeAddress'] = placeAddress;
    journey['placeName'] = placeName;
    journey['designation'] = designation;
    journey['isPresent'] = isPresent;
    await this.journeyRepo.save(journey);
    return journey;
  }

  async deleteJourney(id: number): Promise<Boolean> {
    await this.journeyRepo.delete(id);
    return true;
  }

  async getUserJourney(userId: string): Promise<Journey[]> {
    return await this.journeyRepo.find({ where: { userId } });
  }
}
