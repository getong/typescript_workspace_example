import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserGuard } from "../guards/user.guard";
import { CreateUserDto } from "../dtos/user.dto";

@Controller("users")
@UseGuards(UserGuard) // Apply UserGuard to all routes in this controller
export class UsersController {
  @Get()
  findAll() {
    return {
      users: [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ],
    };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return {
      message: "User created",
      user: createUserDto,
    };
  }

  @Get(":id")
  findOne() {
    return { id: 1, name: "User 1" };
  }
}
