import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './schemas/ratings.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingModule { }
