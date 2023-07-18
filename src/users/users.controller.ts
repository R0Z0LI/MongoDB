import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async addUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const generatedId = await this.userService.insertUsers(
      name,
      email,
      password,
    );
    return { id: generatedId };
  }

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }
}
