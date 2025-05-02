import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserDto } from '../dtos/user.dto';

@Controller('test')
export class TestController {
  // Test basic endpoint - middleware and interceptor will be applied
  @Get()
  getHello() {
    return { message: 'Hello from NestJS!' };
  }

  // Test ValidationPipe with DTO
  @Post('validate')
  validateData(@Body() createUserDto: CreateUserDto) {
    // If validation passes, you'll get the data
    return {
      message: 'Validation successful!',
      user: createUserDto,
    };
  }

  // Test guard explicitly on this endpoint
  @Get('protected')
  @UseGuards(AuthGuard)
  getProtected() {
    return { message: 'This is a protected endpoint!' };
  }

  // Test error handling through interceptor
  @Get('error')
  getError() {
    throw new Error('Test error for interceptor');
  }
}
