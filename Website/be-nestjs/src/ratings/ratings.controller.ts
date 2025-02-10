import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage } from 'src/decorator/response.decorator';
import { User } from 'src/decorator/user.decorator';
import { Public } from 'src/decorator/auth_global.decorator';


@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) { }

  @Post()
  @ResponseMessage("Create a new user rating")
  async create(@Body() createRatingDto: CreateRatingDto, @User() user: IUser) {
    return this.ratingsService.create(createRatingDto, user);
  }

  @Post('by-user')
  @ResponseMessage("Get rating by User")
  getRatingByUser(@User() user: IUser) {
    return this.ratingsService.findByUsers(user);
  }

  @Get()
  @ResponseMessage("Fetch all user rating with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.ratingsService.findAll(+currentPage, +limit, qs);
  }

  @Get("positive-ratings")
  @Public()
  @ResponseMessage("Get total positive rating")
  getPositiveRatings() {
    return this.ratingsService.getPositive();
  }
  @Get("negative-ratings")
  @Public()
  @ResponseMessage("Get total negatice rating")
  getNegativeRatings() {
    return this.ratingsService.getNegative();
  }
  @Get(':id')
  @ResponseMessage("Fetch a user rating by id")
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(id);
  }


  @Public()
  @Post('total-items')
  @ResponseMessage("Total user ratings")
  getTotal() {
    return this.ratingsService.getTotal();
  }

  @Patch(':id')
  @ResponseMessage("Update status user rating")
  updateStatus(@Param('id') id: string, @Body("status") status: string, @User() user: IUser) {
    return this.ratingsService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a user rating by id")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.ratingsService.remove(id, user);
  }
}