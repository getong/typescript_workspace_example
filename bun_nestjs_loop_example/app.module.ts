import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ProjectsModule } from "./projects/projects.module";
import { TestController } from "./controllers/test.controller";
import { UsersController } from "./controllers/users.controller";
import { ProjectsController } from "./controllers/projects.controller";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { UserGuard } from "./guards/user.guard";
import { ProjectGuard } from "./guards/project.guard";
import { AuthGuard } from "./guards/auth.guard";
import { UsersModule } from './src/users/users.module';

@Module({
  imports: [UsersModule, ProjectsModule],
  controllers: [TestController, UsersController, ProjectsController],
  providers: [LoggingInterceptor, UserGuard, ProjectGuard, AuthGuard],
})
export class AppModule {}
