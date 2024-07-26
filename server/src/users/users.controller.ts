import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { FindOptionsWhere } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/all')
  async findAll(): Promise<User[]> {
    return await this.service.findAll();
  }

  @Get('/get-one-user-by')
  async getOneBy(@Body() options: FindOptionsWhere<User>): Promise<User> {
    const users = await this.service.findOneBy(options);

    return users;
  }

  @Post('/create')
  async create(@Body() data: CreateUserDto): Promise<User | null> {
    const user = await this.service.create(data);

    return new User({ ...user });
  }
}
