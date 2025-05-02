import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ProjectsModule } from "./projects/projects.module";
import { TestController } from './controllers/test.controller';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [UsersModule, ProjectsModule],
  controllers: [TestController],
  providers: [LoggingInterceptor, AuthGuard],
})
export class AppModule {}
