import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service";

interface CreateUserDto {
  name: string;
  email: string;
  age?: number;
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    // Example implementation to get all users
    return {
      message: "This action returns all users",
      users: await this.usersService.findAll(),
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    // Example implementation to get a specific user
    return {
      message: `This action returns user with id ${id}`,
      user: await this.usersService.findOne(parseInt(id)),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    // Example implementation to create a new user
    return {
      message: "User created successfully",
      user: await this.usersService.create(createUserDto),
    };
  }

  @Head(":id")
  @HttpCode(HttpStatus.OK)
  async checkExists(@Param("id") id: string) {
    // HEAD request typically returns no body, just status code
    // This method checks if a user exists
    await this.usersService.checkExists(id);
    // No return is needed as HEAD requests don't return bodies
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    // Example implementation to delete a user
    await this.usersService.remove(parseInt(id));
    // No need to return anything for 204 No Content response
  }
}
