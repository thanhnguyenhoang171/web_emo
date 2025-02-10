import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/users/users.interface';
import { Public } from 'src/decorator/auth_global.decorator';
import { ResponseMessage } from 'src/decorator/response.decorator';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) { }

  @Post()
  @ResponseMessage("Create new Type")
  create(@Body() createTypeDto: CreateTypeDto, @User() user: IUser) {
    return this.typesService.create(createTypeDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch List Type with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {

    return this.typesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.typesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTypeDto: UpdateTypeDto,
    @User() user: IUser
  ) {
    return this.typesService.update(id, updateTypeDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser //req.user
  ) {
    return this.typesService.remove(id, user);
  }
}
