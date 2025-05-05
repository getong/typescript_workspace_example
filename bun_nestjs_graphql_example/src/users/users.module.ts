import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { User } from "./entities/user.entity";
import { ExampleMiddleware } from "./middlewares/example/example.middleware";
import { AnotherMiddleware } from "./middlewares/another/another.middleware";
import { UsersController } from "./users.controller";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "../common/interceptors/logging.interceptor";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersResolver,
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExampleMiddleware, AnotherMiddleware)
      .forRoutes(
        { path: "users", method: RequestMethod.ALL },
        { path: "users/:id", method: RequestMethod.ALL },
      );
  }
}
